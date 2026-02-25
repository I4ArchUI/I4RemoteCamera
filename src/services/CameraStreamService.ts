import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export class CameraStreamService {
    /**
     * Retrieves the network stream URL from the backend
     */
    static async getStreamUrl(): Promise<string> {
        try {
            return await invoke<string>('get_stream_url');
        } catch (e) {
            console.error('Failed to get stream url', e);
            return 'http://localhost:8080';
        }
    }

    /**
     * Listens for the client-connected event from the backend
     */
    static async listenConnected(callback: () => void): Promise<UnlistenFn> {
        return await listen('client-connected', callback);
    }

    /**
     * Listens for the client-disconnected event from the backend
     */
    static async listenDisconnected(callback: () => void): Promise<UnlistenFn> {
        return await listen('client-disconnected', callback);
    }

    /**
     * Listens for incoming camera frames
     */
    static async listenFrame(callback: (frameData: string) => void): Promise<UnlistenFn> {
        return await listen<string>('camera-frame', (event) => {
            callback(event.payload);
        });
    }
}
