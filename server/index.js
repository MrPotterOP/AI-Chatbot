import express from 'express';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

import { handleWSConnection } from './handlers/websocketconnection.js';
import Router from './routes/route.js';



const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', Router);



const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${process.env.PORT || 8000}`);
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    handleWSConnection(ws, req);
});
