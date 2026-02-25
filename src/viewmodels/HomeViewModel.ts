import { CameraStreamService } from '../services/CameraStreamService';
import { useHomeStore } from '../stores/HomeStore';
import type { UnlistenFn } from '@tauri-apps/api/event';

export class HomeViewModel {
    private store = useHomeStore();
    private unlistens: UnlistenFn[] = [];

    // --- Callbacks for View-Level side effects ---
    public onClientConnected: (() => void) | null = null;
    public onClientDisconnected: (() => void) | null = null;
    public onFrameReceived: ((frame: string) => void) | null = null;

    // --- Expose Store State to the View ---
    get settings() {
        return this.store.settings;
    }

    get isConnected() {
        return this.store.isConnected;
    }

    get cameraFrame() {
        return this.store.cameraFrame;
    }

    get qrValue() {
        return this.store.qrValue;
    }

    // --- Actions ---
    public async initService() {
        // Get initial streaming url
        this.store.settings.streamUrl = await CameraStreamService.getStreamUrl();

        // Listen for new connections
        const unlistenConn = await CameraStreamService.listenConnected(() => {
            this.store.isConnected = true;
            if (this.onClientConnected) this.onClientConnected();
        });

        // Listen for disconnections
        const unlistenDisconn = await CameraStreamService.listenDisconnected(() => {
            this.store.isConnected = false;
            this.store.cameraFrame = null;
            if (this.onClientDisconnected) this.onClientDisconnected();
        });

        // Listen for camera stream data
        const unlistenFrame = await CameraStreamService.listenFrame((frame) => {
            if (this.onFrameReceived) {
                this.onFrameReceived(frame);
            } else {
                this.store.cameraFrame = frame;
            }
        });

        this.unlistens.push(unlistenConn, unlistenDisconn, unlistenFrame);
    }

    public cleanupService() {
        this.unlistens.forEach(fn => fn());
        this.unlistens = [];
    }
}
