import { useState, useCallback, useRef } from 'react';

interface QueuedMessage<T> {
    id: string;
    data: T;
    duration: number;
}

export const useMessageQueue = <T>() => {
    const [currentMessage, setCurrentMessage] = useState<T | null>(null);
    const [queueLength, setQueueLength] = useState(0);

    const queueRef = useRef<QueuedMessage<T>[]>([]);

    const processTimeout = useCallback(() => {
        const futureQueue = queueRef.current.slice(1);
        queueRef.current = futureQueue;
        setQueueLength(futureQueue.length);

        if (futureQueue.length > 0) {
            setCurrentMessage(futureQueue[0].data);
            setTimeout(() => {
                processTimeout();
            }, futureQueue[0].duration);
        } else {
            setCurrentMessage(null);
        }
    }, []);

    const addMessage = useCallback((data: T, duration: number = 3000) => {
        const newMessage: QueuedMessage<T> = {
            id: crypto.randomUUID(),
            data,
            duration,
        };

        if (queueRef.current.length === 0) {
            setCurrentMessage(newMessage.data);
            setTimeout(() => {
                processTimeout();
            }, duration);
        }

        queueRef.current.push(newMessage);
        setQueueLength(queueRef.current.length);
    }, [processTimeout]);

    return {
        currentMessage,
        addMessage,
        queueLength
    };
};