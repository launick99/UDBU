<template>
    <nav class="bg-primary shadow-md w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <!-- Logo -->
                <router-link to="/" class="flex items-center gap-2">
                    <img class="h-10 object-cover" src="../../assets/img/logo.png" title="Bajo la Paraguas azul de Debbie" alt="Bajo la Paraguas azul de Debbie Logo">
                    <h1 class="sr-only md:not-sr-only text-white font-semibold text-lg sm:text-xl">Bajo la Paraguas azul de Debbie</h1>
                </router-link>
                <div class="sm:hidden">
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-white focus:outline-none">
                        <i class="fa-solid fa-bars fa-lg"></i>
                    </button>
                </div>
                <ul class="hidden sm:flex sm:items-center text-white">
                    <template v-if="user?.id">
                        <li>
                            <router-link to="/post">Home</router-link>
                        </li>
                        <li>
                            <router-link to="/perfil">Mi Perfil</router-link>
                        </li>
                        <li>
                            <a @click="handleLogout" class="cursor-pointer">Cerrar sesión</a>
                        </li>
                    </template>
                    <template v-else>
                        <li>
                            <router-link to="/login" class="flex items-center gap-2">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                Iniciar Sesion
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/register" class="flex items-center gap-2">
                                <i class="fa-solid fa-user-plus"></i>
                                Registrarme
                            </router-link>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div v-if="mobileMenuOpen" class="sm:hidden">
            <ul class="flex flex-col px-4 py-5 space-y-1 text-white">
                <template v-if="user?.id">
                    <li>
                        <router-link to="/post" @click="mobileMenuOpen = false">Home</router-link>
                    </li>
                    <li>
                        <a @click="handleLogout" class="cursor-pointer">Cerrar sesión</a>
                    </li>
                </template>
                <template v-else>
                    <li>
                        <router-link to="/login" @click="mobileMenuOpen = false" class="flex items-center gap-2">
                            <i class="fa-solid fa-right-to-bracket"></i>
                            Iniciar Sesion
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/register" @click="mobileMenuOpen = false" class="flex items-center gap-2">
                            <i class="fa-solid fa-user-plus"></i>
                            Registrarme
                        </router-link>
                    </li>
                </template>
            </ul>
        </div>
    </nav>
</template>

<script>
import { logout } from '../services/auth';

export default {
    name: 'AppNavbar',
    props: {
        user: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            mobileMenuOpen: false,
        };
    },
    methods: {
        async handleLogout() {
            try {
                await logout();
                this.$router.push('/login');
            } catch (err) {
                // nada
            }
        },
    },
};
</script>
