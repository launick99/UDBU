<template>
    <nav>
        <h1 class="sr-only">Bajo la sombrilla azul de Debbie</h1>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="post">Posts</router-link>
            </li>
            <li>
                <router-link to="register">Login</router-link>
            </li>
            <li>
                <router-link to="login">Register</router-link>
            </li>
        </ul>
    </nav>
</template>
<script>
    export default{
        name: 'AppNavbar'
    }
</script>