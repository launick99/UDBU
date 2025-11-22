<template>
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row">
        <div class="flex-1 p-4">
            <div class="mx-auto px-4 w-full max-w-2xl">
                <button @click="goBack" class="mb-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                    <i class="fa-solid fa-arrow-left mr-2"></i>
                    Volver
                </button>
                <Post v-if="post" :post="post" />
                <form v-if="post" @submit.prevent="handleSubmitReply" class="mt-[-2rem] bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <!-- TODO: ver que quede lindo -->
                    <!-- <div v-if="errorMessageReply" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {{ errorMessageReply }}
                    </div>
                    <div v-if="successMessageReply" class="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {{ successMessageReply }}
                    </div> -->
                    <div class="flex items-center mb-3">
                        <img :src="getFileURL(user.avatar_url)" :alt="user.display_name" class="h-10 w-10 rounded-full object-cover border border-gray-200 mr-3">
                        <textarea class="form-textarea" placeholder="¿Qué respondes?" type="text" v-model="newReply.content"></textarea>
                    </div>
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
                        </div>
                        <button :disabled="!canSubmit || submitting" type="submit" :class="['btn-primary', (!canSubmit || submitting) ? 'disabled' : '']">
                            <span v-if="submitting">Enviando...</span>
                            <span v-else>Responder</span>
                        </button>
                    </div>
                </form>
                <div class="space-y-4 mb-4">
                    <div v-if="loadingReplies" class="flex justify-center w-full">
                        <div class="loader"></div>
                    </div>
                    <div v-else-if="replies.length === 0" class="text-center py-8 text-gray-500">
                        <p>No hay respuestas aún.</p>
                    </div>
                    <div v-else>
                        <Reply 
                            v-for="reply in replies"
                            :key="reply.id"
                            :reply="reply"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import Reply from '../components/Posts/Reply.vue';
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { useReplyCreation } from '../composables/useReplyCreation';
    import { useRepliesList } from '../composables/useRepliesList';
    import { getFileURL } from '../services/storage';
    import { fetchPost } from '../services/posts';
    import Post from '../components/Posts/Post.vue';

    const route = useRoute();
    const postId = ref(route.params.id);

    const { user } = useAuthUserState();
    const post = ref(null);
    const loadingPost = ref(true);

    const {
        newReply,
        preview,
        loading: submitting,
        errorMessage: errorMessageReply,
        successMessage: successMessageReply,
        canSubmit,
        handleFileChange,
        removePreview,
        handleSubmit: handleSubmitReplyComposable
    } = useReplyCreation(user, postId);

    const {
        replies,
        loading: loadingReplies
    } = useRepliesList(postId);

    /**
     * Navega hacia atrás o a la lista de posts si no hay historial
     * (para cuando accede a un una respuesta volver al post)
     */
    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            useRouter.push('/posts');
        }
    }

    /**
     * Carga el post específico
     */
    const loadPost = async () => {
        try {
            loadingPost.value = true;
            post.value = await fetchPost(postId.value);
        } catch (error) {
            console.error("Error loading post:", error);
        } finally {
            loadingPost.value = false;
        }
    };

    /**
     * Maneja el envío de respuesta
     */
    const handleSubmitReply = async () => {
        const created = await handleSubmitReplyComposable();
        if (created) {
            try {
                const exists = replies.value.find(r => r.id === created.id);
                if (!exists) replies.value.unshift(created);
            } catch (e) {
                console.error('Error agregando respuesta localmente:', e);
            }
        }
    };

    onMounted(() => {
        loadPost();
    });

    watch(
        () => route.params.id,
        (newId) => {
            postId.value = newId;
            loadPost();
        },
        { immediate: true }
    );
</script>
