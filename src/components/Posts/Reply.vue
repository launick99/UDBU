<template>
    <div class="border-l-2 border-gray-200 pl-4 ml-2 mb-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-sm">
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

                <div class="mt-2 flex items-center gap-4">
                    <RouterLink :to="`/post/${reply.id}`" class="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors">Responder</RouterLink>
                    <div class="text-xs text-gray-600">{{ reply.replies_count ?? 0 }} respuestas</div>
                </div>
            </div>
        </div>

        <div v-if="showReplies && nestedReplies.length > 0" class="mt-3">
            <Reply
                v-for="nestedReply in nestedReplies"
                :key="nestedReply.id"
                :reply="nestedReply"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { getFileURL } from '../../services/storage';
    import { timeAgo } from '../../composables/useTimeAgo';

    const props = defineProps({ reply: { type: Object, required: true } });

    const showReplies = ref(false);
    const nestedReplies = ref([]);

    const hasMedia = computed(() => Array.isArray(props.reply.post_media) && props.reply.post_media.length > 0);
</script>
