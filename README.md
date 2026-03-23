# CSC3916 Assignment 4 - Movies API with Reviews

A RESTful API built with Node.js, Express, and MongoDB for managing movies and reviews with JWT authentication and Google Analytics tracking.

## Deployed URL

- **API:** https://csc3916-assignment4-fbqo.onrender.com

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with:
```
   DB=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret
   GA_MEASUREMENT_ID=your_google_analytics_id
   GA_API_SECRET=your_google_analytics_secret
```
4. Run `node server.js`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create a new user (name, username, email, password) |
| POST | `/signin` | Login and get JWT token |

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Get all movies |
| GET | `/movies/:title` | Get a specific movie |
| GET | `/movies/:title?reviews=true` | Get movie with all reviews |
| POST | `/movies` | Create a movie |
| PUT | `/movies/:title` | Update a movie |
| DELETE | `/movies/:title` | Delete a movie |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | Get all reviews |
| POST | `/reviews` | Create a review |

## Review Schema
```javascript
{
  movieId: ObjectId (reference to Movie),
  username: String,
  review: String,
  rating: Number (0-5)
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB` | MongoDB connection string |
| `SECRET_KEY` | JWT secret key |
| `GA_MEASUREMENT_ID` | Google Analytics Measurement ID |
| `GA_API_SECRET` | Google Analytics API Secret |

## Postman Collection

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/41547135-c0ed9a64-4ce5-4ea0-a1de-3b4fbaaee498?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D41547135-c0ed9a64-4ce5-4ea0-a1de-3b4fbaaee498%26entityType%3Dcollection%26workspaceId%3D7ca8359f-ca27-4671-bea7-1a0170606de5#?env%5BCho%20-%20HW4%5D=W3sia2V5IjoidXJsIiwidmFsdWUiOiJodHRwczovL2NzYzM5MTYtYXNzaWdubWVudDQtZmJxby5vbnJlbmRlci5jb20iLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6Imh0dHBzOi8vY3NjMzkxNi1hc3NpZ25tZW50NC1mYnFvLm9ucmVuZGVyLmNvbSIsImNvbXBsZXRlU2Vzc2lvblZhbHVlIjoiaHR0cHM6Ly9jc2MzOTE2LWFzc2lnbm1lbnQ0LWZicW8ub25yZW5kZXIuY29tIiwic2Vzc2lvbkluZGV4IjowfV0=)