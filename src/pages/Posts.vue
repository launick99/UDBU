<template>
    <div class="container mx-auto">
        <h2 class="text-xl font-bold mb-4">Publicaciones</h2>
        <div class="posts">
            <div v-for="(post, index) in posts" :key="index" class="bg-green-100 p-4 my-2 rounded shadow">
                {{ post.content }}
            </div>
        </div>

        <form @submit.prevent="addPost" class="mt-4 flex gap-2">
            <input v-model="newPost" type="text" placeholder="Escribe una publicación..." class="flex-grow p-2 border rounded" />
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Publicar
            </button>
        </form>
    </div>
</template>

<script>
    import { createPost, fetchAllPosts } from '../services/posts';
    import { subscribeToAuthStateChanges } from '../services/auth';

    export default {
        name: "Posts",
        data() {
            return {
                newPost: "",
                posts: [],
                currentUser: null,
            };
        },
        methods: {
            async addPost() {
                try {
                    if (!this.currentUser?.id) {
                        throw new Error("Debes iniciar sesión para publicar.");
                    }

                    const newPub = await createPost(this.newPost, this.currentUser.id);
                    this.posts.unshift(newPub); // Añadir al principio
                    this.newPost = "";
                } catch (error) {
                    console.error(error.message);
                }
            },
            async fetchPosts() {
                try {
                    this.posts = await fetchAllPosts();
                } catch (error) {
                    console.error(error.message);
                }
            },
        },
        mounted() {
            this.fetchPosts();
            subscribeToAuthStateChanges((user) => {
                this.currentUser = user;
            });
        },
    };
</script>
