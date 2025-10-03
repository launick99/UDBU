<template>
    <div class="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

        <form @submit.prevent="login">
            <label class="block mb-2 font-semibold" for="email">Email</label>
            <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Mail"
                class="w-full p-2 mb-4 border rounded"
                required
            />

            <label class="block mb-2 font-semibold" for="password">Contraseña</label>
            <input
                id="password"
                type="password"
                v-model="password"
                placeholder="Contraseña"
                class="w-full p-2 mb-4 border rounded"
                required
            />

            <div>
                <button type="submit" class="w-full bg-primary text-white py-2 rounded hover:bg-blue-800" :disabled="loading">
                    {{ loading ? 'Ingresando...' : 'Ingresar' }}
                </button>
                <p class="text-right mt-2">
                    no tienes cuenta?
                    <router-link class="text-primary hover:text-blue-700" to="/register">Registrarme!</router-link>
                </p>
            </div>


            <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import {login} from '../services/auth';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            errorMessage: '',
        }
    },
    methods: {
        /** TODO: comentar, es void */
        async login() {
            this.errorMessage = '';
            this.loading = true;
            try {
                await login(this.email, this.password)
                this.$router.push('/perfil');
            } catch (err) {
                this.errorMessage = 'Error: ' + err.message;
            } finally {
                this.loading = false
            }
        },
    },
}
</script>
