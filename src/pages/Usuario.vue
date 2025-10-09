<template>
    <div class="usuario-perfil container mx-auto py-8">
        <!-- tome prestado el template y le hice algunas modificaciones -->
        <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 sm:col-span-3">
                <div class="bg-white shadow rounded-lg p-6">
                    <div class="flex flex-col items-center">
                        <h2 class="text-xl font-bold">{{ profile_user.display_name || 'Usuario' }}</h2>
                        <p class="text-gray-700">{{ profile_user.email }}</p>
                    </div>

                    <hr class="my-6 border-t border-gray-300">

                    <div class="flex flex-col">
                        {{ profile_user.bio || "Este usuario no ha escrito una biografía." }}
                    </div>
                </div>
            </div>
            <div class="col-span-4 sm:col-span-9">
                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-xl font-bold mb-4">Publicaciones de Usuario</h3>
                    <hr class="mt-2 mb-6">

                    <div class="post-list">
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

<script>
    import Post from '../components/Post.vue'
    import { getUserProfileById } from '../services/user-profile'
    import { fetchUserPost } from '../services/posts'

    export default {
        name: "Usuario",
        components: { Post },
        data() {
            return {
                user_id: null,
                profile_user: {
                    id: null,
                    display_name: null,
                    email: null,
                    bio: null
                },
                posts: []
            }
        },
        watch: {
            '$route.params.id': {
                immediate: true,
                handler(newId) {
                    this.user_id = newId
                    this.loadUserData()
                }
            }
        },
        methods: {
            async loadUserData() {
                if (!this.user_id) {
                    this.profile_user = { id: null, display_name: null, email: null, bio: null }
                    this.posts = []
                    return
                }

                try {
                    this.profile_user = await getUserProfileById(this.user_id)
                } catch (error) {
                    // console.error('Error al cargar perfil del usuario:', error)
                    this.profile_user = { id: null, display_name: null, email: null, bio: null }
                }

                try {
                    this.posts = await fetchUserPost(this.user_id)
                } catch (error) {
                    // console.error('Error al cargar publicaciones del usuario:', error)
                    this.posts = []
                }
            }
        }
    }
</script>
