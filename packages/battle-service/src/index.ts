import express from 'express';
import cors from 'cors';
import { initDB } from './infrastructure/database/mongoDb';
import { BattleRepositoryImpl } from './infrastructure/repositories/BattleRepositoryImpl';
import { getBattleHistory } from './domain/usecase/GetBattleHistoryUseCase';
import { BattleToBattleHistory } from './presentation/mapper/domainToUi.js';
import { setupWebSocketServer } from './infrastructure/websocket/setup';

async function start() {
    try {

        // DB init
        await initDB();

        // Configurar API rest
        const app = express();
        app.use(cors());
        app.use(express.json());

        const battleRepository = new BattleRepositoryImpl();

        app.get('/history/:nickname', async (req, res) => {
            const { nickname } = req.params;
            console.log(`Get historial para: ${nickname}`);
            try {
                const battles = await getBattleHistory(nickname, battleRepository);
                const historyResponse = battles.map(battle => BattleToBattleHistory(battle, nickname));
                res.json(historyResponse);
            } catch (error) {
                console.error("Error al obtener el historial:", error);
                res.status(500).json({ error: "Internal error" });
            }
        });

        // Iniciar servicio
        setupWebSocketServer(app);

        console.log('Battle Service inicializado correctamente');

    } catch (error) {
        console.error("Error fatal durante el inicio:", error);
        process.exit(1);
    }
}

start();