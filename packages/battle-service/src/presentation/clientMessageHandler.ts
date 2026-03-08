import { RawData } from 'ws';

export function handleClientMessage(data: RawData) {
    try {
        const message = JSON.parse(data.toString());
        console.log(message);
    } catch (error) {
        console.error('Error al parsear el mensaje:', error);
    }
}