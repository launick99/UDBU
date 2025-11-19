<template>
    <div class="mi-perfil">
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <!-- Perfil -->
                <div class="col-span-4 sm:col-span-3">
                    <div class="bg-white shadow rounded-lg p-6">
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
                        <h3 class="text-lg font-semibold mb-4">Actualizar mi Imagen</h3>
                        <form @submit.prevent="handleSubmit">
                           <div class="mb-4">
                                <label class="block text-gray-700 mb-1" for="avatar">Imagen</label>
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
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from 'vue';
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { updateAuthUserAvatar } from '../services/auth';

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

        function handleSubmit() {
            try {
                loading.value = true;
                updateAuthUserAvatar(imageData.value.file);
            } catch (error) {
                errorMessage.value = 'Error al actualizar la imagen de perfil.';
                return;
            }
            loading.value = false;
            successMessage.value = 'Imagen Actualizada.';
        }

        function handleImageChange(event){
            const file = event.target.files[0];
            if(!file){
                imageData.value = { file: null, preview: null };
                return;
            }
            imageData.value.file = file;
        }

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