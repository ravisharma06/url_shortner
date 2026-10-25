# URL Shortener — Software Requirements Specification

This project is a specification and implementation guide for a small URL-shortening app. It describes the planned features, requirements, API, data model, user interface, and suggested build order.

> **Project status:** The application is not implemented yet. The sections below describe the planned React frontend, Express backend, and MongoDB data store.

## Planned application

The app will accept a long web URL, create a short link, redirect visitors to the original URL, and count successful visits. It is planned as a MERN-stack application: MongoDB, Express, React, and Node.js.

### Planned features

- Create a short link from a valid URL
- Generate a unique six-character code from `a-z`, `A-Z`, and `0-9`
- Redirect short links to their original destinations with HTTP `302`
- Increase the click count when a short link is opened
- List links newest first, including the original URL, short URL, click count, and creation date
- Copy a short link and delete a link after confirmation
- Display clear validation, loading, empty-list, and not-found states

Authentication, custom aliases, link expiry, analytics dashboards, rate limiting, and an admin panel are outside the initial scope. Custom aliases, duplicate-URL handling, link expiry, and QR codes are listed as optional stretch goals in the SRS.

## Requirements and behavior

The server must validate submitted URLs before saving them:

- The value must not be empty.
- The URL must be no longer than 2,048 characters.
- It must parse as a URL and use either `http:` or `https:`.
- Invalid input returns HTTP `400` with an explanatory message.

Short codes must be unique. The planned database uses a unique index on `shortCode`; clicks should be incremented atomically with MongoDB's `$inc` operator. A missing short code returns a not-found response. The SRS targets redirects under 300 ms and mobile layouts from 360 px wide.

## Planned API

The API base URL for local development is `http://localhost:3000`.

| Method | Endpoint | Purpose | Success |
| --- | --- | --- | --- |
| `POST` | `/api/urls` | Validate and create a short link. Request body: `{ "originalUrl": "https://example.com" }` | `201` with the created link |
| `GET` | `/api/urls` | List all links, newest first | `200` with an array of links |
| `DELETE` | `/api/urls/:shortCode` | Delete a link by its code | `200` with a message |
| `GET` | `/:shortCode` | Increment the click count and redirect to the original URL | `302` redirect |

Invalid URLs return `400`; missing links return `404`. JSON API responses are planned to use a consistent shape:

```json
{
  "success": true,
  "data": {
    "_id": "66e1f0c2a9b3...",
    "originalUrl": "https://example.com/long/link",
    "shortCode": "aZ3kP9",
    "shortUrl": "http://localhost:3000/aZ3kP9",
    "clicks": 0,
    "createdAt": "2026-09-11T10:30:00.000Z"
  }
}
```

The short URL is built from `BASE_URL` and `shortCode`; it is not stored as a separate database field. Register the catch-all `GET /:shortCode` route after the API routes so it does not intercept them.

## Planned data model

The app will use a MongoDB `urls` collection. Each document is planned to contain:

| Field | Type | Rules |
| --- | --- | --- |
| `originalUrl` | String | Required, trimmed, maximum 2,048 characters |
| `shortCode` | String | Required and unique |
| `clicks` | Number | Defaults to `0`; incremented on successful redirects |
| `createdAt`, `updatedAt` | Date | Added automatically with Mongoose timestamps |

## Planned technology and structure

The SRS proposes:

- **Backend:** Node.js, Express, Mongoose, MongoDB, CORS, and dotenv
- **Frontend:** React with Vite and Axios

The future application is expected to follow a structure similar to:

```text
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/url.model.js
│   │   ├── controllers/url.controller.js
│   │   ├── routes/url.routes.js
│   │   ├── utils/generateCode.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── .env.example
└── frontend/
    └── src/
        ├── api/urls.js
        ├── components/ShortenForm.jsx
        ├── components/ResultCard.jsx
        ├── components/UrlList.jsx
        └── App.jsx
```

Example backend environment configuration from the SRS:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/url-shortener
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
```

Keep real environment files such as `.env` out of version control. Provide a `.env.example` with non-secret development defaults.

## Suggested implementation order

1. Set up the backend and connect to MongoDB.
2. Create the URL model and short-code generator.
3. Implement and test URL creation and validation.
4. Implement and test listing, redirect/click counting, and deletion.
5. Create the Vite React frontend and API client.
6. Build the form, result card, and link list with copy/delete actions.
7. Test the full flow: shorten a link, open it, and confirm the click count increases.

## Future improvements

Optional extensions described in the SRS include custom aliases, returning an existing link for duplicate URLs, automatic expiry using a MongoDB TTL index, and QR-code generation.
