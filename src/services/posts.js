import supabase from './supabase';

export async function postGlobalnNewPost({sender_id, content}) {
    const { data, error } = await supabase
        .from('posts')
        .insert({
            sender_id: sender_id,
            content: content
        });

    if (error) {
        // console.error('Error al crear publicación:', error.message);
        throw new Error(`Error al crear publicación: ${error.message}`);
    }
}

export async function fetchGlobalPost() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        // console.error('Error al obtener publicaciones:', error.message);
        throw new Error(`Error al obtener publicaciones: ${error.message}`);
    }

    return data;
}

export async function fetchUserPost(id) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('sender_id', id)
        .order('created_at', { ascending: false });
    
    if (error) {
        // console.error('Error al obtener publicaciones:', error.message);
        throw new Error(`Error al obtener publicaciones: ${error.message}`);
    }

    return data;
}

export function subscribeToGlobalPostNewPosts(callback){
    let postsChannel = supabase.channel('posts');

    postsChannel.on(
        'postgres_changes',
        //evento, esquema y tabla
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
            callback(payload.new);
        }
    );
    
    postsChannel.subscribe();

    return () => {
        postsChannel.unsubscribe();
    }
}