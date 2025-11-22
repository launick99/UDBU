<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden transition-all duration-300 hover:shadow-md w-full">
        <div class="p-4">
            <RouterLink :to="`post/${post.id}`">
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
                    <div class="relative" v-if="isOwner">
                        <button @click="toggleMenu" class="text-gray-400 hover:text-gray-500">
                            <i class="fa-solid fa-ellipsis fa-xl"></i>
                        </button>
                        <!-- Menú desplegable -->
                        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button @click="startEdit" class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                                <i class="fa-solid fa-pen fa-sm mr-2"></i>
                                Editar
                            </button>
                            <button @click="confirmDelete" class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center">
                                <i class="fa-solid fa-trash fa-sm mr-2"></i>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Modo edición -->
                <div v-if="isEditing" class="mt-3">
                    <textarea v-model="editContent" class="form-textarea w-full p-2 border border-gray-200 rounded" rows="4"></textarea>
                    <div class="mt-2 flex gap-2">
                        <button @click="saveEdit" :disabled="!canSubmit || loading" class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                            {{ loading ? 'Guardando...' : 'Guardar' }}
                        </button>
                        <button @click="cancelEdit" class="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">
                            Cancelar
                        </button>
                    </div>
                    <div v-if="errorMessage" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {{ errorMessage }}
                    </div>
                    <div v-if="successMessage" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                        {{ successMessage }}
                    </div>
                </div>
    
                <!-- contenido del post -->
                <div v-else class="mt-3">
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
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue';
    import { getFileURL } from '../../services/storage';
    import { timeAgo } from '../../composables/useTimeAgo';
    import { useAuthUserState } from '../../composables/useAuthUserState';
    import { likePost, unlikePost, getPostLikes, userLikedPost } from '../../services/posts';
    import { usePostEdit } from '../../composables/usePostEdit';

    const props = defineProps({
        post: {
            type: Object,
            required: true
        }
    });

    const emit = defineEmits(['post-deleted']);

    const { user } = useAuthUserState();
    const showMenu = ref(false);
    
    const {
        editContent,
        isEditing,
        loading,
        errorMessage,
        successMessage,
        canSubmit,
        startEditing,
        cancelEditing,
        handleUpdate,
        handleDelete
    } = usePostEdit(props.post);

    const isOwner = computed(() => {
        return user.value && user.value.id === props.post.sender_id;
    });

    const hasMedia = computed(() => 
        Array.isArray(props.post.post_media) && props.post.post_media.length > 0
    );

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

    const toggleMenu = () => {
        showMenu.value = !showMenu.value;
    };

    const startEdit = () => {
        startEditing();
        showMenu.value = false;
    };

    const saveEdit = async () => {
        const success = await handleUpdate();
        if (success) {
            isEditing.value = false;
        }
    };

    const cancelEdit = () => {
        cancelEditing();
    };

    const confirmDelete = async () => {
        const success = await handleDelete();
        if (success) {
            // El post será removido de la lista por el componente padre
            showMenu.value = false;
            emit('post-deleted', props.post.id);
        }
    };

</script>
