<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 class="text-6xl font-bold text-red-500 mb-4">404</h2>
        <p class="text-2xl text-gray-700 mb-2">Página no encontrada</p>
        <p class="text-gray-500 mb-6">Lo sentimos, la página que buscas no existe.</p>
        <div class="mt-5">
            <router-link to="/" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Volver al inicio
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Er404'
    }
</script>