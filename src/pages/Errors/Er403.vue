<template>
    <div class="text-center mt-24">
        <h2 class="text-5xl font-bold text-red-700">Error 403</h2>
        <p class="text-lg text-gray-600 mt-4">Oops! Parece que usted no tiene acceso a este sitio.</p>
        <div class="mt-5">
            <router-link to="/" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Volver al inicio
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Er403'
    }
</script>
