<template>
    <nav>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="chat">Chat</router-link>
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