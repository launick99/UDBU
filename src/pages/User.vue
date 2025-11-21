<template>
    <div class="usuario-perfil container mx-auto py-8">
        <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 sm:col-span-3">
                <div class="bg-white shadow rounded-lg p-6">
                    <div v-if="loading" class="flex w-full justify-center">
                        <div class="loader"></div>
                    </div>
                    <template v-else>
                        <div class="flex flex-col items-center">
                            <div class="mb-4">
                                <img 
                                    :src="getFileURL(user.avatar_url)" 
                                    alt="Vista previa de la imagen"
                                    class="w-32 h-32 object-cover rounded-full border border-gray-300"
                                >
                            </div>
                            <h2 class="text-xl font-bold">{{ user.display_name || 'Usuario' }}</h2>
                            <p class="text-blue-900 hover:text-blue-950">
                                <a :href="`mailto:${user.email}`">{{ user.email }}</a>
                            </p>
                        </div>
    
                        <hr class="my-6 border-t border-gray-300">
    
                        <div class="flex flex-col">
                            {{ user.bio || "Este usuario no ha escrito una biografía." }}
                        </div>
                    </template>
                </div>
            </div>
            <div class="col-span-4 sm:col-span-9">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-4">Publicaciones de Usuario</h3>
                    <hr class="mt-2 mb-6">
                    <div v-if="loading" class="flex w-full justify-center">
                        <div class="loader"></div>
                    </div>
                    <div v-else class="post-list">
                        <template v-if="posts.length === 0">
                            <p>No hay publicaciones de este usuario.</p>
                        </template>
                        <template v-else>
                            <Post
                                v-for="post in posts"
                                :key="post.id"
                                :post="post"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    import Post from '../components/Posts/Post.vue'
    import { fetchUserPost } from '../services/posts'
    import useUserProfile from '../composables/useUserProfile'
    import { ref, watch } from 'vue';
import { getFileURL } from '../services/storage';

    const posts = ref([]);
    const route = useRoute();
    const {user, loading} = useUserProfile(route.params.id);

    watch(() => route.params.id,
        async (id) => {
            if(!id){
                return
            }
            try {
                posts.value = await fetchUserPost(id);
            } catch {
                posts.value = [];
            }
        },
        { immediate: true }
    )

</script>
