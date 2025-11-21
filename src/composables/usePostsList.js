import { ref, onMounted, onUnmounted } from 'vue';
import { fetchGlobalPost, fetchUserPost, subscribeToGlobalPostNewPosts, fetchPost } from '../services/posts';

/**
 * Composable para obtener y mantener sincronizado un listado de posts.
 * Maneja: carga inicial, suscripción a nuevos posts en tiempo real.
 * 
 * @param {String} userId - ID del usuario
 * @returns {Object} - Estados y métodos para gestionar posts
 */
export function usePostsList() {
    const posts = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");

    let unsubscribe = () => {};

    /**
     * Carga los posts iniciales según el tipo
     */
    const loadPosts = async () => {
        try {
            loading.value = true;
            errorMessage.value = "";
            posts.value = await fetchGlobalPost();

        } catch (error) {
            errorMessage.value = error.message || "Error al cargar posts";
            console.error("[usePostList.js loadPosts] Error al cargar posts:", error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Suscribe a nuevos posts en tiempo real
     */
    const subscribeToNewPosts = () => {
        try {
            unsubscribe = subscribeToGlobalPostNewPosts(async (newPostData) => {
                // El post que viene del tiempo real solo tiene los datos básicos
                // Enriquecerlo con las relaciones (user_profile, post_media)
                try {
                    const enrichedPost = await fetchPost(newPostData.id);
                    posts.value.unshift(enrichedPost);
                } catch (error) {
                    console.error("Error enriching post:", error);
                    // Si falla la enumeración, al menos agregar el post sin relaciones
                    posts.value.unshift(newPostData);
                }
            });
        } catch (error) {
            console.error("[usePostList.js subscribeToNewPosts] Error al suscribirse a posts:", error);
        }
    };

    /**
     * Elimina un post del listado
     */
    const removePost = (postId) => {
        const index = posts.value.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts.value.splice(index, 1);
        }
    };

    /**
     * Actualiza un post en el listado
     */
    const updatePost = (postId, updatedData) => {
        const index = posts.value.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts.value[index] = { ...posts.value[index], ...updatedData };
        }
    };

    /**
     * Recarga la lista de posts
     */
    const refresh = async () => {
        await loadPosts();
    };

    onMounted(async () => {
        await loadPosts();
        subscribeToNewPosts();
    });

    onUnmounted(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    return {
        posts,
        loading,
        errorMessage,
        loadPosts,
        subscribeToNewPosts,
        removePost,
        updatePost,
        refresh
    };
}
