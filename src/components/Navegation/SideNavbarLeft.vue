<template>
    <div class="hidden lg:block lg:flex-shrink-0">
        <div class="w-full lg:w-64">
            <div class="space-y-1">
                <router-link class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors duration-150 ease-in-out" to="/perfil">
                    <i class="fa-regular fa-user text-gray-500 w-5 mr-3"></i>
                    <span class="text-sm font-medium">Perfil</span>
                </router-link>
                <router-link class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors duration-150 ease-in-out" to="/">
                    <i class="fa-regular fa-heart text-gray-500 w-5 mr-3"></i>
                    <span class="text-sm font-medium">Likes</span>
                </router-link>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
                <div class="flex flex-wrap gap-2 px-3">
                    <a href="/" class="hover:underline">Privacidad</a>
                    <span>·</span>
                    <a href="/" class="hover:underline">Terminos y Condiciones</a>
                    <span>·</span>
                    <a href="/" class="hover:underline">Nosotros</a>
                </div>
                <p class="mt-2 px-3">© 2025 Bajo la Paraguas azul de Debbie</p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>