const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();

// Rate limiting rules
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 1000, // Limit for each IP requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'You have exceeded your request limit. Please try again in 5 minutes.'
  }
});

const tenantAuthRoutes =
    require("./routes/tenantAuthRoutes");

const tradersRoutes =
    require("./routes/tradersRoutes");

const booksRoutes =
    require("./routes/booksRoutes");

const instrumentsRoutes =
    require("./routes/instrumentsRoutes");
  
const counterpartiesRoutes =
    require("./routes/counterpartiesRoutes");

const tradesRoutes =
    require("./routes/tradesRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);

app.use("/api", tenantAuthRoutes);
app.use("/api", tradersRoutes);
app.use("/api", booksRoutes);
app.use("/api", instrumentsRoutes);
app.use("/api", counterpartiesRoutes);
app.use("/api", tradesRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});