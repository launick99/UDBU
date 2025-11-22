import { ref, onMounted, onUnmounted, watch } from 'vue';
import { fetchPostReplies, subscribeToPostReplies, fetchReply } from '../services/replies';

/**
 * Composable para obtener y mantener sincronizado un listado de respuestas.
 * 
 * @param {Ref<String> | String} parentPostId
 */
export function useRepliesList(parentPostId) {
    const parentId = ref(parentPostId);

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
            replies.value = await fetchPostReplies(parentId.value);
            await Promise.all(
                replies.value.map(async (r) => {
                    try {
                        const nested = await fetchPostReplies(r.id);
                        r.replies_count = Array.isArray(nested) ? nested.length : 0;
                    } catch {
                        r.replies_count = 0;
                    }
                })
            );
        } catch (error) {
            errorMessage.value = error.message || "Error al cargar respuestas";
            console.error("[useRepliesList loadReplies]", error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Suscribe a nuevas respuestas en tiempo real
     */
    const subscribeToNewReplies = () => {
        try {
            unsubscribe = subscribeToPostReplies(parentId.value, async (newReplyData) => {
                try {
                    const enrichedReply = await fetchReply(newReplyData.id);

                    try {
                        const nested = await fetchPostReplies(enrichedReply.id);
                        enrichedReply.replies_count = Array.isArray(nested) ? nested.length : 0;
                    } catch {
                        enrichedReply.replies_count = 0;
                    }

                    replies.value.push(enrichedReply);
                } catch (error) {
                    console.error("[Realtime enrich reply] Error:", error);
                    newReplyData.replies_count = 0;
                    replies.value.push(newReplyData);
                }
            });
        } catch (error) {
            console.error("[useRepliesList subscribeToNewReplies]", error);
        }
    };

    /**
     * Elimina una respuesta del listado
     */
    const removeReply = (replyId) => {
        const index = replies.value.findIndex(r => r.id === replyId);
        if (index !== -1) replies.value.splice(index, 1);
    };

    /**
     * Actualiza una respuesta en el listado
     */
    const updateReply = (replyId, updatedData) => {
        const index = replies.value.findIndex(r => r.id === replyId);
        if (index !== -1) replies.value[index] = { ...replies.value[index], ...updatedData };
    };

    const refresh = async () => {
        await loadReplies();
    };

    onMounted(() => {
        loadReplies();
        subscribeToNewReplies();
    });

    watch(parentId, async () => {
        unsubscribe();
        replies.value = [];
        await loadReplies();
        subscribeToNewReplies();
    });

    onUnmounted(() => {
        unsubscribe();
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
