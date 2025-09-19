<template>
    <AppNavbar></AppNavbar>
    <main class="main">
        <Router-view></Router-view>
    </main>
    <AppFooter></AppFooter>
</template>
<script>
    import AppNavbar from './components/AppNavbar.vue';
    import AppFooter from './components/AppFooter.vue';

    export default {
        name: 'App',
        components: {AppNavbar, AppFooter},
    }
</script>