<template>
    <div class="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
        <h2 class="text-2xl font-bold mb-6 text-center">Registrarme!</h2>

        <form @submit.prevent="register">
            <label class="block mb-2 font-semibold" for="email">Email</label>
            <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Tu email"
                class="w-full p-2 mb-4 border rounded"
                required
            />

            <label class="block mb-2 font-semibold" for="password">Contraseña</label>
            <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Tu contraseña"
                class="w-full p-2 mb-4 border rounded"
                required
            />

            <div>
                <button type="submit" class="w-full bg-primary text-white py-2 rounded hover:bg-blue-800" :disabled="loading">
                    {{ loading ? 'Registrando...' : 'Registrarme' }}
                </button>
                <p class="text-right mt-2">
                    ya tienes cuenta?
                    <router-link class="text-primary hover:text-blue-700" to="/login">iniciar sesion!</router-link>
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
    name: 'Register',
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
        async register() {
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = true;
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: this.email,
                    password: this.password,
                })

                if (error) {
                    this.errorMessage = error.message;
                } else {
                    this.successMessage = '¡Registro exitoso! Revisa tu email para verificar la cuenta.';
                    // console.log('User:', data.user);
                }
            } catch (err) {
                this.errorMessage = 'Error inesperado: ' + err.message;
            } finally {
                this.loading = false
            }
        },
    },
}
</script>
