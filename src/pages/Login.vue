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
            <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
        </form>
    </div>
</template>

<script>
import supabase from '../services/supabase'

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            errorMessage: '',
            successMessage: '',
        }
    },
    methods: {
        /** TODO: comentar, es void */
        async login() {
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = true;
            try {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email: this.email,
                    password: this.password,
                })

                if (error) {
                    this.errorMessage = error.message;
                } else {
                    this.successMessage = '¡Ingreso exitoso!';
                    window.location.reload();
                }
            } catch (err) {
                this.errorMessage = 'Error inesperado: ' + err.message;
            } finally {
                this.loading = false;
            }
        },
    },
}
</script>
