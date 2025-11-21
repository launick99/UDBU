import supabase from './supabase';

/**
 * Inserta un registro de media en la tabla post_media
 * @param {String} postId - ID del post
 * @param {String} mediaFilename - Nombre del archivo en storage (ej: "user-123/timestamp.jpg")
 * @returns {Promise<Object>} - El registro insertado
 * @throws {Error}
 */
export async function createPostMedia(postId, mediaFilename) {
    const { data, error } = await supabase
        .from('post_media')
        .insert({
            post_id: postId,
            media: mediaFilename
        });

    if (error) {
        console.error('Error creating post media:', error.message);
        throw new Error(`Error creating post media: ${error.message}`);
    }

    return data;
}

/**
 * Obtiene todos los archivos de media de un post
 * @param {String} postId - ID del post
 * @returns {Promise<Array>} - Lista de media asociada al post
 * @throws {Error}
 */
export async function getPostMedia(postId) {
    const { data, error } = await supabase
        .from('post_media')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching post media:', error.message);
        throw new Error(`Error fetching post media: ${error.message}`);
    }

    return data;
}

/**
 * Elimina un registro de media
 * @param {String} mediaId - ID del registro de media
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function deletePostMedia(mediaId) {
    const { error } = await supabase
        .from('post_media')
        .delete()
        .eq('id', mediaId);

    if (error) {
        console.error('Error deleting post media:', error.message);
        throw new Error(`Error deleting post media: ${error.message}`);
    }
}

/**
 * Suscribe a cambios en la media de un post (tiempo real)
 * @param {String} postId - ID del post
 * @param {Function} callback - Función a ejecutar cuando cambien los datos
 * @returns {Function} - Función para desuscribirse
 */
export function subscribeToPostMedia(postId, callback) {
    let channel = supabase.channel(`post-media-${postId}`);

    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'post_media',
            filter: `post_id=eq.${postId}`
        },
        (payload) => {
            callback(payload);
        }
    );

    channel.subscribe();

    return () => {
        channel.unsubscribe();
    };
}
