<template>
    <AppNavbar :user="user"></AppNavbar>
    <main class="main">
        <Router-view></Router-view>
    </main>
    <AppFooter></AppFooter>
</template>
<script>
    import AppNavbar from './components/AppNavbar.vue';
    import AppFooter from './components/AppFooter.vue';
    import { subscribeToAuthStateChanges } from './services/auth';

    let unsubscribe = () => {};

    export default {
        name: 'App',
        components: {AppNavbar, AppFooter},
        data() {
            return {
                user: {
                    id: null,
                    email: null,
                }
            }
        },
        mounted(){
            unsubscribe = subscribeToAuthStateChanges( (userState) => {
                this.user = userState;
            });
        },
        unmounted(){
            unsubscribe();
        }
    }
</script>