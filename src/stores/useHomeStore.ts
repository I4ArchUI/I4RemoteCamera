import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CameraSettings } from '../models/CameraSettings';

export const useHomeStore = defineStore('home', () => {
    const settings = ref<CameraSettings>({
        resolution: '1920x1080',
        cameraType: 'Front Camera',
        fps: 30,
        streamUrl: 'http://192.168.1.100:8080/video'
    });

    const resolutions = ref(['640x480', '1280x720', '1920x1080', '3840x2160']);
    const cameraTypes = ref(['Front Camera', 'Back Camera', 'External Camera']);
    const fpsOptions = ref([15, 24, 30, 60]);

    const qrValue = computed(() => {
        return settings.value.streamUrl;
    });

    function updateSettings(newSettings: Partial<CameraSettings>) {
        settings.value = { ...settings.value, ...newSettings };
    }

    return {
        settings,
        resolutions,
        cameraTypes,
        fpsOptions,
        qrValue,
        updateSettings
    };
});
