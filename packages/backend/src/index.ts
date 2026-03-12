import express, { Request, Response } from 'express';
import cors from 'cors';
import { logMessage, PokemonListResponseSchema, PokemonDetailResponseSchema } from '@poke-albo/shared';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

if (!port || Number(port) === Number.NaN) {
    throw new Error('PORT environment variable is not set');
}

// si el puerto es par, los nombres de pokemones tendran el sufijo "_API2"
const showSufix = Number(port) % 2 == 0

app.use(cors());
app.use(express.json());

app.get('/list', (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, 'assets', 'pokemon-list.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);

        const result = PokemonListResponseSchema.parse(data)
        res.json(result);
    } catch (error) {
        console.error('Error serving /list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/list/:id', (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
        }

        const filePath = path.join(__dirname, 'assets', 'pokemon-detail.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData) as any[];

        const pokemon = data.find(p => p.id === id);
        if (!pokemon) {
            res.status(404).json({ error: 'Pokemon not found' });
            return;
        }

        const result = PokemonDetailResponseSchema.parse(pokemon);
        if (showSufix) result.name += "_API2"
        res.json(result);
    } catch (error) {
        console.error('Error serving /list/:id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
