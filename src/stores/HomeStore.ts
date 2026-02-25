import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CameraSettings } from '../models/CameraSettings';

export const useHomeStore = defineStore('homeStore', () => {
    // --- State ---
    const settings = ref<CameraSettings>({
        resolution: '1920x1080',
        cameraType: 'Front Camera',
        fps: 30,
        streamUrl: 'Loading...'
    });

    const isConnected = ref(false);
    const cameraFrame = ref<string | null>(null);

    // --- Computed ---
    const qrValue = computed(() => {
        return settings.value.streamUrl;
    });

    // --- Actions ---
    function updateSettings(newSettings: Partial<CameraSettings>) {
        settings.value = { ...settings.value, ...newSettings };
    }

    return {
        // State
        settings,
        isConnected,
        cameraFrame,

        // Computed
        qrValue,

        // Actions
        updateSettings
    };
});
