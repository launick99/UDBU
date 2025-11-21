import supabase from './supabase';

/**
 * Inserta una nueva publicación en la tabla `posts`.
 *
 * @param {{sender_id: String, content: String}} data 
 * @throws {Error}
 */
/**
 * Crea una nueva publicación.
 * @param {{sender_id: String, content: String}} param0
 * @returns {Promise<Array>} - Array con el registro insertado (use data[0] para obtener el post)
 * @throws {Error}
 */
export async function postGlobalnNewPost({sender_id, content}) {
    const payload = {
        sender_id: sender_id,
        content: content
    };

    const { data, error } = await supabase
        .from('posts')
        .insert(payload)
        .select();  // Retorna el registro insertado

    if (error) {
        // console.error('Error al crear publicación:', error.message);
        throw new Error(`Error al crear publicación: ${error.message}`);
    }
    return data;
}

/**
 * Trae todas las publicaciones globales, ordenadas por fecha (como twitter).
 * Incluye la información del usuario y sus archivos de media asociados.
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
                email,
                avatar_url
            ),
            post_media (
                id,
                media,
                created_at,
                updated_at
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
                email,
                avatar_url
            ),
            post_media (
                id,
                media,
                created_at,
                updated_at
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

/**
 * Obtiene un post específico con todas sus relaciones (user_profile y post_media)
 * Útil para enriquecer posts que vienen sin relaciones (ej: del tiempo real)
 *
 * @param {String} postId - ID del post
 * @returns {Promise<Object>} - Post con relaciones
 * @throws {Error}
 */
export async function fetchPost(postId) {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user_profile:sender_id (
                id,
                display_name,
                email,
                avatar_url
            ),
            post_media (
                id,
                media,
                created_at,
                updated_at
            )
        `)
        .eq('id', postId)
        .single();
    
    if (error) {
        console.error('Error fetching post with relations:', error.message);
        throw new Error(`Error fetching post: ${error.message}`);
    }

    return data;
}