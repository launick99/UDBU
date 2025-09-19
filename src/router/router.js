import { createRouter, createWebHashHistory } from "vue-router";
import Chat from "../pages/Chat.vue";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const routes = [
    { component: Home , path: '/' },
    { component: Chat , path: '/chat' },
    { component: Login , path: '/login' },
    { component: Register , path: '/register' },
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router;