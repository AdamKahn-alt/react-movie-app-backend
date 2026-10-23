# React Movie Backend

Backend API for a private React movie application. It provides user registration,
authentication, logout, account deletion, and password-reset functionality.

## Features

- Express HTTP API
- MongoDB persistence through Mongoose
- User signup and login
- Password hashing with `bcryptjs`
- JWT authentication stored in an HTTP-only cookie
- Per-user authorization for account deletion
- Forgot-password and reset-password flows
- Welcome and password-reset emails through a local MailDev SMTP server
- Health-check endpoint

## Requirements

- Node.js 18 or newer
- npm
- A running MongoDB instance or MongoDB Atlas database
- MailDev for local email testing

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd react-movie-backend
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with the correct database URL and a real secret key.

## Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/react-movie` |
| `PORT` | Port used by the API | `3000` |
| `NODE_ENV` | Runtime environment | `production` |
| `SECRET_KEY` | Secret used to sign JWTs | A long random value |

Never commit `.env`. It contains local credentials and secrets. Use `.env.example`
as the configuration template.

## MailDev

The email service is configured for MailDev on:

- SMTP: `localhost:1025`
- Web interface: `http://localhost:1080`

Start MailDev in a separate terminal if email features are being tested:

```bash
npx maildev
```

Signup can still create a user if the welcome email cannot be sent, but the API
reports that the email failed. The password-reset flow requires MailDev to be
available when sending the reset email.

## Running the server

Start the development server:

```bash
npm run dev
```

The API starts after a successful MongoDB connection. By default, it is available
at:

```text
http://localhost:3000
```

## API endpoints

The user API base URL is:

```text
/api/v1/users
```

### Health check

```http
GET /health
```

### Sign up

```http
POST /api/v1/users/signup
Content-Type: application/json
```

Request body:

```json
{
  "username": "adam_khan",
  "email": "adam@example.com",
  "password": "password123"
}
```

Passwords must contain at least eight characters.

### Log in

```http
POST /api/v1/users/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "adam@example.com",
  "password": "password123"
}
```

Successful login sets a `token` cookie containing the JWT. Clients must preserve
and send this cookie with authenticated requests.

### Log out

```http
GET /api/v1/users/logout
```

### Request a password reset

```http
POST /api/v1/users/forgot-password
Content-Type: application/json
```

Request body:

```json
{
  "email": "adam@example.com"
}
```

When MailDev is running, the reset email can be viewed at
`http://localhost:1080`.

### Reset a password

```http
POST /api/v1/users/reset-password
Content-Type: application/json
```

Request body:

```json
{
  "token": "token-from-the-reset-link",
  "newPassword": "newpassword123"
}
```

Reset tokens expire after five minutes.

### Delete a user

```http
DELETE /api/v1/users/delete/:id
```

This endpoint requires the login cookie. The authenticated user can delete only
the account whose ID is in the URL.

Example:

```text
DELETE /api/v1/users/delete/6ad9f7a13a176001d210a179
```

## Project structure

```text
.
├── app.js
├── server.js
├── package.json
├── src
│   ├── controllers
│   │   └── userController.js
│   ├── middlewares
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   └── jwt.js
│   ├── models
│   │   └── userModel.js
│   ├── routes
│   │   └── userRoute.js
│   └── services
│       ├── emailService.js
│       ├── passwordResetService.js
│       └── publicUser.js
└── .env.example
```

## Notes for frontend integration

- The frontend must send credentials when making cross-origin requests so the
  authentication cookie is included.
- The backend currently allows origins `http://localhost:5173` and
  `http://127.0.0.1:5173`.
- The frontend should not expect the JWT in the JSON response; authentication is
  handled through the `token` cookie.

## Testing

The project does not currently contain an automated test suite. You can test the
endpoints with Bruno, Postman, or the frontend application.

## License

This project is currently private and does not define a public open-source
license.
