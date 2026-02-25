const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');

const settingsFab = document.getElementById('settingsFab');
const settingsModal = document.getElementById('settingsModal');
const closeModalBtn = document.getElementById('closeModalBtn');

const cameraSelect = document.getElementById('cameraSelect');
const resSelect = document.getElementById('resSelect');
const orientSelect = document.getElementById('orientSelect');
const fpsSelect = document.getElementById('fpsSelect');

let ws;
let targetFps = 30;
let targetWidth = 1920;
let targetHeight = 1080;
let targetOrientation = 'auto';
let selectedDeviceId = null;
let currentStream;
let streamInterval;

// Modal Logic
settingsFab.addEventListener('click', () => {
    settingsModal.classList.add('visible');
});
closeModalBtn.addEventListener('click', () => {
    settingsModal.classList.remove('visible');
});
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('visible');
    }
});

async function fetchCameras() {
    try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');

        cameraSelect.innerHTML = '';

        videoInputs.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        if (videoInputs.length > 0) {
            selectedDeviceId = videoInputs[0].deviceId;
        }
    } catch (err) {
        console.error("Camera enumeration error:", err);
        cameraSelect.innerHTML = '<option value="">Permission Denied</option>';
    }
}

async function initCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    try {
        let isPortrait;
        if (targetOrientation === 'portrait') {
            isPortrait = true;
        } else {
            isPortrait = false;
        }

        let idealWidth = isPortrait ? Math.min(targetWidth, targetHeight) : Math.max(targetWidth, targetHeight);
        let idealHeight = isPortrait ? Math.max(targetWidth, targetHeight) : Math.min(targetWidth, targetHeight);

        const constraints = {
            video: {
                width: { ideal: idealWidth },
                height: { ideal: idealHeight },
                frameRate: { ideal: targetFps, max: targetFps }
            }
        };

        if (selectedDeviceId) {
            constraints.video.deviceId = { exact: selectedDeviceId };
        } else {
            constraints.video.facingMode = "environment";
        }

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
        video.play();

        populateSettingsUI(currentStream.getVideoTracks()[0]);

        status.innerText = "Camera Ready (Press Start)";
    } catch (err) {
        status.innerText = "Error: " + err.message;
        alert("Camera error: " + err.message + "\nMake sure you access via HTTPS or localhost.");
    }
}

function populateSettingsUI(track) {
    const caps = (typeof track.getCapabilities === 'function') ? track.getCapabilities() : {};

    // FPS Limits
    const maxFps = (caps.frameRate && caps.frameRate.max) ? Math.floor(caps.frameRate.max) : 60;
    const standardFpsList = [15, 24, 30, 60, 120];

    const supportedFps = standardFpsList.filter(f => f <= maxFps);
    if (caps.frameRate && caps.frameRate.max && !supportedFps.includes(maxFps)) {
        supportedFps.push(maxFps);
    }

    const currentFpsStr = fpsSelect.value || targetFps.toString();
    fpsSelect.innerHTML = '';
    let fpsFound = false;

    supportedFps.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.text = `${f} FPS`;
        if (f.toString() === currentFpsStr) {
            opt.selected = true;
            fpsFound = true;
        }
        fpsSelect.appendChild(opt);
    });

    if (!fpsFound && fpsSelect.options.length > 0) {
        fpsSelect.value = supportedFps.includes(30) ? "30" : supportedFps[supportedFps.length - 1].toString();
        targetFps = parseInt(fpsSelect.value);
    }

    // Resolution Limits
    const rawMaxWidth = caps.width ? caps.width.max : 3840;
    const rawMaxHeight = caps.height ? caps.height.max : 2160;
    const hardwareMaxDim = Math.max(rawMaxWidth || 0, rawMaxHeight || 0);

    const standardRes = [
        { w: 640, h: 480, label: "SD" },
        { w: 1280, h: 720, label: "HD" },
        { w: 1920, h: 1080, label: "FHD" },
        { w: 2560, h: 1440, label: "2K" },
        { w: 3840, h: 2160, label: "4K" }
    ];

    const supportedRes = standardRes.filter(r => !hardwareMaxDim || Math.max(r.w, r.h) <= hardwareMaxDim);

    if (rawMaxWidth && rawMaxHeight && !supportedRes.find(r => r.w === rawMaxWidth && r.h === rawMaxHeight)) {
        if (rawMaxWidth >= 640) {
            supportedRes.push({ w: rawMaxWidth, h: rawMaxHeight, label: "Max Device Limit" });
            supportedRes.sort((a, b) => a.w - b.w);
        }
    }

    if (supportedRes.length === 0 && standardRes.length > 0) {
        supportedRes.push(standardRes[1]);
    }

    const currentResStr = resSelect.value || `${targetWidth}x${targetHeight}`;
    resSelect.innerHTML = '';

    let resFound = false;
    supportedRes.forEach(r => {
        const opt = document.createElement('option');
        opt.value = `${r.w}x${r.h}`;
        opt.text = `${r.w}x${r.h} (${r.label})`;
        if (opt.value === currentResStr) {
            opt.selected = true;
            resFound = true;
        }
        resSelect.appendChild(opt);
    });

    if (!resFound && resSelect.options.length > 0) {
        const fallback = supportedRes.find(r => r.w === 1920) || supportedRes[supportedRes.length - 1];
        resSelect.value = `${fallback.w}x${fallback.h}`;
        targetWidth = fallback.w;
        targetHeight = fallback.h;
    }
}

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (currentStream) initCamera();
    }, 500);
});

