# React Movie Backend

Express/Mongoose backend for the React Movie application. The API provides user
registration, cookie-based authentication, logout, account deletion, and
password reset by email.

## Features

- Express 5 HTTP API
- MongoDB persistence through Mongoose
- User signup and login
- Authenticated current-user and profile endpoints
- Password hashing with `bcryptjs`
- JWT authentication in an HTTP-only `token` cookie
- Per-user authorization for account deletion
- Forgot-password and reset-password flows
- Per-user movie and series watchlists
- Configurable SMTP email delivery through Nodemailer
- Automatic MailDev startup in development
- Health-check endpoint

## Requirements

- Node.js 18 or newer
- npm
- MongoDB or MongoDB Atlas
- SMTP credentials for email in production

## Installation

```bash
git clone <repository-url>
cd react-movie-backend
npm install
```

Create a local environment file from the template:

```bash
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead. Update `.env` before
starting the server. Never commit `.env`; it contains credentials and secrets.

## Configuration

The application loads variables from `.env`. The complete template is in
[.env.example](.env.example).

| Variable | Required | Description | Local example |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | MongoDB connection string | `mongodb://localhost:27017/react-movie` |
| `PORT` | Yes | API listening port | `3000` |
| `NODE_ENV` | Yes | Use `development` for automatic MailDev; use `production` for deployed SMTP | `development` |
| `SECRET_KEY` | Yes | Long random key used to sign and verify JWTs | `replace-with-a-long-random-secret` |
| `EMAIL_HOST` | Yes for email | SMTP host; defaults to `localhost` | `localhost` |
| `EMAIL_PORT` | Yes for email | SMTP port; defaults to `1025` | `1025` |
| `EMAIL_FROM` | Recommended | Sender address used by welcome and reset emails | `noreply@react-movie.com` |
| `EMAIL_USER` | Production | SMTP username; omit for local MailDev | — |
| `EMAIL_PASSWORD` | Production | SMTP password/key; omit for local MailDev | — |
| `RESET_PASSWORD_LOCATION` | Yes for reset email | Frontend URL that receives `?token=...` | `http://localhost:5173/reset-password` |

For production SMTP, set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_FROM`, `EMAIL_USER`,
and `EMAIL_PASSWORD` to the values supplied by the provider. Port `465` uses
TLS; other ports use the transport's non-implicit-TLS mode. The repository
template includes a Brevo configuration example.

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running

Development mode starts the API with Nodemon. When `NODE_ENV=development`, the
server also starts MailDev automatically:

```bash
npm run dev
```

Production-style startup:

```bash
npm start
```

The `build` script runs `npm install`, which is suitable for deployment
platforms that expect a build command. The API listens on the configured
`PORT` after MongoDB connects. For the default configuration:

```text
http://localhost:3000
```

In development, MailDev is available at:

- SMTP: `localhost:1025`
- Web interface: `http://localhost:1080`

MailDev is only started by `server.js` when `NODE_ENV=development`. Signup
still creates the account if the welcome email cannot be sent, and reports
`welcomeEmailSent: false`. A password-reset request fails if its email cannot
be sent.

## API

All user endpoints use the base path:

```text
/api/v1/users
```

JSON endpoints return a `success` boolean and a descriptive `message`. User
objects returned in `data.user` do not include the password or Mongoose
internal version field.

### Health check

```http
GET /health
```

Returns `200` with:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

### Sign up

```http
POST /api/v1/users/signup
Content-Type: application/json
```

Request:

```json
{
  "username": "adam_khan",
  "email": "adam@example.com",
  "password": "password123"
}
```

`username`, `email`, and `password` are required. Passwords must contain at
least eight characters. Email is normalized to lowercase. Usernames and email
addresses are unique.

### Log in

```http
POST /api/v1/users/login
Content-Type: application/json
```

Request:

```json
{
  "email": "adam@example.com",
  "password": "password123"
}
```

Email is normalized to lowercase. A successful login returns the public user
and sets an HTTP-only `token` cookie. The JWT expires after 20 minutes; the
cookie has a one-hour lifetime. The JWT is not returned in the JSON response.

### Log out

```http
GET /api/v1/users/logout
```

Clears the `token` cookie and returns `204 No Content`.

### Get the current user

```http
GET /api/v1/users/me
Cookie: token=<jwt>
```

