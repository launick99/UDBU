import supabase from './supabase';

/**
 * Inserta una nueva publicación en la tabla `posts`.
 *
 * @param {{sender_id: String, content: String}} data 
 * @throws {Error}
 */
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

/**
 * Trae todas las publicaciones globales, ordenadas por fecha (como twitter).
 *
 * @returns {Promise<Array>}
 * @throws {Error}
 */
export async function fetchGlobalPost() {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user_profile:sender_id (
                id,
                display_name,
                email
            )
        `)
        .order('created_at', { ascending: false });
    
    if (error) {
        // console.error('Error al obtener publicaciones:', error.message);
        throw new Error(`Error al obtener publicaciones: ${error.message}`);
    }

    return data;
}

/**
 * Trae todas las publicaciones de un usuario.
 *
 * @param {string} id
 * @returns {Promise<Array<Object>>} - Lista de publicaciones del usuario.
 * @throws {Error}
 */
export async function fetchUserPost(id) {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user_profile:sender_id (
                id,
                display_name,
                email
            )
        `)
        .eq('sender_id', id)
        .order('created_at', { ascending: false });
    
    if (error) {
        // console.error('Error al obtener publicaciones:', error.message);
        throw new Error(`Error al obtener publicaciones: ${error.message}`);
    }

    return data;
}

/**
 * Suscribe al canal de publicaciones nuevas
 *
 * @param {(newPost: Object) => void} callback
 * @returns {() => void} - Retorna una función que al ejecutarla cancela la suscripción.
 */
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