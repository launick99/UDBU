<template>
    <div class="post p-4 border-b border-gray-200">
        <RouterLink :to="`/usuario/${post.sender_id}`" class="text-sm font-semibold text-gray-900">
            {{ post.sender_id }}
        </RouterLink>
        <p class="text-xs text-gray-500">{{ timeAgo(post.created_at) }}</p>
        <div class="mt-3">
            <p class="text-gray-800 text-sm">
                {{ post.content }}
            </p>
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
                const now = new Date();
                const postDate = new Date(date);
                const dif = (now - postDate) / 1000; //saco segundos de diferencia

                if (dif < 30) { //menos de 30 segundos es justo ahora
                    return 'justo ahora';
                }
                else if (dif < 60) {
                    const segundos = Math.floor(dif);
                    return `hace ${segundos} segundo${segundos != 1 ? 's' : ''}`;
                    //si es mayor a 1, agrego una s, para que diga segundos o segundo, hgao lo mismo en los otros
                }
                else if (dif < 3600) {
                    const mins = Math.floor(dif / 60);
                    return `hace ${mins} minuto${mins != 1 ? 's' : ''}`;
                }
                else if (dif < 86400) { // google
                    const hrs = Math.floor(dif / 3600);
                    return `hace ${hrs} hora${hrs != 1 ? 's' : ''}`;
                }
                else if(dif / 86400){
                    const days = Math.floor(dif / 86400); //tambien google
                    return `hace ${days} día${days != 1 ? 's' : ''}`;
                }
                //si es mas de no se cuantos dias, pongo la fecha
                return past.toLocaleDateString() + ' ' + past.toLocaleTimeString();
            }
        }
    }
</script>