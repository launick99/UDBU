import { ref, computed } from 'vue';
import { updatePost, deletePost } from '../services/posts';

/**
 * Composable para editar y eliminar posts.
 * 
 * @param {Object} post - Post object con id y content
 * @returns {Object} - Estados y métodos para editar/eliminar posts
 */
export function usePostEdit(post) {
    const editContent = ref(post?.content || '');
    const isEditing = ref(false);
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    /**
     * Valida que el contenido no esté vacío
     */
    const canSubmit = computed(() => {
        return editContent.value && editContent.value.trim().length > 0;
    });

    /**
     * Inicia el modo edición
     */
    const startEditing = () => {
        isEditing.value = true;
        editContent.value = post.content;
    };

    /**
     * Cancela la edición
     */
    const cancelEditing = () => {
        isEditing.value = false;
        editContent.value = post.content;
    };

    /**
     * Actualiza el post
     */
    const handleUpdate = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        if (!canSubmit.value) {
            errorMessage.value = "El contenido no puede estar vacío.";
            return false;
        }

        if (editContent.value === post.content) {
            errorMessage.value = "No hay cambios que guardar.";
            return false;
        }

        try {
            loading.value = true;
            const updatedPost = await updatePost(post.id, editContent.value);
            
            if (updatedPost) {
                post.content = updatedPost.content;
                post.updated_at = updatedPost.updated_at;
                isEditing.value = false;
                successMessage.value = "Post actualizado exitosamente.";
                return true;
            } else {
                throw new Error("No se pudo actualizar el post.");
            }
        } catch (error) {
            errorMessage.value = error.message || "Error al actualizar el post.";
            console.error("Error updating post:", error);
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Elimina el post
     */
    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este post?")) {
            return false;
        }

        try {
            loading.value = true;
            await deletePost(post.id);
            successMessage.value = "Post eliminado exitosamente.";
            return true;
        } catch (error) {
            errorMessage.value = error.message || "Error al eliminar el post.";
            console.error("Error deleting post:", error);
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        editContent,
        isEditing,
        loading,
        errorMessage,
        successMessage,
        canSubmit,
        startEditing,
        cancelEditing,
        handleUpdate,
        handleDelete
    };
}
