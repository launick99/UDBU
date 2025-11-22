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
 * Solo trae posts principales (sin parent_post_id).
 * Incluye la información del usuario y sus archivos de media asociados.
 * Excluye posts eliminados (soft delete).
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
        .is('parent_post_id', null)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
    
    if (error) {
        // console.error('Error al obtener publicaciones:', error.message);
        throw new Error(`Error al obtener publicaciones: ${error.message}`);
    }

    return data;
}

/**
 * Trae todas las publicaciones de un usuario (solo posts principales).
 * Excluye posts eliminados (soft delete).
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
        .is('parent_post_id', null)
        .eq('is_deleted', false)
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
        console.error('[posts.js fetchPost] Error al obtener el post:', error.message);
        throw new Error(`[posts.js fetchPost] Error al obtener el post: ${error.message}`);
    }

    return data;
}

/**
 * Sistema de likes
 * @param {number} postId 
 * @param {string} userId
 */
export async function likePost(postId, userId) {
    const payload = { post_id: postId, user_id: userId };

    const { data, error } = await supabase
        .from('likes')
        .insert(payload)
        .select();

    if (error) {
        throw new Error(`[posts.js likePost] Error al dar like: ${error.message}`);
    }

    return data;
}

/**
 * 
 * Deslikea un post
 * 
 * @param {number} postId 
 * @param {string} userId 
 * @returns 
 */
export async function unlikePost(postId, userId) {
    const { data, error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .select();

    if (error) {
        throw new Error(`[posts.js unlikePost] Error al quitar like: ${error.message}`);
    }

    return data;
}

/**
 * 
 * Obtiene los likes de un post
 * 
 * @param {number} postId 
 * @returns 
 */
export async function getPostLikes(postId) {
    const { data, error, count } = await supabase
        .from('likes')
        .select('id', { count: 'exact' })
        .eq('post_id', postId);

    if (error) {
        console.error('[posts.js getPostLikes] Error al likes de un post:', error.message);
        return Array.isArray(data) ? data.length : 0;
    }

    if (typeof count === 'number') return count;
    return Array.isArray(data) ? data.length : 0;
}

/**
 * 
 * Obtiene los likes de un post por un usuario específico
 * 
 * @param {number} postId 
 * @param {string} userId 
 * @returns 
 */
export async function userLikedPost(postId, userId) {
    const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .limit(1);

    if (error) {
        console.error('[posts.js userLikedPost] Error al checkear likes:', error.message);
        return false;
    }

    return Array.isArray(data) && data.length > 0;
}


/**
 * Trae las respuestas por un usuario
 * Excluye respuestas eliminadas
 * 
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
export async function fetchUserReplies(userId) {
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
        .eq('sender_id', userId)
        .not('parent_post_id', 'is', null)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`[posts.js fetchUserReplies] Error al obtener respuestas del usuario: ${error.message}`);
    }

    return data;
}

/**
 * Trae los posts que un usuario ha marcado con like.
 * @param {string} userId
 * @returns {array}
 */
export async function fetchUserLikes(userId) {
    const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);

    if (likesError) {
        throw new Error(`[posts.js fetchUserLikes] Error al obtener likes del usuario: ${likesError.message}`);
    }

    if (!Array.isArray(likesData) || likesData.length === 0) return [];

    try {
        const posts = await Promise.all(likesData.map(async (l) => {
            return await fetchPost(l.post_id);
        }));
        return posts.filter(Boolean);
    } catch (e) {
        console.error('[posts.js fetchUserLikes] Error al obtener likes del usuario:', e);
        return [];
    }
}

/**
 * Actualiza el contenido de un post
 * @param {string} postId - ID del post a actualizar
 * @param {string} content - Nuevo contenido del post
 * @returns {Promise<Object>} - Post actualizado
 * @throws {Error}
 */
export async function updatePost(postId, content) {
    const { data, error } = await supabase
        .from('posts')
        .update({ content: content })
        .eq('id', postId)
        .select();

    if (error) {
        throw new Error(`[posts.js updatePost] Error al actualizar post: ${error.message}`);
    }

    return data && data.length > 0 ? data[0] : null;
}

/**
 * Eliminación lógica de un post
 * Marca el post como eliminado sin eliminar los registros de la BD
 * @param {string} postId - ID del post a eliminar
 * @returns {Promise<Object>} - Post marcado como eliminado
 * @throws {Error}
 */
export async function deletePost(postId) {
    const { data, error } = await supabase
        .from('posts')
        .update({ is_deleted: true })
        .eq('id', postId)
        .select();

    if (error) {
        throw new Error(`[posts.js deletePost] Error al eliminar post: ${error.message}`);
    }

    return data && data.length > 0 ? data[0] : null;
}