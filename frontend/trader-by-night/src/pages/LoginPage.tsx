import React, { useState, useEffect } from 'react';
import { ENV } from '../config/env';
import logo from '../assets/TPICAP_Master_logo_RGB.png';

type AuthStep = 'CREDENTIALS' | 'OTP' | 'SUCCESS';

interface ServerAPIResponse {
  success: boolean;
  message: string;
  token?: string; 
  username?: string;
}

interface LoginPageProps {
  onAuthSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpToken, setOtpToken] = useState<string>('');
  
  const [currentStep, setCurrentStep] = useState<AuthStep>('CREDENTIALS');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown ticker
  const [countdown, setCountdown] = useState<number>(5);

  // 1: Process raw credentials payload request
  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${ENV.API_URL}/api/trade/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.toUpperCase().trim(),
          password: password
        }),
      });

      const json: ServerAPIResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Verification initialization exception.');
      }

      setSuccessMessage(json.message); 
      setCurrentStep('OTP'); // slides the UI to reveal the OTP form
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication system mismatch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2: Process OTP verification
  const handleOtpVerifySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${ENV.API_URL}/api/trade/validate_otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username.toUpperCase().trim(),
          otp: otpToken.trim()
        }),
      });

      const json: ServerAPIResponse = await response.json();

      if (!response.ok || !json.success) {
        setSuccessMessage(null);
        throw new Error(json.message || 'Invalid or expired network access token.');
      }

      if (json.token) {
        localStorage.setItem('trader_token', json.token);
        localStorage.setItem('trader_username', json.username || username.toUpperCase());
      }

      setErrorMessage(null);
      setSuccessMessage("OTP validation successful");
      setCurrentStep('SUCCESS'); 
      setCountdown(10); // set secs for closing form
      
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Token payload validation error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // on SUCCESS
  useEffect(() => {
    if (currentStep !== 'SUCCESS') return;

    // Ticks every 1 second to update the visual text
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
        }
        return prev - 1;
      });
  }, 1000);

  // Holds the view for exactly 5000 milliseconds (5 seconds) before rendering the blotter
  const timeout = setTimeout(() => {
    onAuthSuccess(); 
  }, 5000);

  // Clean up timers
  return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentStep, onAuthSuccess]);

  return (
    <div style={pageOverlayStyle}>

      <div className="blotter-card" style={loginCardStyle}>
        <div style={headerBlockStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo d-flex align-items-center justify-content-center fw-bold">
              <img src={logo} style={{
                width: '120%',
                height: '120%',
                objectFit: 'cover'
              }} />
            </div>
          </div>
          <p className="text-cyan-light letter-spacing-1" style={subtitleStyle}>
            {currentStep === 'CREDENTIALS' 
              ? 'DASHBOARD LOGIN' 
              : 'MULTI-FACTOR VALIDATION INTERFACE'}
          </p>
        </div>
        <div 
        key={currentStep}
        style={{
            animation: 'formFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}
        >
    
        {/* For Success Notice Banner */}
        {successMessage && (
          <div style={successBannerStyle} className="font-mono">
            <span style={{ marginRight: '6px' }}>✓</span> {successMessage}
          </div>
        )}

        {/* For Error Exception Notice Banner */}
        {errorMessage && (
          <div style={errorBannerStyle} className="font-mono">
            <span style={{ marginRight: '6px' }}>⚠️</span> {errorMessage}
          </div>
        )}

        {/* Set Conditions */}
        {currentStep === 'CREDENTIALS' && (
          /* 1st Form Credentials Input Capture */
          <form onSubmit={handleCredentialsSubmit} style={formLayoutStyle}>
            <div style={inputContainerStyle}>
              <label style={labelStyle} className="text-cyan-light tracking-widest font-mono">
                USERNAME
              </label>
              <input
                type="text"
                className="blotter-input font-mono w-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@tpicap.com"
                required
                disabled={isSubmitting}
                style={inputOverrideStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <label style={labelStyle} className="text-cyan-light tracking-widest font-mono">
                PASSWORD
              </label>
              <input
                type="password"
                className="blotter-input font-mono w-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••"
                required
                disabled={isSubmitting}
                style={inputOverrideStyle}
              />
            </div>

            <div style={actionsRowStyle}>
              <button type="submit" className="submit-btn font-mono" disabled={isSubmitting} style={btnHeightOverrideStyle}>
                {isSubmitting ? 'VERIFYING...' : 'LOGIN'}
              </button>
            </div>
          </form>
        )}

        {/* 2nd FORM 6-Digit Code Verification Input */}
        {currentStep === 'OTP' && (
        <form onSubmit={handleOtpVerifySubmit} style={formLayoutStyle}>
            <div style={inputContainerStyle}>
            <label style={labelStyle} className="text-cyan-light tracking-widest font-mono">
                ENTER 6-DIGIT OTP
            </label>
            <input
                type="text"
                maxLength={6}
                className="blotter-input font-mono w-100"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))} 
                placeholder="000000"
                required
                disabled={isSubmitting}
                style={{ 
                ...inputOverrideStyle, 
                letterSpacing: '0.3em', 
                fontSize: '1rem', 
                textAlign: 'center' 
                }}
            />
            </div>

            <div style={actionsRowStyle}>
            <button
                type="button"
                className="cancel-btn font-mono"
                disabled={isSubmitting}
                onClick={() => {
                setCurrentStep('CREDENTIALS');
                setOtpToken('');
                setErrorMessage(null);
                setSuccessMessage(null);
                }}
                style={btnHeightOverrideStyle}
            >
                BACK
            </button>
            <button type="submit" className="submit-btn font-mono" disabled={isSubmitting} style={{ ...btnHeightOverrideStyle, fontWeight: 600 }}>
                {isSubmitting ? 'AUTHORIZING...' : 'VERIFY & ENTER'}
            </button>
            </div>
        </form>
        )}

        {/* 3rd FORM for OTP confimation */}
        {currentStep === 'SUCCESS' && (
        <div style={{ ...formLayoutStyle, textAlign: 'center', padding: '24px 0' }} className="font-mono">
            <div style={{ fontSize: '3rem', color: '#00e699', marginBottom: '12px' }}>
            ✓
            </div>   
            <h5 style={{ color: '#00e699', margin: '0 0 8px 0', fontWeight: 600, letterSpacing: '0.08em', fontSize: '1rem' }}>
              AUTHENTICATION SUCCESSFUL
            </h5>
            
            <p className="text-cyan-light letter-spacing-1" style={{ fontSize: '0.74rem', margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Identity handshake verified. Secure access session initialized.
            </p>
            
            <div style={{ 
              marginTop: '12px', 
              color: '#8fa0b3', 
              fontSize: '0.72rem',
              backgroundColor: '#05080c',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #1c2733'
            }}>
              Loading Trade Blotter terminal dashboard in <strong style={{ color: '#00e699' }}>{countdown}s</strong>...
            </div>
        </div>
        )}
        </div>

        {/* Card Footer */}
        <div style={cardFooterStyle} className="font-mono letter-spacing-1 text-cyan-light">
          TRADE BLOTTER SYSTEM <span style={{ color: '#ff5353', fontWeight: 600 }}>v1</span>
        </div>
      </div>
    </div>
  );
};

// --- CSS-in-JS Architecture Theme Tokens ---
const pageOverlayStyle: React.CSSProperties = { width: '100vw', height: '100vh', backgroundColor: '#05080b', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' };
const loginCardStyle: React.CSSProperties = { width: '420px', border: '1px solid #141c26', borderRadius: '4px', padding: '32px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' };
const headerBlockStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px', borderBottom: '1px solid #10161f', paddingBottom: '16px', alignItems: 'center'};
const brandTitleStyle: React.CSSProperties = { margin: 0, fontSize: '1.15rem', color: '#cfd8dc', fontWeight: 700 };
const subtitleStyle: React.CSSProperties = { margin: 0, fontSize: '0.64rem', fontWeight: 500 };
const formLayoutStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle: React.CSSProperties = { fontSize: '0.66rem', fontWeight: 600 };
const inputOverrideStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', paddingLeft: '10px', height: '38px', fontSize: '0.78rem' };
const actionsRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' };
const btnHeightOverrideStyle: React.CSSProperties = { height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' };
const cardFooterStyle: React.CSSProperties = { marginTop: '28px', borderTop: '1px solid #10161f', paddingTop: '16px', fontSize: '0.62rem', textAlign: 'center' };
const errorBannerStyle: React.CSSProperties = {
backgroundColor: 'rgba(255, 83, 83, 0.08)',
border: '1px solid rgba(255, 83, 83, 0.25)',
color: '#ff5353',
fontSize: '0.72rem',
padding: '10px 12px',
borderRadius: '3px',
marginBottom: '20px',
lineHeight: 1.4
};
const successBannerStyle: React.CSSProperties = {
backgroundColor: 'rgba(0, 230, 153, 0.08)',
border: '1px solid rgba(0, 230, 153, 0.25)',
color: '#00e699',
fontSize: '0.72rem',
padding: '10px 12px',
borderRadius: '3px',
marginBottom: '20px',
lineHeight: 1.4
}; 