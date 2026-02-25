<script setup lang="ts">
</script>

<template>
    <div class="layout-container">
        <main class="layout-content">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
.layout-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
    background-color: var(--p-surface-ground);
    background-image:
        radial-gradient(at 0% 0%, rgba(var(--p-primary-rgb), 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(var(--p-primary-rgb), 0.05) 0px, transparent 50%);
}

.layout-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
