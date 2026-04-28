import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { FRONTEND_ORIGIN } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { initSocket } from './loaders/socket.loader';

const app = express();
const server = http.createServer(app);

const allowedOrigins = FRONTEND_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
const corsOrigin = allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins;

const io = initSocket(server, corsOrigin);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api', routes);

app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

export default app;
export { server, io };