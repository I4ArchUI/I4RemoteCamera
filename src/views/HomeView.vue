<script setup lang="ts">
import { useHomeStore } from '../stores/useHomeStore';
import QrcodeVue from 'qrcode.vue';
import { useToast } from 'primevue/usetoast';

const store = useHomeStore();
const toast = useToast();

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(store.settings.streamUrl);
    toast.add({ severity: 'success', summary: 'Copied', detail: 'Link copied to clipboard', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy', life: 3000 });
  }
};
</script>

<template>
  <div class="home-container">
    <Toast />
    <Card class="settings-card">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-camera text-primary"></i>
          <span>Camera Settings</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 gap-6">
          <div class="field">
            <label for="resolution" class="block font-medium mb-2">Resolution</label>
            <Select id="resolution" v-model="store.settings.resolution" :options="store.resolutions"
              placeholder="Select Resolution" class="w-full" />
          </div>

          <div class="field">
            <label for="cameraType" class="block font-medium mb-2">Camera Type</label>
            <Select id="cameraType" v-model="store.settings.cameraType" :options="store.cameraTypes"
              placeholder="Select Camera" class="w-full" />
          </div>

          <div class="field">
            <label for="fps" class="block font-medium mb-2">FPS</label>
            <Select id="fps" v-model="store.settings.fps" :options="store.fpsOptions" placeholder="Select FPS"
              class="w-full" />
          </div>
        </div>
      </template>
    </Card>

    <Card class="qr-card">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-qrcode text-primary"></i>
          <span>Stream Connection</span>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col items-center gap-6">
          <div class="qr-container p-4 bg-white rounded-xl shadow-inner">
            <qrcode-vue :value="store.qrValue" :size="200" level="H" />
          </div>

          <div class="w-full">
            <label class="block font-medium mb-2">Connection Link</label>
            <div class="flex gap-2">
              <InputText v-model="store.settings.streamUrl" class="flex-1" />
              <Button icon="pi pi-copy" severity="secondary" @click="copyToClipboard" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 2.5rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
}

.settings-card,
.qr-card {
  flex: 1;
  border-radius: 2rem;
  border: 1px solid rgba(var(--p-content-border-color-rgb), 0.1);
  background: rgba(var(--p-surface-0-rgb), 0.7);
  backdrop-filter: blur(20px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.05),
    0 10px 10px -5px rgba(0, 0, 0, 0.02);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.settings-card:hover,
.qr-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 25px 30px -5px rgba(0, 0, 0, 0.08),
    0 15px 15px -5px rgba(0, 0, 0, 0.04);
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #eee;
}

:deep(.p-card-body) {
  padding: 2.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.p-card-title) {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
}

:deep(.p-card-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.p-select) {
  border-radius: 1rem;
  background: var(--p-surface-100);
  border: 1px solid transparent;
}

:deep(.p-select:hover) {
  border-color: var(--p-primary-color);
}

:deep(.p-inputtext) {
  border-radius: 1rem;
  background: var(--p-surface-100);
  border: 1px solid transparent;
}

:deep(.p-inputtext:focus) {
  border-color: var(--p-primary-color);
}

.field label {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
