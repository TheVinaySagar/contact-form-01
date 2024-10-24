// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Mailjet = require('node-mailjet');

/**
 * Initialize Mailjet with API credentials
 * MJ_APIKEY_PUBLIC and MJ_APIKEY_PRIVATE should be defined in .env file
 */
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

// Server configuration
const PORT = process.env.PORT || 8080; // Use PORT from env or default to 8080

// Initialize Express application
const app = express();

// Middleware Configuration
//----------------------------------------
// Serve static files from 'public' directory
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

/**
 * Middleware to validate email form input
 * Checks for:
 * 1. All required fields are present
 * 2. Valid email format
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateEmailInput = (req, res, next) => {
    // Extract form fields from request body
    const { name, email, subject, message } = req.body;

    // Check if all required fields are present
    if ((!name || !email || !subject || !message)) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format'
        });
    }

    // If all validations pass, proceed to next middleware
    next();
};

const validateEmailInputONLY = (req, res, next) => {
    // Extract form fields from request body
    const { name, email, subject, message } = req.body;

    // Check if all required fields are present
    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format'
        });
    }

    // If all validations pass, proceed to next middleware
    next();
};



// Route Handlers
//----------------------------------------

/**
 * GET / - Serve the main HTML page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /send-email - Handle contact form submission
 * Validates input and sends email using Mailjet
 */

app.get('/validate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'validate.html'));
});

app.post('/validate-email', validateEmailInputONLY, async (req,res) =>
{
    const {email} = req.body;
    try
    {
        const request = mailjet
	.post("sender", {'version': 'v3'})
	.id(email)
	.action("validate")
	.request()
request
	.then((result) => {
		console.log(result.body)
        res.json({
            status: 'success',
            message: 'Validation Email sent successfully!'
        });
	})
    }   
	catch (error) {
        // Log any errors that occur during email sending
        console.error('Email sending failed:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            statusCode: error.statusCode,
            sender: email
        });

        // Send error response to client
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: 'Failed to send email. Please try again later.'
        });
    }
})
app.post('/send-email', validateEmailInput, async (req, res) => {
    // Extract form data from request body
    const { name, email, subject, message } = req.body;

    try {
        // Prepare HTML version of email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h3>New Contact Form Submission</h3>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="margin-top: 20px;">
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            </div>
        `;

        // Prepare plain text version of email content (for email clients that don't support HTML)
        const textContent = `
            New Contact Form Submission
            From: ${name} (${email})
            Subject: ${subject}
            Message:
            ${message}
        `;

        // Send email using Mailjet API
        const request = await mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: email,
                            Name: "Contact Form"
                        },
                        To: [
                            {
                                Email: process.env.RECIPIENT_EMAIL,
                                Name: process.env.RECIPIENT_NAME
                            }
                        ],
                        Subject: `Contact Form: ${subject}`,
                        TextPart: textContent,
                        HTMLPart: htmlContent,
                    }
                ]
            });

        // Log successful email submission
        console.log('Email sent successfully:', {
            timestamp: new Date().toISOString(),
            sender: email,
            subject: subject
        });

        // Send success response to client
        res.json({
            status: 'success',
            message: 'Email sent successfully!'
        });

    } catch (error) {
        // Log any errors that occur during email sending
        console.error('Email sending failed:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            statusCode: error.statusCode,
            sender: email
        });

        // Send error response to client
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: 'Failed to send email. Please try again later.'
        });
    }
});

/**
 * Global error handling middleware
 * Catches any unhandled errors in the application
 */
app.use((err, req, res, next) => {
    // Log the error stack trace
    console.error(err.stack);
    
    // Send generic error response to client
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});