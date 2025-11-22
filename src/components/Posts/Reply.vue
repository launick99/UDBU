<template>
    <div class="border-l-2 border-gray-200 pl-4 ml-2 mb-3">
        <RouterLink :to="`/post/${reply.id}`" class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-sm">
            <div class="p-3">
                <div class="flex items-start justify-between">
                    <div class="text-sm font-semibold text-gray-900">
                        <RouterLink :to="`/usuario/${reply.sender_id}`" class="flex items-center">
                            <img :src="getFileURL(reply.user_profile?.avatar_url)" :alt="reply.user_profile?.display_name" class="h-8 w-8 rounded-full object-cover border border-gray-200">
                            <div class="ml-2">
                                <div>{{ reply.user_profile?.display_name || reply.user_profile?.email || reply.sender_id }}</div>
                                <div class="text-xs text-gray-500">{{ timeAgo(reply.created_at) }}</div>
                            </div>
                        </RouterLink>
                    </div>
                </div>

                <div class="mt-2">
                    <p class="text-gray-800 text-sm">{{ reply.content }}</p>
                </div>

                <div class="mt-2 -mx-3" v-if="hasMedia">
                    <img :src="getFileURL(reply.post_media[0].media, 'posts')" alt="Reply" class="w-full h-auto max-h-[300px] object-cover rounded">
                </div>

                <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                    <span>{{ reply.likes_count ?? 0 }} Me Gusta</span>
                    <span>{{ reply.replies_count ?? 0 }} respuestas</span>
                </div>

                <div class="mt-2 flex items-center gap-4">
                    <button @click.prevent="toggleLike" class="text-xs text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        <i :class="[ reply.liked_by_user ? 'fa-solid text-red-500' : 'fa-regular', 'fa-heart', 'mr-2', 'w-4' ]"></i>
                        <span>{{ reply.liked_by_user ? 'Te gusta' : 'Me gusta ' }}</span>
                    </button>
                    <RouterLink :to="`/post/${reply.id}`" class="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors">Responder</RouterLink>
                    <div class="text-xs text-gray-600">{{ reply.replies_count ?? 0 }} respuestas</div>
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { getFileURL } from '../../services/storage';
    import { timeAgo } from '../../composables/useTimeAgo';
    import { useAuthUserState } from '../../composables/useAuthUserState';
    import { likePost, unlikePost, getPostLikes, userLikedPost } from '../../services/posts';

    const props = defineProps({ reply: { type: Object, required: true } });
    
    const emit = defineEmits(['reply-deleted']);
    
    const hasMedia = computed(() => Array.isArray(props.reply.post_media) && props.reply.post_media.length > 0);
    const { user } = useAuthUserState();
    const showMenu = ref(false);

    onMounted(async () => {
        try {
            if (typeof props.reply.likes_count !== 'number') {
                props.reply.likes_count = await getPostLikes(props.reply.id);
            }
        } catch (e) {
            props.reply.likes_count = props.reply.likes_count || 0;
        }

        try {
            if (user.value && typeof props.reply.liked_by_user !== 'boolean') {
                props.reply.liked_by_user = await userLikedPost(props.reply.id, user.value.id);
            }
        } catch (e) {
            props.reply.liked_by_user = false;
        }
    });

    const toggleLike = async () => {
        if (!user.value || !user.value.id) return;

        try {
            if (props.reply.liked_by_user) {
                await unlikePost(props.reply.id, user.value.id);
                props.reply.likes_count = (props.reply.likes_count || 1) - 1;
                props.reply.liked_by_user = false;
            } else {
                await likePost(props.reply.id, user.value.id);
                props.reply.likes_count = (props.reply.likes_count || 0) + 1;
                props.reply.liked_by_user = true;
            }
        } catch (e) {
            console.error('Error toggling like on reply:', e);
        }
    };
</script>