// Settings Change Listeners
cameraSelect.addEventListener('change', (e) => {
    selectedDeviceId = e.target.value;
    if (currentStream) initCamera();
});

resSelect.addEventListener('change', (e) => {
    const parts = e.target.value.split('x');
    targetWidth = parseInt(parts[0]);
    targetHeight = parseInt(parts[1]);
    if (currentStream) initCamera();
});

orientSelect.addEventListener('change', (e) => {
    targetOrientation = e.target.value;
    if (currentStream) initCamera();
});

fpsSelect.addEventListener('change', (e) => {
    targetFps = parseInt(e.target.value);
    if (currentStream) initCamera();
});

startBtn.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        stopStream();
    } else {
        startStream();
    }
});

function startStream() {
    if (video.videoWidth === 0) {
        status.innerText = "Waiting for camera to stabilize...";
        setTimeout(startStream, 500);
        return;
    }

    ws = new WebSocket('wss://' + location.host + '/ws');
    ws.onopen = () => {
        status.innerText = "Connected!";
        status.style.color = "#10b981";
        startBtn.innerText = "Stop";
        startBtn.className = "btn-stop";

        let lastFrameTime = 0;
        let isEncoding = false;

        function sendFrame(timestamp) {
            if (!ws || ws.readyState !== WebSocket.OPEN) return;
            streamInterval = requestAnimationFrame(sendFrame);

            const frameDelay = 1000 / targetFps;
            if (timestamp - lastFrameTime < frameDelay) return;

            // Allow larger buffer to avoid dropping frames on slight network jitter
            // 3MB buffer limit
            if (ws.bufferedAmount > 3 * 1024 * 1024) return;

            if (video.readyState >= video.HAVE_CURRENT_DATA && !isEncoding) {
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                isEncoding = true;

                // Use toBlob for better performance and non-blocking UI
                canvas.toBlob((blob) => {
                    if (!ws || ws.readyState !== WebSocket.OPEN) {
                        isEncoding = false;
                        return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(reader.result);
                        }
                        isEncoding = false;
                        lastFrameTime = performance.now();
                    };
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', 0.5);
            }
        }

        streamInterval = requestAnimationFrame(sendFrame);
    };
    ws.onclose = () => {
        stopStream();
        status.innerText = "Disconnected";
        status.style.color = "#ef4444";
    };
    ws.onerror = (e) => {
        console.error("WebSocket error", e);
        status.innerText = "Connection error";
        status.style.color = "#ef4444";
    };
}

function stopStream() {
    if (streamInterval) cancelAnimationFrame(streamInterval);
    if (ws) ws.close();
    startBtn.innerText = "Start";
    startBtn.className = "";
}

// Boot Sequence
(async function boot() {
    await fetchCameras();
    await initCamera();
})();
