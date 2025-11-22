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
                <span>{{ post.likes_count ?? 0 }} Me Gusta</span><span>{{ post.replies_count || 0 }} Comentarios</span>
            </div>
            <div class="mt-2 pt-2 border-t border-gray-100 flex gap-10">
                <button @click.prevent="toggleLike" class="flex items-center py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i :class="[ post.liked_by_user ? 'fa-solid text-red-500' : 'fa-regular', 'fa-heart', 'fa-xl', 'w-6', 'mr-1' ]" :aria-pressed="post.liked_by_user"></i>
                    <span class="w-20">{{ post.liked_by_user ? 'Te gusta' : 'Me gusta' }}</span>
                </button>
                <RouterLink :to="`/post/${post.id}`" class="flex items-center py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-comment text-gray-500 fa-xl w-6 mr-1"></i>
                    <span class="w-20">Comentar</span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted } from 'vue';
    import { getFileURL } from '../../services/storage';
    import { timeAgo } from '../../composables/useTimeAgo';
    import { useAuthUserState } from '../../composables/useAuthUserState';
    import { likePost, unlikePost, getPostLikes, userLikedPost } from '../../services/posts';

    const props = defineProps({
        post: {
            type: Object,
            required: true
        }
    });

    const hasMedia = computed(() => 
        Array.isArray(props.post.post_media) && props.post.post_media.length > 0
    );

    const { user } = useAuthUserState();
    onMounted(async () => {
        props.post.likes_count = await getPostLikes(props.post.id);
        try {
            if (user.value) {
                props.post.liked_by_user = await userLikedPost(props.post.id, user.value.id);
            }
        } catch (error) {
            props.post.liked_by_user = false;
        }
    });

    const toggleLike = async () => {
        try {
            if (props.post.liked_by_user) {
                await unlikePost(props.post.id, user.value.id);
                props.post.likes_count = (props.post.likes_count || 1) - 1;
                props.post.liked_by_user = false;
            } else {
                await likePost(props.post.id, user.value.id);
                props.post.likes_count = (props.post.likes_count || 0) + 1;
                props.post.liked_by_user = true;
            }
        } catch (error) {
            console.error('Error al dar/quitar like:', error);
        }
    };
</script>