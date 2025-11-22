import { ref, onMounted, onUnmounted } from 'vue';
import { fetchPostReplies, subscribeToPostReplies, fetchReply } from '../services/replies';

/**
 * Composable para obtener y mantener sincronizado un listado de respuestas.
 * 
 * @param {String} parentPostId - ID del post padre
 * @returns {Object} - Estados y métodos para gestionar respuestas
 */
export function useRepliesList(parentPostId) {
    const replies = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");

    let unsubscribe = () => {};

    /**
     * Carga las respuestas iniciales
     */
    const loadReplies = async () => {
        try {
            loading.value = true;
            errorMessage.value = "";
            replies.value = await fetchPostReplies(parentPostId);
            try {
                await Promise.all(replies.value.map(async (r) => {
                    try {
                        const nested = await fetchPostReplies(r.id);
                        r.replies_count = Array.isArray(nested) ? nested.length : 0;
                    } catch (e) {
                        r.replies_count = 0;
                    }
                }));
            } catch (e) {
                console.error('[useRepliesList] Error inicializando replies_count en respuestas:', e);
            }

        } catch (error) {
            errorMessage.value = error.message || "Error al cargar respuestas";
            console.error("[useRepliesList.js loadReplies] Error al cargar respuestas:", error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Suscribe a nuevas respuestas en tiempo real
     */
    const subscribeToNewReplies = () => {
        try {
            unsubscribe = subscribeToPostReplies(parentPostId, async (newReplyData) => {
                try {
                    const enrichedReply = await fetchReply(newReplyData.id);
                    // inicializar contador de respuestas anidadas en la nueva reply
                    try {
                        const nested = await fetchPostReplies(enrichedReply.id);
                        enrichedReply.replies_count = Array.isArray(nested) ? nested.length : 0;
                    } catch (e) {
                        enrichedReply.replies_count = 0;
                    }
                    replies.value.push(enrichedReply);
                } catch (error) {
                    console.error("Error enriching reply:", error);
                    newReplyData.replies_count = 0;
                    replies.value.push(newReplyData);
                }
            });
        } catch (error) {
            console.error("[useRepliesList.js subscribeToNewReplies] Error al suscribirse a respuestas:", error);
        }
    };

    /**
     * Elimina una respuesta del listado
     */
    const removeReply = (replyId) => {
        const index = replies.value.findIndex(r => r.id === replyId);
        if (index !== -1) {
            replies.value.splice(index, 1);
        }
    };

    /**
     * Actualiza una respuesta en el listado
     */
    const updateReply = (replyId, updatedData) => {
        const index = replies.value.findIndex(r => r.id === replyId);
        if (index !== -1) {
            replies.value[index] = { ...replies.value[index], ...updatedData };
        }
    };

    /**
     * Recarga la lista de respuestas
     */
    const refresh = async () => {
        await loadReplies();
    };

    onMounted(async () => {
        await loadReplies();
        subscribeToNewReplies();
    });

    onUnmounted(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    return {
        replies,
        loading,
        errorMessage,
        loadReplies,
        subscribeToNewReplies,
        removeReply,
        updateReply,
        refresh
    };
}
