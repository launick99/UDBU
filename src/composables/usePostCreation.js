import { ref, computed } from 'vue';
import { postGlobalnNewPost } from '../services/posts';
import { createPostMedia } from '../services/media';
import { uploadFile, getFileURL } from '../services/storage';

/**
 * Composable para crear posts con imagen opcional.
 * 
 * @param {Object} user - Objeto del usuario (debe tener id)
 * @returns {Object} - Estados y métodos para crear posts
 */
export function usePostCreation(user) {
    const newPost = ref({
        content: null,
        file: null
    });

    const preview = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    /**
     * Valida que hay contenido o archivo para enviar
     */
    const canSubmit = computed(() => {
        return (newPost.value.content && newPost.value.content.trim().length > 0) || newPost.value.file !== null;
    });

    /**
     * Maneja la selección de archivo de imagen
     */
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        const file = files.length > 0 ? files[0] : null;
        newPost.value.file = file;

        if (preview.value) URL.revokeObjectURL(preview.value);
        preview.value = file ? URL.createObjectURL(file) : null;
        
        try { event.target.value = null; } catch(e){}
    };

    /**
     * Elimina la imagen seleccionada y su preview
     */
    const removePreview = () => {
        if (preview.value) URL.revokeObjectURL(preview.value);
        preview.value = null;
        newPost.value.file = null;
    };

    const handleSubmit = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        if (!canSubmit.value) {
            errorMessage.value = "Escribe algo o agrega una imagen.";
            return;
        }

        try {
            loading.value = true;

            let mediaFilename = null;
            if (newPost.value.file) {
                const file = newPost.value.file;
                const ext = file.name.split('.').pop();
                mediaFilename = `${user.value.id}/${crypto.randomUUID()}.${ext}`;
                await uploadFile(mediaFilename, file, 'posts');
            }

            const postData = await postGlobalnNewPost({ 
                sender_id: user.value.id, 
                content: newPost.value.content 
            });

            if (!postData || postData.length === 0) {
                throw new Error("Error: No se pudo crear el post.");
            }
            if (mediaFilename) {
                const postId = postData[0].id;
                await createPostMedia(postId, mediaFilename);
            }

            successMessage.value = "Post creado exitosamente.";
            resetForm();

        } catch (error) {
            errorMessage.value = error.message || "Error al crear el post.";
            console.error("Error creating post:", error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Limpia el formulario después de enviar
     */
    const resetForm = () => {
        newPost.value.content = null;
        newPost.value.file = null;
        if (preview.value) URL.revokeObjectURL(preview.value);
        preview.value = null;
    };

    /**
     * Función auxiliar para obtener URL pública de imagen
     */
    const getImageUrl = (filename) => {
        if (!filename) return null;
        return getFileURL(filename, 'posts');
    };

    return {
        newPost,
        preview,
        loading,
        errorMessage,
        successMessage,
        canSubmit,
        handleFileChange,
        removePreview,
        handleSubmit,
        resetForm,
        getImageUrl
    };
}
