<template>
    <div class="container mx-auto py-8">
        <!-- form para crear nuevo post -->
        <form @submit.prevent="handleSubmit" class="post-form">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div class="flex items-center">
                    <textarea 
                        class="form-textarea" 
                        placeholder="¿Qué estás pensando?"
                        type="text" 
                        v-model="newPost.content"
                    ></textarea>
                </div>
                <hr class="border-gray-300 my-2">
                <button type="submit" class="text-white text-center bg-primary hover:bg-blue-600 p-2 w-full rounded-sm">Publicar</button>
            </div>
        </form>
        <!-- lista de posts -->
        <div class="post-list bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div v-if="posts.length === 0">
                <div class="loader"></div>
            </div>
            <Post
                v-for="post in posts"
                :key="post.id"
                :post="post"
            />
        </div>
    </div>
</template>


<script>
    import { fetchGlobalPost, postGlobalnNewPost, subscribeToGlobalPostNewPosts } from '../services/posts';
    import { subscribeToAuthStateChanges } from '../services/auth';
    import Post from '../components/Post.vue';

    let unsubscribeFromAuth = () => {};
    let unsubscribeFromPost = () => {};

    export default {
        name: "Posts",
        components: { Post },
        data() {
            return {
                posts: [],
                newPost: {
                    content: null,
                },

                user: {
                    id: null,
                    display_name: null,
                    bio: null,
                    email: null,
                }
            };
        },
        methods: {
            async handleSubmit(){
                try {
                    postGlobalnNewPost({sender_id: this.user.id, content: this.newPost.content});
                } catch (error) {
                    console.error(error);
                }
                this.newPost.content = null;
            },
        },
        async mounted() {
            this.posts = await fetchGlobalPost();
            unsubscribeFromPost = subscribeToGlobalPostNewPosts(newPost => this.posts.unshift(newPost));

            unsubscribeFromAuth = subscribeToAuthStateChanges( (userState) => {
                this.user = userState;
            });
        },
        unmounted(){
            unsubscribeFromAuth();
            unsubscribeFromPost();
        }
    };
</script>
