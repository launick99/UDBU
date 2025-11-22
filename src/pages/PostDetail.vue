<template>
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row">
        <SideNavbarLeft class="p-4"></SideNavbarLeft>
        <div class="flex-1 p-4">
            <div class="mx-auto px-4 w-full max-w-2xl">
                <div class="mb-4">
                    <RouterLink to="/posts" class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        <i class="fa-solid fa-arrow-left mr-2"></i>
                        Volver
                    </RouterLink>
                </div>
                <div v-if="post" class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <div class="p-4">
                        <div class="flex items-start justify-between">
                            <div class="text-sm font-semibold text-gray-900">
                                <RouterLink :to="`/usuario/${post.sender_id}`" class="flex items-center">
                                    <img :src="getFileURL(post.user_profile?.avatar_url)" :alt="post.user_profile?.display_name" class="h-10 w-10 rounded-full object-cover border border-gray-200">
                                    <div class="ml-3">
                                        {{ post.user_profile?.display_name || post.user_profile?.email || post.sender_id }}
                                        <div class="text-xs text-gray-500">{{ timeAgo(post.created_at) }}</div>
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                        <div class="mt-3">
                            <p class="text-gray-800 text-base">
                                {{ post.content }}
                            </p>
                        </div>
                        <div class="mt-3 -mx-4" v-if="hasMedia">
                            <img :src="getFileURL(post.post_media[0].media, 'posts')" alt="Post" class="w-full h-auto max-h-[500px] object-cover">
                        </div>
                        <div class="mt-3 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                            <span>24 Me Gusta</span><span>{{ replies.length }} Comentarios</span>
                        </div>
                    </div>
                </div>
                <form v-if="post" @submit.prevent="handleSubmitReply" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div v-if="errorMessageReply" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {{ errorMessageReply }}
                    </div>
                    <div v-if="successMessageReply" class="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {{ successMessageReply }}
                    </div>
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
        <SideNavbarRight class="p-4"></SideNavbarRight>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import SideNavbarLeft from '../components/Navegation/SideNavbarLeft.vue';
    import SideNavbarRight from '../components/Navegation/SideNavbarRight.vue';
    import Reply from '../components/Posts/Reply.vue';
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { useReplyCreation } from '../composables/useReplyCreation';
    import { useRepliesList } from '../composables/useRepliesList';
    import { getFileURL } from '../services/storage';
    import { fetchPost } from '../services/posts';
    import { timeAgo } from '../composables/useTimeAgo';

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
    } = useReplyCreation(user, postId.value);

    const {
        replies,
        loading: loadingReplies
    } = useRepliesList(postId);

    /**
     * Valida si el post tiene imagen
     */
    const hasMedia = computed(() => 
        post.value && Array.isArray(post.value.post_media) && post.value.post_media.length > 0
    );

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
        await handleSubmitReplyComposable();
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
