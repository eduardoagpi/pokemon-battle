import express from 'express';
import cors from 'cors';
import { initDB } from './data/mongoDb';
import { initWebSocketServer } from './presentation/webSocket';
import { BattleRepositoryImpl } from './data/repository/BattleRepositoryImpl';
import { getBattleHistory } from './domain/usecase/GetBattleHistoryUseCase';
import { BattleToBattleHistory } from './presentation/mapper/domainToUi.js';

async function start() {
    try {
        // 1. Conectar a la base de datos
        await initDB();

        // 2. Configurar Express
        const app = express();
        app.use(cors());
        app.use(express.json());

        const battleRepository = new BattleRepositoryImpl();

        // 3. Endpoint de historial
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

        // 4. Iniciar el servidor (HTTP + WebSockets)
        initWebSocketServer(app);

        console.log('Battle Service inicializado correctamente');

    } catch (error) {
        console.error("Error fatal durante el inicio:", error);
        process.exit(1);
    }
}

start();