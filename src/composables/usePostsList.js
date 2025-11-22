import { ref, onMounted, onUnmounted } from 'vue';
import { fetchGlobalPost, fetchUserPost, subscribeToGlobalPostNewPosts, fetchPost, getPostLikes } from '../services/posts';
import { fetchPostReplies } from '../services/replies';

/**
 * Composable para obtener y mantener sincronizado un listado de posts.
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
     * Carga los posts
     */
    const loadPosts = async () => {
        try {
            loading.value = true;
            errorMessage.value = "";
            posts.value = await fetchGlobalPost();

            try {
                await Promise.all(posts.value.map(async (p) => {
                    try {
                        const replies = await fetchPostReplies(p.id);
                        p.replies_count = Array.isArray(replies) ? replies.length : 0;
                        try {
                            p.likes_count = await getPostLikes(p.id);
                        } catch {
                            p.likes_count = p.likes_count || 0;
                        }
                    } catch (e) {
                        p.replies_count = 0;
                    }
                }));
            } catch (e) {
                console.error('[usePostsList] Error inicializando replies_count:', e);
            }

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
                try {
                    if (!newPostData.parent_post_id) {
                        // TODO: mostrar como eliminado (estilo twitter)
                        if (newPostData.is_deleted) {
                            return;
                        }
                        try {
                            const post = await fetchPost(newPostData.id);
                            post.replies_count = post.replies_count || 0;
                            posts.value.unshift(post);
                        } catch (error) {
                            console.error("Error enriching post:", error);
                            newPostData.replies_count = 0;
                            posts.value.unshift(newPostData);
                        }
                    } else {
                        const parentId = newPostData.parent_post_id;
                        const idx = posts.value.findIndex(p => p.id === parentId);
                        if (idx !== -1) {
                            if (typeof posts.value[idx].replies_count !== 'number') posts.value[idx].replies_count = 0;
                            posts.value[idx].replies_count += 1;
                        }
                    }
                } catch (e) {
                    console.error('[usePostsList] Error manejando evento realtime:', e);
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
