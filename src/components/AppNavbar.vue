<template>
    <nav>
        <h1 class="sr-only">Bajo la Paraguas azul de Debbie</h1>
        <ul>
            <template v-if="user.id">
                <li>
                    <router-link to="/post">Home</router-link>
                </li>
                <li>
                    <a @click="handleLogout">
                        Cerrar sesión
                    </a>
                </li>
            </template>
            <template v-else>
                <li>
                    <router-link to="/login">Login</router-link>
                </li>
                <li>
                    <router-link to="/register">Register</router-link>
                </li>
            </template>
        </ul>
    </nav>
</template>

<script>
import {logout} from '../services/auth';


export default {
    name: 'AppNavbar',
    props: {
        user: {
            type: Object,
            default: null,
        },
    },
    methods: {
        /**
         * Deslogea al usuario
         */
        async handleLogout() {
            try {
                await logout()
                this.$router.push('/login');
            } catch (err) {
                // log.error('Logout error:', err.message); // nada
            }
        },
    },
}
</script>
