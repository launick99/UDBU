<template>
    <div class="mi-perfil">
        <!-- tome prestado el template y le hice algunas modificaciones -->
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div class="col-span-4 sm:col-span-3">
                    <div class="bg-white shadow rounded-lg p-6">
                        <div class="flex flex-col items-center">
                            <h2 class="text-xl font-bold">{{ user.display_name }}</h2>
                            <p class="text-blue-900 hover:text-blue-950">
                                <a :href="`mailto:${user.email}`">{{ user.email }}</a>
                            </p>
                            <div class="mt-6 flex flex-wrap gap-4 justify-center">
                                <RouterLink to="/perfil/editar" class="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded">
                                    Editar
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
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-4">Publicaciones</h3>
                        <hr class="mt-12 mb-6">
                        <div class="post-list">
                            <template v-if="posts.length === 0">
                                <p>sin Publicaciones :(</p>
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
    </div>
</template>

<script>
    import Post from '../components/Post.vue';
    import { subscribeToAuthStateChanges } from '../services/auth';
    import { fetchUserPost } from '../services/posts';

    let unsubscribe = () => {};
    export default {
        name: "Profile",
        components: { Post },
        data(){
            return {
                user_id: this.$route.params.id || null,
                user: {
                    id: null,
                    display_name: null,
                    email: null,
                    bio: null,
                },
                posts: []
            };
        },
        async mounted(){
            unsubscribe = subscribeToAuthStateChanges( async (userState) => {
                this.user = userState;
                this.posts = await fetchUserPost(this.user.id)
                // console.log(this.posts);
            });
        },
        unmounted(){
            unsubscribe();
            this.posts = [];
            this.user = {
                id: null,
                display_name: null,
                email: null,
                bio: null,
            };
        }
    };
</script>
