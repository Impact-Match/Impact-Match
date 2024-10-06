const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/auth"); // Import the passport setup
const authRoutes = require("./routes/auth"); // Import the auth routes
const profileRoutes = require("./routes/profile"); // Import the auth routes
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 8000;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Specify the OpenAPI version
    info: {
      title: "Impact Match",
      version: "1.0.0",
      description: "API documentation for your application",
    },
    servers: [
      {
        url: "http://localhost:8000", // Your API server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

// Initialize Swagger JSDoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const cors = require('cors');
app.use(cors({ 
  origin: process.env.REACT_APP, 
  credentials: true,
}));  // Assuming React runs on port 3000

// Middleware for session management
app.use(
  session({
    secret: "yourSecretKey", // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,  // Set to true in production with HTTPS
      httpOnly: true,  // Helps prevent cross-site scripting (XSS)
      maxAge: 1000 * 60 * 60 * 24 * 7,  // 1 day expiration for example
    },
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session()); // Initialize Passport session

// Routes
app.use("/auth", authRoutes); // All sign up/login-related routes go under /auth
app.use("/profile", profileRoutes); 

// Home route
app.get("/", (req, res) => {
  res.send('<h1>Welcome</h1><a href="/auth/google">Login with Google</a>');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
