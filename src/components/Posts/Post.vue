<template>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden transition-all duration-300 hover:shadow-md w-full">
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
                <button class="text-gray-400 hover:text-gray-500">
                    <i class="fa-solid fa-ellipsis fa-xl"></i>
                </button>
            </div>
            <!-- contenido del post -->
            <div class="mt-3">
                <p class="text-gray-800 text-sm">
                    {{ post.content }}
                </p>
            </div>
            <!-- Galeria -->
            <div class="mt-3 -mx-4" v-if="hasMedia">
                <img :src="getFileURL(post.post_media[0].media, 'posts')" alt="Post" class="w-full h-auto max-h-[500px] object-cover">
            </div>
            <!-- Cantida de likes, comentarios -->
            <div class="mt-3 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>24 Me Gusta</span><span>{{ post.replies_count || 0 }} Comentarios</span>
            </div>
            <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                <button class="flex items-center justify-center w-1/3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-heart text-gray-500 fa-xl w-8 mr-3"></i>
                    <span>Me Gusta</span>
                </button>
                <RouterLink :to="`/post/${post.id}`" class="flex items-center justify-center w-1/3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-comment text-gray-500 fa-xl w-8 mr-3"></i>
                    <span>Comentar</span>
                </RouterLink>
                <button class="flex items-center justify-center w-1/3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-share-from-square text-gray-500 fa-xl w-8 mr-3"></i>
                    <span>Compartir</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { getFileURL } from '../../services/storage';
    import { timeAgo } from '../../composables/useTimeAgo';

    const props = defineProps({
        post: {
            type: Object,
            required: true
        }
    });

    const hasMedia = computed(() => 
        Array.isArray(props.post.post_media) && props.post.post_media.length > 0
    );

    if (typeof props.post.replies_count !== 'number') props.post.replies_count = 0;
</script>