<template>
    <div class="mi-perfil">
        <!-- tome prestado el template y le hice algunas modificaciones -->
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
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
                            <h2 class="text-xl font-bold">{{ user.display_name }}</h2>
                            <p class="text-blue-900 hover:text-blue-950">
                                <a :href="`mailto:${user.email}`">{{ user.email }}</a>
                            </p>
                            <div class="mt-6 flex flex-wrap gap-4 justify-center">
                                <RouterLink to="/perfil/editar" class="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded">
                                    Editar
                                </RouterLink>
                                <RouterLink to="/perfil/editar-avatar" class="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded">
                                    Cambiar Foto
                                </RouterLink>
                            </div>
                        </div>
                        <hr class="my-6 border-t border-gray-300">
                        <div class="flex flex-col">
                            {{ user.bio || "No biografia aun :(." }}
                        </div>
                    </div>
                </div>
                <div class="col-span-4 sm:col-span-9">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold mb-4">Perfil</h3>
                        </div>
                        <div class="mt-4 mb-6">
                            <div class="flex space-x-2">
                                <button @click="activeTab = 'posts'" :class="['px-3 py-1 rounded', activeTab==='posts' ? 'bg-primary text-white' : 'bg-white border']">Publicaciones</button>
                                <button @click="activeTab = 'replies'" :class="['px-3 py-1 rounded', activeTab==='replies' ? 'bg-primary text-white' : 'bg-white border']">Respuestas</button>
                                <button @click="activeTab = 'likes'" :class="['px-3 py-1 rounded', activeTab==='likes' ? 'bg-primary text-white' : 'bg-white border']">Likes</button>
                            </div>
                        </div>

                        <hr class="mt-2 mb-6">

                        <div class="post-list">
                        <template v-if="activeTab === 'posts'">
                            <template v-if="loadingPosts"> <p>Cargando publicaciones...</p> </template>
                            <template v-else-if="posts.length === 0">
                                <p>sin Publicaciones :(</p>
                            </template>
                            <template v-else>
                                <Post v-for="post in posts" :key="post.id" :post="post" @post-deleted="handlePostDeleted" />
                            </template>
                        </template>

                        <template v-if="activeTab === 'replies'">
                            <template v-if="loadingReplies"> <p>Cargando respuestas...</p> </template>
                            <template v-else-if="replies.length === 0">
                                <p>sin Respuestas :(</p>
                            </template>
                            <template v-else>
                                <Reply v-for="r in replies" :key="r.id" :reply="r" @reply-deleted="handleReplyDeleted" />
                            </template>
                        </template>                            <template v-if="activeTab === 'likes'">
                                <template v-if="loadingLikes"> <p>Cargando likes...</p> </template>
                                <template v-else-if="likedPosts.length === 0">
                                    <p>No hay likes todavía.</p>
                                </template>
                                <template v-else>
                                    <Post v-for="lp in likedPosts" :key="lp.id" :post="lp" />
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Post from '../components/Posts/Post.vue'
    import Reply from '../components/Posts/Reply.vue'
    import { fetchUserPost, fetchUserReplies, fetchUserLikes } from '../services/posts'
    import { fetchPostReplies } from '../services/replies'
    import { ref, watch } from 'vue';
    import { useAuthUserState } from '../composables/useAuthUserState';
    import { getFileURL } from '../services/storage';

    const posts = ref([]);
    const replies = ref([]);
    const likedPosts = ref([]);
    const activeTab = ref('posts');
    const loadingPosts = ref(true);
    const loadingReplies = ref(true);
    const loadingLikes = ref(true);
    const { user } = useAuthUserState();

    const loadUserPosts = async (id) => {
        loadingPosts.value = true;
        try {
            posts.value = await fetchUserPost(id);
            try {
                await Promise.all(posts.value.map(async (p) => {
                    try {
                        const r = await fetchPostReplies(p.id);
                        p.replies_count = Array.isArray(r) ? r.length : 0;
                    } catch {
                        p.replies_count = 0;
                    }
                }));
            } catch (e) {
                console.error('[Profile.vue] Error inicializando replies_count:', e);
            }
        } catch (e) {
            posts.value = [];
        } finally {
            loadingPosts.value = false;
        }
    };

    const loadUserReplies = async (id) => {
        loadingReplies.value = true;
        try {
            replies.value = await fetchUserReplies(id);
            try {
                await Promise.all(replies.value.map(async (r) => {
                    try {
                        const nested = await fetchPostReplies(r.id);
                        r.replies_count = Array.isArray(nested) ? nested.length : 0;
                    } catch {
                        r.replies_count = 0;
                    }
                }));
            } catch (e) {
                console.error('[Profile.vue] Error inicializando replies_count en replies:', e);
            }
        } catch (e) {
            replies.value = [];
        } finally {
            loadingReplies.value = false;
        }
    };

    const loadUserLikes = async (id) => {
        loadingLikes.value = true;
        try {
            likedPosts.value = await fetchUserLikes(id);
            likedPosts.value.forEach(p => { if (typeof p.replies_count !== 'number') p.replies_count = p.replies_count || 0 });
        } catch (e) {
            likedPosts.value = [];
        } finally {
            loadingLikes.value = false;
        }
    };

    watch(() => user.value?.id,
        async (id) => {
            if (!id) return;
            await Promise.all([
                loadUserPosts(id),
                loadUserReplies(id),
                loadUserLikes(id)
            ]);
        },
        { immediate: true }
    )

    const handlePostDeleted = (postId) => {
        const index = posts.value.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts.value.splice(index, 1);
        }
    };

    const handleReplyDeleted = (replyId) => {
        const index = replies.value.findIndex(r => r.id === replyId);
        if (index !== -1) {
            replies.value.splice(index, 1);
        }
    };
</script>