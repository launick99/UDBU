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
                                    :src="getFileURL(user.avatar_url)" 
                                    alt="Vista previa de la imagen"
                                    class="w-32 h-32 object-cover rounded-full border border-gray-300"
                                >
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <h2 class="text-xl font-bold">{{ form.display_name || "Sin nombre aún" }}</h2>
                            <p class="text-gray-700">{{ form.email }}</p>
                        </div>
                        <hr class="my-6 border-t border-gray-300">
                        <div class="text-sm text-gray-600">
                            {{ form.bio || "No biografía aún :(" }}
                        </div>
                    </div>
                </div>

                <!-- Formulario de edición -->
                <div class="col-span-4 sm:col-span-9">
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Editar perfil</h3>
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-1" for="username">Nombre para mostrar</label>
                                <input v-model="form.display_name" id="usarname" name="username" type="text" class="w-full border border-gray-300 rounded px-3 py-2" />
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 mb-1" for="bio">Biografía</label>
                                <textarea v-model="form.bio" id="bio" name="bio" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
                            </div>
                            <div class="flex justify-end">
                                <button :disabled="loading" type="submit" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                                    Guardar cambios
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
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { useUserProfileEdit } from '../composables/useUserProfileEdit';
    import { getFileURL } from '../services/storage';

    const { user } = useAuthUserState();
    const { form, loading, successMessage, errorMessage, handleSubmit } = useUserProfileEdit(user);

</script>