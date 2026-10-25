import express from 'express';
import urlRoute from './routes/url.route.js';
import { redirectUrlController } from './controllers/url.controller.js';
import cors from 'cors';
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}))

app.use("/api", urlRoute);
app.get("/:shortCode", redirectUrlController);


export default app;