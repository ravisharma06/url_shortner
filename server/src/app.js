import express from 'express';
import urlRoute from './routes/url.route.js';
import { redirectUrlController } from './controllers/url.controller.js';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
const app = express();
const notFoundPage = fileURLToPath(new URL('../public/404.html', import.meta.url));
app.use(express.json());


app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://url-shortner-pi-orpin.vercel.app',
    ],
    methods: ['GET', 'POST', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}))

app.use("/api", urlRoute);
app.get("/:shortCode", redirectUrlController);

app.use((req, res) => {
    res.status(404).sendFile(notFoundPage);
});

export default app;