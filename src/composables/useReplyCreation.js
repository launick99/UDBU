import { ref, computed } from 'vue';
import { createReply } from '../services/replies';
import { createPostMedia } from '../services/media';
import { uploadFile } from '../services/storage';

/**
 * Composable para crear respuestas con imagen opcional.
 * 
 * @param {Object} user - Objeto del usuario
 * @param {String} parentPostId - ID del post al que se está respondiendo
 * @returns {Object}
 */
export function useReplyCreation(user, parentPostId) {
    const newReply = ref({
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
        return newReply.value.content && newReply.value.content.trim().length > 0;
    });

    /**
     * Maneja la selección de archivo de imagen
     */
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        const file = files.length > 0 ? files[0] : null;
        newReply.value.file = file;

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
        newReply.value.file = null;
    };

    const handleSubmit = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        if (!canSubmit.value) {
            errorMessage.value = "Escribe algo o agrega una imagen.";
            return;
        }

        // Validar que content no sea null o vacío
        const contentText = newReply.value.content ? newReply.value.content.trim() : "";
        if (!contentText) {
            errorMessage.value = "El contenido de la respuesta no puede estar vacío.";
            return;
        }

        try {
            loading.value = true;

            let mediaFilename = null;
            if (newReply.value.file) {
                const file = newReply.value.file;
                const ext = file.name.split('.').pop();
                mediaFilename = `${user.value.id}/${crypto.randomUUID()}.${ext}`;
                await uploadFile(mediaFilename, file, 'posts');
            }

            const replyData = await createReply({ 
                sender_id: user.value.id, 
                content: contentText,
                parent_post_id: parentPostId
            });

            if (!replyData || replyData.length === 0) {
                throw new Error("Error: No se pudo crear la respuesta.");
            }
            if (mediaFilename) {
                const replyId = replyData[0].id;
                await createPostMedia(replyId, mediaFilename);
            }

            successMessage.value = "Respuesta creada exitosamente.";
            resetForm();

        } catch (error) {
            errorMessage.value = error.message || "Error al crear la respuesta.";
            console.error("Error creating reply:", error);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Limpia el formulario después de enviar
     */
    const resetForm = () => {
        newReply.value.content = null;
        newReply.value.file = null;
        if (preview.value) URL.revokeObjectURL(preview.value);
        preview.value = null;
    };

    return {
        newReply,
        preview,
        loading,
        errorMessage,
        successMessage,
        canSubmit,
        handleFileChange,
        removePreview,
        handleSubmit,
        resetForm
    };
}
