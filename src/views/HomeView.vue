<script setup lang="ts">
import { HomeViewModel } from '../viewmodels/HomeViewModel';
import QrcodeVue from 'qrcode.vue';
import { useToast } from 'primevue/usetoast';
import { onMounted, onUnmounted } from 'vue';

const viewModel = new HomeViewModel();
const toast = useToast();

onMounted(() => {
	viewModel.onClientConnected = () => {
		toast.add({ severity: 'info', summary: 'Connected', detail: 'Phone connected to stream', life: 3000 });
	};

	viewModel.onClientDisconnected = () => {
		toast.add({ severity: 'warn', summary: 'Disconnected', detail: 'Phone disconnected', life: 3000 });
	};

	viewModel.initService();
});

onUnmounted(() => {
	viewModel.cleanupService();
});

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(viewModel.settings.streamUrl);
		toast.add({ severity: 'success', summary: 'Copied', detail: 'Link copied to clipboard', life: 3000 });
	} catch (err) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy', life: 3000 });
	}
};
</script>

<template>
	<div v-if="!viewModel.isConnected" class="dashboard-wrapper">
		<Toast />

		<!-- Ambient Background Effects -->
		<div class="ambient-glow glow-1"></div>
		<div class="ambient-glow glow-2"></div>

		<div class="premium-card">
			<div class="card-body">
				<p class="instruction-text">
					Scan the QR code below using your phone's camera to start streaming
				</p>

				<div class="qr-wrapper">
					<div class="qr-glow"></div>
					<div class="qr-surface">
						<qrcode-vue v-if="viewModel.qrValue !== 'Loading...'" :value="viewModel.qrValue" :size="200"
							level="H" foreground="#111827" />
						<div v-else class="qr-loading">
							<i class="pi pi-spin pi-spinner"></i>
						</div>
					</div>
				</div>

				<div class="link-section">
					<label class="link-label">Connection Link</label>
					<div class="link-input-group">
						<InputText v-model="viewModel.settings.streamUrl" readonly class="link-input" />
						<Button icon="pi pi-copy" @click="copyToClipboard" class="copy-btn" aria-label="Copy Link" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div v-if="viewModel.isConnected" class="stream-wrapper">
		<img v-if="viewModel.cameraFrame" :src="viewModel.cameraFrame" class="camera-stream" />
		<div v-else class="waiting-frame">
			<div class="waiting-pill">
				<i class="pi pi-spin pi-spinner waiting-icon"></i>
				<span>Waiting for video stream...</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.dashboard-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #0f172a;
	/* Slate 900 */
	overflow: hidden;
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	z-index: 1;
}

.ambient-glow {
	position: absolute;
	border-radius: 50%;
	filter: blur(100px);
	z-index: -1;
	opacity: 0.5;
	animation: pulse 8s ease-in-out infinite alternate;
}

.glow-1 {
	width: 400px;
	height: 400px;
	background: rgba(59, 130, 246, 0.4);
	/* Blue */
	top: -100px;
	left: -100px;
}

.glow-2 {
	width: 300px;
	height: 300px;
	background: rgba(16, 185, 129, 0.3);
	/* Emerald */
	bottom: -50px;
	right: -50px;
	animation-delay: 2s;
}

@keyframes pulse {
	0% {
		transform: scale(1);
		opacity: 0.4;
	}

	100% {
		transform: scale(1.2);
		opacity: 0.6;
	}
}

