import { MongoClient, Db } from 'mongodb';
import { MatchmakingDoc } from './types';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
export let db: Db;

export async function connectDB(): Promise<Db> {
    if (db) return db;

    try {
        await client.connect();
        // 1. Al asignar el nombre aquí, Mongo la creará en cuanto insertes algo
        db = client.db('pokemon_battles_db');
        console.log('Conectado a MongoDB');

        // 2. Forzamos la creación de la colección y sus índices
        // Esto asegura que la colección exista y sea rápida para búsquedas
        const matchmaking = db.collection('matchmaking');

        await matchmaking.createIndex(
            { status: 1, createdAt: 1 },
            { name: "idx_matchmaking_status_date" }
        );

        // Opcional: Índice de roomId para búsquedas rápidas por ID de sala
        await matchmaking.createIndex({ roomId: 1 }, { unique: true });

        console.log('Colecciones e Índices verificados/creados');
        return db;
    } catch (error) {
        console.error('Error al inicializar la BD:', error);
        throw error;
    }
}

export async function initDB() {
    await connectDB();
    const matchmaking = db.collection<MatchmakingDoc>('matchmaking');
    await matchmaking.deleteMany({});
}

