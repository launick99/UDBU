import supabase from './supabase';

/**
 * Inserta una nueva publicación en la base de datos.
 * 
 * @param {string} content - El contenido de la publicación.
 * @param {string} user_id - ID del usuario que crea la publicación.
 * @returns {Promise<Object>} - Retorna el objeto de publicación insertado.
 * @throws {Error}
 */
export async function createPost(content, user_id) {
    const trimmed = content.trim();

    if (trimmed === '') {
        throw new Error('El contenido no puede estar vacío.');
    }

    const { data, error } = await supabase
        .from('publicaciones')
        .insert([{ content: trimmed, user_id }])
        .select()
        .single();

    if (error) {
        throw new Error(`Error al crear publicación: ${error.message}`);
    }

    return data;
}

/**
 * Obtiene todas las publicaciones de la base de datos, ordenadas por fecha descendente.
 * 
 * @returns {Promise<Array>} - Lista de publicaciones.
 * @throws {Error}
 */
export async function fetchAllPosts() {
    const { data, error } = await supabase
        .from('publicaciones')
        .select(`
            id,
            content,
            created_at,
            user_id,
            users: user_id (
                id,
                email
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener publicaciones: ${error.message}`);
    }

    return data;
}

    /**
     * Obtiene todas las publicaciones de un usuario específico.
     * 
     * @param {string} userId - ID del usuario.
     * @returns {Promise<Array>} - Lista de publicaciones del usuario.
     * @throws {Error}
     */
export async function fetchPostsByUser(userId) {
    const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener publicaciones del usuario: ${error.message}`);
    }

    return data;
}