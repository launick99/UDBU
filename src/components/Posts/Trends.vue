<template>
    <div class="space-y-4 lg:flex-shrink-0 lg:w-80">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-chart-line text-blue-600"></i>
                    <h3 class="text-sm font-semibold">Tendencias</h3>
                </div>
            </div>
            <div class="p-2">
                <div class="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <RouterLink class="flex items-center justify-between" to="">
                        <span class="text-sm font-medium text-blue-600">#Soy una tendencia</span>
                        <span class="text-xs text-gray-500">12.541</span>
                    </RouterLink>
                </div>
                <div class="p-2 hover:bg-gray-50 rounded-lg transition-colors" to="">
                    <RouterLink class="flex items-center justify-between">
                        <span class="text-sm font-medium text-blue-600">#Soy una tendencia</span>
                        <span class="text-xs text-gray-500">1241</span>
                    </RouterLink>
                </div>
                <div class="p-2 hover:bg-gray-50 rounded-lg transition-colors" to="">
                    <RouterLink class="flex items-center justify-between">
                        <span class="text-sm font-medium text-blue-600">#Soy una tendencia</span>
                        <span class="text-xs text-gray-500">541</span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
