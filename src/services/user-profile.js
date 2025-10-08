import supabase from './supabase';

/**
 * 
 * @param {String} id
 * @returns {Promise<{ id:String, mail: String, display_name: String|null, bio: String|null  }>} - Perfil del usuario. 
 */
export async function getUserProfileById(id){
    const { data, error } = await supabase
        .from('user_profile')
        .select()
        .eq('id', id)
        .single();

    if(error){
        // console.error('Error al traer el id del usuario:', error.message);
        throw new Error(error.message);
    }    
    return data;
}

/**
 * Crea El Perfil del usuario.
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profile')
        .insert(data);
    if (error) {
        // console.error('Error al actualizar el perfil:', error.message);
        throw new Error(error.message);
    }
}

/**
 * Actualiza El Perfil del usuario.
 * 
 * @param {String} id 
 * @param {{display_name?: String|null, bio?: String|null}} data 
 */
export async function updateUserProfile(id, data) {    
    const { error } = await supabase
        .from('user_profile')
        .update(data)
        .eq('id', id);
    if (error) {
        // console.error('Error al actualizar el perfil:', error.message);
        throw new Error(error.message);
    }
}