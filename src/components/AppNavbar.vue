<template>
    <nav>
        <h1 class="sr-only">Bajo la sombrilla azul de Debbie</h1>
        <ul>
            <template v-if="auth">
                <li>
                    <router-link to="/post">Home</router-link>
                </li>
                <li>
                    <a @click="logout">
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
import supabase from '../services/supabase'

export default {
    name: 'AppNavbar',
    props: {
        auth: {
            type: Object,
            default: null,
        },
    },
    methods: {
        /**
         * Deslogea al usuario
         */
        async logout() {
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error al cerrar sesion:', error.message)
            } else {
                this.$router.push('/login')
            }
        },
    },
}
</script>