Requires authentication and returns the signed-in user's `username` and
`email`:

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "username": "adam_khan",
      "email": "adam@example.com"
    }
  }
}
```

### Get the current user's profile

```http
GET /api/v1/users/fetch-profile
Cookie: token=<jwt>
```

Requires authentication and returns the current user's public profile. The
response excludes the password and Mongoose's internal `__v` field.

### Request a password reset

```http
POST /api/v1/users/forgot-password
Content-Type: application/json
```

Request:

```json
{
  "email": "adam@example.com"
}
```

For an existing account, the API emails a reset link using
`RESET_PASSWORD_LOCATION`. Reset links contain a JWT that expires after five
minutes. The response uses the same message whether or not the email exists.

### Reset a password

```http
POST /api/v1/users/reset-password
Content-Type: application/json
```

Request:

```json
{
  "token": "token-from-the-reset-link",
  "newPassword": "newpassword123"
}
```

Both fields are required and the new password must contain at least eight
characters. Invalid or expired tokens return `401`.

### Delete a user

```http
DELETE /api/v1/users/delete/:id
Cookie: token=<jwt>
```

The request must be authenticated. The authenticated user may delete only the
account whose MongoDB ID is in the URL; otherwise the API returns `403`.

Example:

```text
DELETE /api/v1/users/delete/6ad9f7a13a176001d210a179
```

### Add media to a watchlist

```http
POST /api/v1/users/add-to-watchlist
Content-Type: application/json
Cookie: token=<jwt>
```

Request:

```json
{
  "tmdbId": "603",
  "title": "The Matrix",
  "posterPath": "/path-to-poster.jpg",
  "rating": 8.7,
  "overview": "A computer hacker learns the truth about reality.",
  "mediaType": "movie"
}
```

This endpoint requires authentication. `mediaType` must be either `movie` or
`series`, and `rating` must be a number from `0` to `10`. The same user cannot
save the same `tmdbId` more than once, but different users can save the same
media. A duplicate for the current user returns `409 Conflict`.

### View the current user's watchlist

```http
GET /api/v1/users/view-watchlists
Cookie: token=<jwt>
```

Returns only the watchlist media belonging to the authenticated user. An empty
watchlist returns `200` with an empty list.

### Remove media from a watchlist

```http
DELETE /api/v1/users/delete-watchlist/:tmdbId
Cookie: token=<jwt>
```

Deletes the matching media only from the authenticated user's watchlist.

## Watchlist database behavior

Watchlist documents store the authenticated user's MongoDB `_id` in the
`user` field. The `user` field is a Mongoose `ObjectId` reference to the `user`
model.

The watchlist schema defines a unique compound MongoDB index on `{ user,
tmdbId }`. This is a database-level constraint that prevents duplicate media
for one user while allowing the same media in multiple users' watchlists. On
startup, `server.js` runs `WatchList.syncIndexes()` after connecting to
MongoDB. This synchronizes the collection's indexes with the schema and removes
obsolete indexes left by older versions of the watchlist schema.

## Frontend integration

- Send credentials on cross-origin requests so the authentication cookie is
  included. For `fetch`, use `credentials: "include"`.
- CORS allows `http://localhost:5173`, `http://127.0.0.1:5173`,
  `http://localhost:5174`, `http://localhost:5175`, `http://localhost:5500`,
  and `127.0.0.1:5500`, with credentials enabled.
- The frontend must use the same cookie-aware client for authenticated requests.
- The frontend should not expect the JWT in the JSON response.
- Use `GET /api/v1/users/me` to load the signed-in user's basic identity.
- Use `GET /api/v1/users/fetch-profile` to load the signed-in user's public
  profile.
- Configure `RESET_PASSWORD_LOCATION` to the frontend route that reads the
  reset token from the query string.

## Project structure

```text
.
├── app.js
├── server.js
├── package.json
├── .env.example
└── src
    ├── controllers
    │   └── userController.js
    ├── middlewares
    │   ├── authenticate.js
    │   ├── authorize.js
    │   └── jwt.js
    ├── models
    │   ├── userModel.js
    │   └── watchListModel.js
    ├── routes
    │   └── userRoute.js
    └── services
        ├── emailService.js
        ├── passwordResetService.js
        └── publicUser.js
```

## Testing

There is currently no automated test suite (`npm test` is a placeholder that
exits with an error). Exercise the API with the frontend, Bruno, Postman, or
another HTTP client after starting MongoDB and configuring email delivery.

## License

This project is private and does not currently define a public open-source
license.
