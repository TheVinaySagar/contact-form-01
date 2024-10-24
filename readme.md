



# Contact Form with Email Validation

A modern, responsive contact form with email validation using Mailjet API. The project includes a main contact form and a separate email validation feature to ensure email authenticity before message submission.


https://github.com/user-attachments/assets/f92500c4-94d1-4a95-b3c8-89c04cb5e101
## Features

- 🎨 Responsive contact form with modern design
- ✉️ Email validation using Mailjet API
- 🔒 Server-side input validation
- ⚡ Real-time form validation
- 📱 Mobile-friendly interface
- 🚀 Success/Error notifications
- 💌 HTML/Text email format support

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12 or higher)
- npm (Node Package Manager)
- A Mailjet account with API credentials

## Installation

1. Clone the repository:
```bash
git clone https://github.com/TheVinaySagar/contact-form-01.git
cd contact-form-01
```

2. Install dependencies:
```bash
npm install 
```

3. Create a `.env` file in the root directory and add your Mailjet credentials:
```env
MJ_APIKEY_PUBLIC=your_mailjet_public_key
MJ_APIKEY_PRIVATE=your_mailjet_private_key
RECIPIENT_EMAIL=your_email@domain.com
RECIPIENT_NAME=Your Name
PORT=8080 # Optional, defaults to 8080
```

## Main Project Structure

```
├── public/
│   ├── index.html        # Main contact form page
│   ├── validate.html     # Email validation page
│   └── js/
│       └── main.js       # Form handling and validation
├── server.js            # Express server and API endpoints
└── .env                #enviroment variables
└── readme.md
```

## Running the Application

1. Start the server:
```bash
node server.js
```

2. Access the application:
- Open your browser and navigate to `http://localhost:8080`
- The email validation page is available at `http://localhost:8080/validate`

## API Endpoints

### Send Email
- **POST** `/send-email`
- Handles contact form submissions
- Requires: `name`, `email`, `subject`, `message`

### Validate Email
- **POST** `/validate-email`
- Validates email address using Mailjet
- Requires: `email`

## Security Features

- Input validation for all form fields
- Email format validation
- Server-side validation
- Environment variables for sensitive data
- Error handling and logging

## Dependencies

- express
- body-parser
- node-mailjet
- dotenv

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email vinaysagar4445@gmail.com or open an issue in the GitHub repository.

## Acknowledgments

- Built with [Express](https://expressjs.com/)
- Email services by [Mailjet](https://www.mailjet.com/)
- Frontend form validation using jQuery
