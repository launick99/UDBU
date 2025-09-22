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
import supabase from '../services/supabase';

export default {
    name: "Posts",
    data() {
        return {
            newPost: "",
            posts: [],
        };
    },
    methods: {
        async addPost() {
            const trimmed = this.newPost.trim();
            if (trimmed !== "") {
                const { data, error } = await supabase
                    .from('publicaciones')
                    .insert([{ content: trimmed }]);
                
                if (error) {
                    console.error("Error al publicar:", error);
                    return;
                }
                this.newPost = "";

                this.posts.push({ content: trimmed });
            }
        },
        async fetchPosts() {
            const { data, error } = await supabase
                .from('publicaciones')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error al obtener publicaciones:", error);
                return;
            }
            this.posts = data;
        },
    },
    mounted() {
        this.fetchPosts();
    },
};
</script>
