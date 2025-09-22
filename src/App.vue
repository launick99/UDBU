<template>
    <AppNavbar :auth="user"></AppNavbar>
    <main class="main">
        <Router-view></Router-view>
    </main>
    <AppFooter></AppFooter>
</template>
<script>
    import supabase from './services/supabase';
    import AppNavbar from './components/AppNavbar.vue';
    import AppFooter from './components/AppFooter.vue';

    export default {
        name: 'App',
        components: {AppNavbar, AppFooter},
         data() {
            return {
                user: null
            }
        },
        
        methods: {
            /** 
             * verifica si hay un usuario logeado cuando carga
             * despues escucha si hay cambios en la autenticacion
             * @returns void
             */
            async checkAuth() {
                // Obtener sesiopn
                const { data } = await supabase.auth.getSession()
                this.user = data.session?.user || null
                // Escuchar cambios
                supabase.auth.onAuthStateChange((event, session) => {
                    this.user = session?.user || null
                })
            }
        },

        async mounted() {
            await this.checkAuth();
        }
    }
</script>