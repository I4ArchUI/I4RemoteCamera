<template>
  <div class="system-view">
    <h2 class="text-2xl font-semibold mb-4">System Information</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
            <template #title>CPU</template>
            <template #content>
                <div class="text-4xl font-bold text-primary">12%</div>
                <div class="text-sm text-surface-500">Usage</div>
            </template>
        </Card>
        <Card>
            <template #title>Memory</template>
            <template #content>
                <div class="text-4xl font-bold text-primary">4.2 GB</div>
                <div class="text-sm text-surface-500">Used of 16 GB</div>
            </template>
        </Card>
        <Card>
            <template #title>Disk</template>
            <template #content>
                <div class="text-4xl font-bold text-primary">256 GB</div>
                <div class="text-sm text-surface-500">Free Space</div>
            </template>
        </Card>
        <Card>
            <template #title>GPU</template>
            <template #content>
                <div class="text-4xl font-bold text-primary">GTX 1660</div>
                <div class="text-sm text-surface-500">28°C</div>
            </template>
        </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
// PrimeVue Card is auto-imported
</script>

<style scoped>
.system-view {
    width: 100%;
}
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}
</style>
