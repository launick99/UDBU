import { ref, computed, watch } from 'vue';
import { createReply, fetchReply } from '../services/replies';
import { createPostMedia } from '../services/media';
import { uploadFile } from '../services/storage';

export function useReplyCreation(user, parentPostId) {
    const newReply = ref({
        content: null,
        file: null
    });

    const preview = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");

    const canSubmit = computed(() => {
        return newReply.value.content && newReply.value.content.trim().length > 0;
    });

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        newReply.value.file = file;

        if(preview.value) URL.revokeObjectURL(preview.value);
        preview.value = file ? URL.createObjectURL(file) : null;

        try{ 
            event.target.value = null;
        } catch {
            // nada
        }
    };

    const removePreview = () => {
        if(preview.value){
            URL.revokeObjectURL(preview.value);
        }
        preview.value = null;
        newReply.value.file = null;
    };

    const resetForm = () => {
        newReply.value.content = null;
        removePreview();
    };

    const handleSubmit = async () => {
        errorMessage.value = "";
        successMessage.value = "";

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
                content: newReply.value.content.trim(),
                parent_post_id: parentPostId.value
            });

            if (!replyData || replyData.length === 0) {
                throw new Error("No se pudo crear la respuesta.");
            }

            const replyId = replyData[0].id;

            if (mediaFilename) {
                await createPostMedia(replyId, mediaFilename);
            }

            let reply = await fetchReply(replyId);

            successMessage.value = "Respuesta creada exitosamente.";
            resetForm();

            return reply;

        } catch (error) {
            errorMessage.value = error.message || "Error al crear la respuesta.";
            console.error("Error creating reply:", error);
        } finally {
            loading.value = false;
        }
    };
    
    watch(parentPostId, () => {
        resetForm();
        errorMessage.value = "";
        successMessage.value = "";
    });

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
