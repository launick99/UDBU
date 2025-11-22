<template>
    <div class="max-w-2xl mx-auto flex flex-col lg:flex-row">
        <div class="flex-1 p-4">
            <div class="mx-auto px-4 w-full">
                <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                    <div v-if="errorMessage" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {{ errorMessage }}
                    </div>
                    <div v-if="successMessage" class="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {{ successMessage }}
                    </div>

                    <!-- form para crear nuevo post -->
                    <div class="flex items-center mb-3">
                        <img :src="getFileURL(user.avatar_url)" :alt="user.display_name" class="h-10 w-10 rounded-full object-cover border border-gray-200 mr-3">
                        <textarea class="form-textarea" placeholder="¿Qué estás pensando?" type="text" v-model="newPost.content"></textarea>
                    </div>
                    <!-- previews -->
                    <div class="mb-3" v-if="preview">
                        <div class="relative inline-block">
                            <img :src="preview" class="h-20 w-20 object-cover rounded-md border" />
                            <button type="button" @click="removePreview" class="absolute -top-1 -right-1 bg-white rounded-full p-1 text-xs shadow">✕</button>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between">
                        <div class="flex space-x-2 mb-2 sm:mb-0 items-center">
                            <label class="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors cursor-pointer">
                                <i class="fa-solid fa-camera fa-lg mr-3"></i>
                                <span class="hidden sm:inline">Foto</span>
                                <input type="file" class="hidden" accept="image/*" @change="handleFileChange" :disabled="submitting">
                            </label>
                            <button type="button" class="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors">
                                <i class="fa-solid fa-hashtag fa-lg mr-3"></i>
                                <span class="hidden sm:inline">Tag</span>
                            </button>
                        </div>
                        <button :disabled="!canSubmit || submitting" type="submit" :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-colors', (canSubmit && !submitting) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
                            <span v-if="submitting">Enviando...</span>
                            <span v-else>Post</span>
                        </button>
                    </div>
                </form>
                <div class="flex flex-row justify-content-between container mx-auto">
                    <!-- lista de posts -->
                    <div class="w-full post-list space-y-4 mb-4">
                        <div v-if="posts.length === 0" class="flex justify-center w-full">
                            <div class="loader"></div>
                        </div>
                        <Post v-for="post in posts" :key="post.id" :post="post" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
    import Post from '../components/Posts/Post.vue';
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { usePostCreation } from '../composables/usePostCreation';
    import { usePostsList } from '../composables/usePostsList';
    import { getFileURL } from '../services/storage';

    const { user } = useAuthUserState();
    const {
        newPost,
        preview,
        loading: submitting,
        errorMessage,
        successMessage,
        canSubmit,
        handleFileChange,
        removePreview,
        handleSubmit
    } = usePostCreation(user);

    const {
        posts,
        loading,
        refresh
    } = usePostsList();
</script>
