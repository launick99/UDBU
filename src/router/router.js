import { createRouter, createWebHashHistory } from "vue-router";
import Posts from "../pages/Posts.vue";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const routes = [
    { component: Home , path: '/' },
    { component: Posts , path: '/post' },
    { component: Login , path: '/login' },
    { component: Register , path: '/register' },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router;