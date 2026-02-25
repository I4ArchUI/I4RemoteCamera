<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => router.push('/')
    },
    {
        label: 'System Info',
        icon: 'pi pi-desktop',
        command: () => router.push('/system')
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => router.push('/settings')
    }
]);
</script>

<template>
    <div class="sidebar">
        <div class="logo-container">
            <i class="pi pi-box text-2xl text-primary"></i>
            <span class="font-bold text-xl ml-2 text-surface-900 dark:text-surface-0">i4RemoteCamerai</span>
        </div>
        <Menu :model="items" class="w-full border-none bg-transparent" />
    </div>
</template>

<style scoped>
.sidebar {
    width: 250px;
    height: 100vh;
    border-right: 1px solid var(--p-content-border-color);
    background-color: var(--p-content-background);
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.logo-container {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
}

:deep(.p-menu-item-content) {
    transition: background-color 0.2s;
    border-radius: var(--p-content-border-radius);
}

:deep(.p-menu-item-link) {
    padding: 0.75rem 1rem;
}
</style>
