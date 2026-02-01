import express from 'express';
import routes from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); 

app.use('/api', routes);

app.use('/*splat', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});

export default app;