.premium-card {
	width: 100%;
	max-width: 440px;
	margin: 20px;
	border-radius: 24px;
	background: rgba(30, 41, 59, 0.6);
	/* Slate 800 */
	backdrop-filter: blur(24px);
	-webkit-backdrop-filter: blur(24px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
	0% {
		transform: translateY(30px);
		opacity: 0;
	}

	100% {
		transform: translateY(0);
		opacity: 1;
	}
}

.card-header {
	padding: 24px 30px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(15, 23, 42, 0.4);
	/* Slate 900 */
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
	display: flex;
	align-items: center;
	gap: 16px;
}

.icon-box {
	width: 44px;
	height: 44px;
	border-radius: 14px;
	background: rgba(59, 130, 246, 0.15);
	color: #60a5fa;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	border: 1px solid rgba(59, 130, 246, 0.2);
}

.header-text h2 {
	margin: 0;
	font-size: 20px;
	font-weight: 700;
	color: #f8fafc;
	letter-spacing: -0.02em;
}

.header-text p {
	margin: 4px 0 0 0;
	font-size: 13px;
	color: #94a3b8;
	font-weight: 500;
}

.status-indicator {
	position: relative;
	display: flex;
	width: 12px;
	height: 12px;
}

.status-indicator .ping {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #34d399;
	/* Emerald 400 */
	opacity: 0.75;
	animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.status-indicator .dot {
	position: relative;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: #10b981;
	/* Emerald 500 */
}

@keyframes ping {

	75%,
	100% {
		transform: scale(2.5);
		opacity: 0;
	}
}

.card-body {
	padding: 32px 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.instruction-text {
	text-align: center;
	color: #cad5e2;
	font-size: 15px;
	line-height: 1.5;
	margin: 0 0 28px 0;
	font-weight: 400;
}

.qr-wrapper {
	position: relative;
	margin-bottom: 32px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.qr-glow {
	position: absolute;
	top: -4px;
	left: -4px;
	right: -4px;
	bottom: -4px;
	background: linear-gradient(135deg, #3b82f6, #06b6d4, #10b981);
	border-radius: 28px;
	filter: blur(12px);
	opacity: 0.4;
	transition: opacity 0.4s ease;
}

.qr-wrapper:hover .qr-glow {
	opacity: 0.7;
}

.qr-surface {
	position: relative;
	background: #ffffff;
	padding: 16px;
	border-radius: 24px;
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
	display: flex;
	justify-content: center;
	align-items: center;
	width: 232px;
	height: 232px;
}

.qr-loading {
	color: #94a3b8;
	font-size: 32px;
}

.link-section {
	width: 100%;
}

.link-label {
	display: block;
	font-size: 11px;
	font-weight: 600;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 10px;
}

.link-input-group {
	display: flex;
	gap: 10px;
	height: 48px;
}

.link-input {
	flex: 1;
	background: rgba(15, 23, 42, 0.6) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	color: #e2e8f0 !important;
	border-radius: 12px !important;
	padding: 0 16px !important;
	font-family: 'ui-monospace', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace !important;
	font-size: 14px !important;
	transition: all 0.2s ease !important;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2) !important;
	width: 100%;
}

.link-input:focus {
	border-color: rgba(59, 130, 246, 0.5) !important;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

.copy-btn {
	width: 48px !important;
	height: 48px !important;
	background: rgba(59, 130, 246, 0.1) !important;
	color: #60a5fa !important;
	border: 1px solid rgba(59, 130, 246, 0.2) !important;
	border-radius: 12px !important;
	display: flex !important;
	justify-content: center !important;
	align-items: center !important;
	transition: all 0.2s ease !important;
	cursor: pointer;
}

.copy-btn:hover {
	background: rgba(59, 130, 246, 0.2) !important;
	color: #93c5fd !important;
	transform: translateY(-1px);
}

.copy-btn:active {
	transform: translateY(1px);
}

.stream-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: #000;
	z-index: 50;
	display: flex;
	justify-content: center;
	align-items: center;
}

.camera-stream {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.waiting-frame {
	display: flex;
	justify-content: center;
	align-items: center;
}

.waiting-pill {
	display: flex;
	align-items: center;
	gap: 16px;
	background: rgba(30, 41, 59, 0.8);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	padding: 16px 32px;
	border-radius: 999px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: #f8fafc;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
	animation: float 3s ease-in-out infinite;
}

@keyframes float {
	0% {
		transform: translateY(0px);
	}

	50% {
		transform: translateY(-10px);
	}

	100% {
		transform: translateY(0px);
	}
}

.waiting-icon {
	font-size: 24px;
	color: #3b82f6;
}

.waiting-pill span {
	font-size: 16px;
	font-weight: 500;
	letter-spacing: 0.02em;
}
</style>
