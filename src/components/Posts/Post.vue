<template>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden transition-all duration-300 hover:shadow-md w-full">
        <div class="p-4">
            <div class="flex items-start justify-between">
                <div class="text-sm font-semibold text-gray-900">
                    <RouterLink :to="`/usuario/${post.sender_id}`" class="flex items-center">
                        <img src="" :alt="post.user_profile?.display_name" class="h-10 w-10 rounded-full object-cover border border-gray-200">
                        <div class="ml-3">
                            {{ post.user_profile?.display_name || post.user_profile?.email || post.sender_id }}
                            <div class="text-xs text-gray-500">{{ timeAgo(post.created_at) }}</div>
                        </div>
                    </RouterLink>
                </div>
                <button class="text-gray-400 hover:text-gray-500">
                    <i class="fa-solid fa-ellipsis fa-xl"></i>
                </button>
            </div>
            <!-- contenido del post -->
            <div class="mt-3">
                <p class="text-gray-800 text-sm">
                    {{ post.content }}
                </p>
            </div>
            <!-- Galeria -->
            <div class="mt-3 -mx-4" v-if="hasMedia">
                <img src="" alt="Post" class="w-full h-auto max-h-[500px] object-cover">
            </div>
            <!-- Cantida de likes, comentarios -->
            <div class="mt-3 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>24 Me Gusta</span><span>2 Comentarios</span>
            </div>
            <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                <button class="flex items-center justify-center w-1/3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-heart text-gray-500 fa-xl w-8 mr-3"></i>
                    <span>Me Gusta</span>
                </button>
                <button class="flex items-center justify-center w-1/3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-comment text-gray-500 fa-xl w-8 mr-3"></i>
                    <span>Comentar</span>
                </button>
                <button class="flex items-center justify-center w-1/3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-500 hover:bg-gray-50">
                    <i class="fa-regular fa-share-from-square text-gray-500 fa-xl w-8 mr-3"></i>
                    <span>Compartir</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Post",
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
        // funcion para decir hace cuanto se publico
        timeAgo(date) {
            const ahora = new Date();
            const fechaPost = new Date(date);
            const dif = (ahora - fechaPost) / 1000; //saco segundos de diferencia

            if (dif < 30) { //menos de 30 segundos es justo ahora
                return 'justo ahora';
            }
            else if (dif < 60) {
                const segundos = Math.floor(dif);
                return `hace ${segundos} segundo${segundos !== 1 ? 's' : ''}`;
                //si es mayor a 1, agrego una s, para que diga segundos o segundo, hago lo mismo en los otros
            }
            else if (dif < 3600) {
                const minutos = Math.floor(dif / 60);
                return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
            }
            else if (dif < 86400) { // google
                const horas = Math.floor(dif / 3600);
                return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
            }
            else {
                const dias = Math.floor(dif / 86400); //tambien google
                //si es mas de no se cuantos dias, pongo la fecha
                if (dias < 30) {
                    return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
                }
                return fechaPost.toLocaleDateString() + ' ' + fechaPost.toLocaleTimeString();
            }
        }
    },
    computed:{
        hasMedia(){
            return false;
        }
    }
}
</script>