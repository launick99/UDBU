import { createRouter, createWebHashHistory } from "vue-router";

// Importaciones de páginas principales
import Home from "../pages/Home.vue";
import Posts from "../pages/Posts.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Profile from "../pages/Profile.vue";
import ProfileEdit from "../pages/ProfileEdit.vue";

// Importaciones de páginas de error
import Er403 from "../pages/Errors/Er403.vue";
import Er404 from "../pages/Errors/Er404.vue";

// Importación de servicios
import { subscribeToAuthStateChanges } from "../services/auth";

/**
 * Definición de rutas de la aplicación.
 * - Las rutas con meta.requiresAuth requieren autenticación.
 * - La ruta '*' redirige a 404 si no se encuentra la ruta solicitada.
 */
const routes = [
    { component: Home,              path: '/',                  meta: { guest: true }                   },
    { component: Login,             path: '/login',             meta: { guest: true }                   },
    { component: Register,          path: '/register',          meta: { guest: true }                   },
    { component: Posts,             path: '/post',              meta: { requiresAuth: true }            },
    { component: Profile,           path: '/perfil',            meta: { requiresAuth: true }            },
    { component: ProfileEdit,       path: '/perfil/editar',     meta: { requiresAuth: true }            },
    { component: Er403,             path: '/403'                                                        },
    { component: Er404,             path: '/404'                                                        },
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
 * Si la ruta es para invitados y el usuario está autenticado, redirige a /post.
 */
router.beforeEach((to, from) => {
    if (to.meta.guest && user.id !== null) {
        return { path: '/post' };
    }
    if (to.meta.requiresAuth && user.id === null) {
        return { path: '/403' };
    }
});

export default router;