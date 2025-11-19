<template>
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row">
        <SideNavbarLeft class="p-4"></SideNavbarLeft>
        <div class="flex-1 p-4">
            <div class="mx-auto px-4 w-full">
                <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                    <!-- form para crear nuevo post -->
                    <div class="flex items-center mb-3">
                        <img src="" :alt="user.display_name" class="h-10 w-10 rounded-full object-cover border border-gray-200 mr-3">
                        <textarea class="form-textarea" placeholder="¿Qué estás pensando?" type="text" v-model="newPost.content"></textarea>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between">
                        <div class="flex space-x-2 mb-2 sm:mb-0">
                            <button type="button" class="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors">
                                <i class="fa-solid fa-camera fa-lg mr-3"></i>
                                <span class="hidden sm:inline">Foto</span>
                            </button>
                            <button type="button" class="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg px-3 py-1.5 transition-colors">
                                <i class="fa-solid fa-hashtag fa-lg mr-3"></i>
                                <span class="hidden sm:inline">Tag</span>
                            </button>
                        </div>
                        <button type="submit" class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors bg-gray-200 text-gray-400 cursor-not-allowed" disabled="">Post</button>
                    </div>
                </form>
                <div class="max-w-7xl flex flex-row justify-content-between container mx-auto">
                    <!-- lista de posts -->
                    <div class="w-full post-list space-y-4 mb-4">
                        <div v-if="posts.length === 0" class="flex justify-center w-full">
                            <div class="loader"></div>
                        </div>
                        <Post v-for="post in posts" :key="post.id" :post="post" />
                    </div>
                </div>
            </div>
        </div>
        <SideNavbarRight class="p-4"></SideNavbarRight>
    </div>
</template>


<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { fetchGlobalPost, postGlobalnNewPost, subscribeToGlobalPostNewPosts } from '../services/posts';
    import SideNavbarLeft from '../components/Navegation/SideNavbarLeft.vue';
    import SideNavbarRight from '../components/Navegation/SideNavbarRight.vue';
    import Post from '../components/Posts/Post.vue';
    import { useAuthUserState } from '../composables/useAuthUserState';

    const {user} = useAuthUserState();

    const posts = ref([]);
    const newPost = ref({
        content: null,
    });

    let unsubscribeFromPost = () => { };

    const handleSubmit = async () => {
        try {
            await postGlobalnNewPost({ sender_id: user.value.id, content: newPost.value.content });
        } catch (error) {
            console.error(error);
        }
        newPost.value.content = null;
    };

    onMounted(async () => {
        posts.value = await fetchGlobalPost();
        unsubscribeFromPost = subscribeToGlobalPostNewPosts(newPostData => posts.value.unshift(newPostData));
    });

    onUnmounted(() => {
        unsubscribeFromPost();
    });
</script>
