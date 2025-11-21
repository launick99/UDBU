<template>
    <div class="mi-perfil">
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <!-- Perfil -->
                <div class="col-span-4 sm:col-span-3">
                    <div class="bg-white shadow rounded-lg p-6">
                        <div class="flex flex-col items-center">
                            <div class="mb-4">
                                <img 
                                    :src="imageData.preview || getFileURL(user.avatar_url)" 
                                    alt="Vista previa de la imagen"
                                    class="w-32 h-32 object-cover rounded-full border border-gray-300"
                                >
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <h2 class="text-xl font-bold">{{ user.display_name }}</h2>
                            <p class="text-gray-700">{{ user.email }}</p>
                        </div>
                        <hr class="my-6 border-t border-gray-300">
                        <div class="text-sm text-gray-600">
                            {{ user.bio || "No biografía aún :(" }}
                        </div>
                    </div>
                </div>

                <!-- Formulario de edición -->
                <div class="col-span-4 sm:col-span-9">
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Actualizar mi imagen</h3>
                        <form @submit.prevent="handleSubmit">
                           <div class="mb-4">
                                <label class="sr-only" for="avatar">Imagen</label>
                                <input @change="handleImageChange" id="avatar" name="avatar" type="file" class="w-full border border-gray-300 rounded px-3 py-2" />
                            </div>
                            <div class="flex justify-end">
                                <button :disabled="loading" type="submit" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                                    Actualizar mi Foto
                                </button>
                            </div>
                        </form>
                        <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
                        <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
                    </div>
                    <p class="text-gray-600 mt-4 text-sm">
                        Para garantizar una carga correcta, la imagen debe cumplir con los requisitos del servicio de almacenamiento de Supabase: 
                        formatos permitidos (JPG, PNG o WEBP), un tamaño de archivo adecuado para evitar rechazos por límite de peso y 
                        un nombre sin caracteres especiales que puedan generar inconvenientes. 
                        Si alguno de estos parámetros no se respeta, la carga podría fallar.
                    </p>
                    <p class="text-gray-500 mt-2 text-xs">
                        En caso de error, se recomienda verificar nuevamente el formato, peso y estado del archivo antes de intentar realizar otra carga.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { onUnmounted, ref } from 'vue';
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { updateAuthUserAvatar } from '../services/auth';
    import { getFileURL } from '../services/storage';

    const { user } = useAuthUserState();
    const { imageData, loading, handleSubmit, handleImageChange, successMessage, errorMessage } = useProfileEditAvatarForm(user);


    function useProfileEditAvatarForm(user) {

        const loading = ref(false);
        const successMessage = ref('');
        const errorMessage = ref('');

        const imageData = ref({
            file: null,
            preview: null
        });

        async function handleSubmit() {
            try {
                loading.value = true;
                await updateAuthUserAvatar(imageData.value.file);
            } catch (error) {
                errorMessage.value = 'Error al actualizar la imagen de perfil. ' + error.message;
                loading.value = false;
                return;
            }
            loading.value = false;
            successMessage.value = 'Imagen Actualizada.';
        }

        function handleImageChange(event){
            imageData.value.file = event.target.files[0];
            if (imageData.value.preview) {
                URL.revokeObjectURL(imageData.value.preview);
                imageData.value.preview = null;
            }
            imageData.value.preview = URL.createObjectURL(imageData.value.file);

        }

        onUnmounted(() => {
            if (imageData.value.preview) {
                URL.revokeObjectURL(imageData.value.preview);
            }
        });

        return {
            imageData,
            loading,
            handleSubmit,
            handleImageChange,
            successMessage,
            errorMessage
        };
    }


   

</script>