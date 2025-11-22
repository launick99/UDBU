import supabase from './supabase';

/**
 * Crea una nueva respuesta a un post.
 * @param {{sender_id: String, content: String, parent_post_id: String}} param0
 * @returns {Promise<Array>} - Array con el registro insertado
 * @throws {Error}
 */
export async function createReply({sender_id, content, parent_post_id}) {
    const payload = {
        sender_id: sender_id,
        content: content,
        parent_post_id: parent_post_id
    };

    const { data, error } = await supabase
        .from('posts')
        .insert(payload)
        .select();

    if (error) {
        throw new Error(`Error al crear respuesta: ${error.message}`);
    }
    return data;
}

/**
 * Trae todas las respuestas de un post específico.
 * Incluye la información del usuario y sus archivos de media asociados.
 *
 * @param {string} parentPostId - ID del post padre
 * @returns {Promise<Array>}
 * @throws {Error}
 */
export async function fetchPostReplies(parentPostId) {
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
        .eq('parent_post_id', parentPostId)
        .order('created_at', { ascending: false });
    
    if (error) {
        throw new Error(`Error al obtener respuestas: ${error.message}`);
    }

    return data;
}

/**
 * Suscribe a nuevas respuestas de un post específico
 *
 * @param {(newReply: Object) => void} callback
 * @returns {() => void} - Retorna una función que al ejecutarla cancela la suscripción.
 */
export function subscribeToPostReplies(parentPostId, callback) {
    let repliesChannel = supabase.channel(`post_replies_${parentPostId}`);

    repliesChannel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
            if (payload.new.parent_post_id === parentPostId) {
                callback(payload.new);
            }
        }
    );
    
    repliesChannel.subscribe();

    return () => {
        repliesChannel.unsubscribe();
    }
}

/**
 * Obtiene una respuesta específica con todas sus relaciones (user_profile y post_media)
 *
 * @param {String} replyId - ID de la respuesta
 * @returns {Promise<Object>} - Respuesta con relaciones
 * @throws {Error}
 */
export async function fetchReply(replyId) {
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
        .eq('id', replyId)
        .single();
    
    if (error) {
        console.error('Error fetching reply with relations:', error.message);
        throw new Error(`Error fetching reply: ${error.message}`);
    }

    return data;
}
