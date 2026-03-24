import express from 'express';
import routes from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser()); 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.get('/debug-auth', (req, res) => {
    res.json({ 
        cookies_header: req.headers.cookie, // Сырая строка из браузера
        parsed_cookies: req.cookies         // То, что распарсил cookieParser
    });
});

app.use('/api', routes);

app.use('/*splat', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});



export default app;