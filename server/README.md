# URL Shortener API

Express and MongoDB backend for the URL shortener application.

## Requirements

- Node.js
- MongoDB running locally or a MongoDB connection URI

## Setup

From the `server` directory, install dependencies:

```bash
npm install
```

Create a `.env` file in this directory:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/url-shortener
```

`MONGODB_URI` is required. `PORT` is optional and defaults to `3000`. The `.env` file is ignored by Git; do not commit credentials.

Start the development server:

```bash
npm run dev
```

The server connects to MongoDB before listening. It uses `http://localhost:3000` by default, and CORS is configured to allow the Vite client at `http://localhost:5173`.

## API

### Health check

```http
GET /api/health
```

Returns HTTP `200` with a success status when the server is responding.

### Create a short URL

```http
POST /api/url
Content-Type: application/json
```

Request:

```json
{
  "originalUrl": "https://example.com/a/long/page"
}
```

The URL must start with `http://` or `https://` and be no longer than 2,048 characters. A successful request returns HTTP `201`:

```json
{
  "message": "URL registered successfully",
  "success": true,
  "response": {
    "originalUrl": "https://example.com/a/long/page",
    "shortCode": "aZ3kP9",
    "clicks": 0
  }
}
```

Invalid URLs and duplicate original URLs return HTTP `400`. Other creation errors return HTTP `500`.

### List URLs

```http
GET /api/urls
```

Returns HTTP `200` with the saved URL documents, newest first:

```json
{
  "message": "urls fetched successfully",
  "success": true,
  "response": [
    {
      "_id": "...",
      "originalUrl": "https://example.com/a/long/page",
      "shortCode": "aZ3kP9",
      "clicks": 0,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

The response property for the list is `response` (an array), matching the current controller.

### Delete a URL

```http
DELETE /api/url/:shortCode
```

For example, `DELETE /api/url/aZ3kP9` deletes the URL with that code. A successful deletion returns HTTP `200` with the deleted URL under `response`. If no URL has that code, the server returns HTTP `404`.

### Redirect to the original URL

```http
GET /:shortCode
```

For example, `GET http://localhost:3000/aZ3kP9` increments the link's click count and redirects with HTTP `302`. The current router is also mounted under `/api`, so `GET /api/:shortCode` works as well. Unknown codes return HTTP `404`.

## URL data

MongoDB stores URL documents with:

- `originalUrl`: required HTTP or HTTPS URL, trimmed, maximum 2,048 characters
- `shortCode`: required unique code
- `clicks`: click count, initially `0`
- `createdAt` and `updatedAt`: timestamps managed by Mongoose
