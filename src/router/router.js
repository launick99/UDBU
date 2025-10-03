import { createRouter, createWebHashHistory } from "vue-router";

// Importaciones de páginas principales
import Home from "../pages/Home.vue";
import Posts from "../pages/Posts.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

// Importaciones de páginas de error
import Er403 from "../pages/Er403.vue";
import Er404 from "../pages/Er404.vue";

// Importación de servicios
import { subscribeToAuthStateChanges } from "../services/auth";

/**
 * Definición de rutas de la aplicación.
 * - Las rutas con meta.requiresAuth requieren autenticación.
 * - La ruta '*' redirige a 404 si no se encuentra la ruta solicitada.
 */
const routes = [
    { component: Home,      path: '/' },
    { component: Login,     path: '/login' },
    { component: Register,  path: '/register' },
    { component: Posts,     path: '/post',    meta: { requiresAuth: true } },
    { component: Posts,     path: '/perfil',  meta: { requiresAuth: true } },
    { component: Er403,     path: '/403' },
    { component: Er404,     path: '/404' },
    // Ruta catch-all para 404
    { path: '/:pathMatch(.*)*', redirect: '/404' }
];

/**
 * Creación del router con historial hash.
 */
const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

/**
 * Estado local del usuario autenticado.
 * Suscripción a los cambios de estado de autenticación.
 * Actualiza el usuario local cuando cambia el estado.
 */
let user = {
    id: null,
    email: null,
};

subscribeToAuthStateChanges((UserState) => user = UserState);

/**
 * Guard global de navegación.
 * Si la ruta requiere autenticación y el usuario no está autenticado, redirige a /403.
 */
router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !user.id) {
        return { path: '/403' };
    }
});

export default router;