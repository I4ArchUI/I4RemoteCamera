<script setup lang="ts">
import AppSidebar from '../components/AppSidebar.vue';
</script>

<template>
    <div class="layout-container">
        <AppSidebar />
        <div class="layout-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.layout-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: var(--p-surface-ground);
}

.layout-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}
</style>
