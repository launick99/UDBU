import { ref, watch } from 'vue';
import { updateAuthUser } from '../services/auth';

export function useUserProfileEdit(user) {

    const form = ref({
        id: null,
        display_name: "",
        email: "",
        bio: ""
    });

    const loading = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const handleSubmit = async () => {
        errorMessage.value = "";
        successMessage.value = "";

        try {
            loading.value = true;
            await updateAuthUser({
                display_name: form.value.display_name,
                bio: form.value.bio
            });
            successMessage.value = "Perfil actualizado con éxito.";
        } catch (error) {
            errorMessage.value = error.message || "Error al actualizar el perfil.";
        } finally {
            loading.value = false;
        }
    };

    watch(user, () => {
        if (user.value) {
            form.value = { ...user.value };
        }
    }, { immediate: true });

    return {
        form,
        loading,
        successMessage,
        errorMessage,
        handleSubmit
    };
}
