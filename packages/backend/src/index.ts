import express, { Request, Response } from 'express';
import { logMessage } from '@poke-albo/shared';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/hello', (req: Request, res: Response) => {
    logMessage('GET /api/hello request received');
    res.json({ message: 'Hello from poke-albo backend!' });
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
