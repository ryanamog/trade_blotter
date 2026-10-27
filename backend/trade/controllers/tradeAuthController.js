const Trade = require("../models/tradeAuthModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Middleware to validate JWT
function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token is missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

exports.login = async (req, res) => {
    console.log(req.body.username);
    try {

        const user =
            await Trade.validateUsername(req.body.username);

        /** validate if username is valid */   
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        /** check if user is locked */
        if (
            user.locked_until &&
            new Date(user.locked_until) > new Date()
        ) {

            const log = 
                await Trade.createLog(user.tuser_id, user.username, 'locked', 'Account currently locked');
        
            return res.status(423).json({
                success: false,
                message: `Account locked until ${user.locked_until}`
            });

        }

        /*
        |--------------------------------------------------------------------------
        | VERIFY PASSWORD
        |--------------------------------------------------------------------------
        */
        console.log('Username:', user.username);
        console.log('Password:', req.body.password);
        console.log('Hash:', user.password_hash);
        
        const validPassword =
            await bcrypt.compare(
                req.body.password,
                user.password_hash
            );

        console.log(validPassword);
        
        if (!validPassword) {

            const failedAttempts =
                user.failed_attempts + 1;

            /*
            |--------------------------------------------------------------------------
            | LOCK ACCOUNT
            |--------------------------------------------------------------------------
            */

            if (failedAttempts >= MAX_ATTEMPTS) {

                await Trade.failedAttemptsLock(failedAttempts, LOCK_MINUTES, user.tuser_id);

                await Trade.createLog(user.tuser_id, user.username, 'locked', 'Maximum failed attempts reached');
        
                return res.status(423).json({
                    success: false,
                    message: `Account locked for ${LOCK_MINUTES} minutes`
                });

            }

            /*
            |--------------------------------------------------------------------------
            | UPDATE FAILED ATTEMPTS
            |--------------------------------------------------------------------------
            */
            await Trade.failedAttempts(failedAttempts, user.tuser_id);

            await Trade.createLog(user.tuser_id, user.username, 'failed', 'Invalid password');

            return res.status(401).json({
                success: false,
                message: `Invalid password (${failedAttempts}/${MAX_ATTEMPTS})`
            });
        }
        
         /*
        |--------------------------------------------------------------------------
        | CREATE OTP
        |--------------------------------------------------------------------------
        */
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
    
        const otpHash = await bcrypt.hash(otp, 10);
    
        const expiryDate = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await Trade.createOtp(user.username, otpHash, expiryDate);
       
        /** send opt email */
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: user.username,
            subject: "Your Login OTP",
            html: `
                <h2>Login Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            `
        });
        
        res.status(201).json({
            success: true,
            message: "OTP has been sent successfully to the provided email address." 
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.validateOtp = async (req, res) => {

    try {
        const email = req.body.email;
        const otp = req.body.otp;


        const record =
            await Trade.validateOtp(email);

        /** validate last otp */   
        if (!record) {
            return res.status(404).json({
                success: false,
                message: "The provided OTP or verification session does not exist."
            });
        }

        if (new Date() > new Date(record.expires_at)) {
            return res.status(400).json({
            success: false,
            message: "OTP expired"
            });
        }
    
        const match = await bcrypt.compare(
            otp,
            record.otp_hash
        );
    
        if (!match) {
            return res.status(400).json({
            success: false,
            message: "Invalid OTP"
            });
        }

        await Trade.updateOtp(record.id);

        const token = jwt.sign(
            {
            email: email
            },
            process.env.JWT_SECRET,
            {
            expiresIn: "24h"
            }
        );
        
        res.json({
            success: true,
            token
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.validateToken = async (req, res) => {

    try {
         res.status(200).json({
            success: true,
            message: "token valid"
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};