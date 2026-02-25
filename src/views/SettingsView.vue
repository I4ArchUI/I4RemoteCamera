<template>
  <div class="settings-view">
    <h2 class="text-2xl font-semibold mb-4">Settings</h2>
    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between p-4 border rounded-lg border-surface mb-2">
            <span>Dark Mode</span>
            <ToggleSwitch v-model="darkMode" />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg border-surface">
            <span>Notifications</span>
            <ToggleSwitch v-model="notifications" />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const darkMode = ref(false);
const notifications = ref(true);
</script>

<style scoped>
.settings-view {
    max-width: 600px;
}
.flex {
    display: flex;
}
.flex-col {
    flex-direction: column;
}
.justify-between {
    justify-content: space-between;
}
.items-center {
    align-items: center;
}
.gap-4 {
    gap: 1rem;
}
.p-4 {
    padding: 1rem;
}
.border {
    border: 1px solid var(--p-content-border-color);
}
.rounded-lg {
    border-radius: 0.5rem;
}
.mb-2 {
    margin-bottom: 0.5rem;
}
</style>
