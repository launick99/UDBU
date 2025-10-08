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
 * 
 * @param {{id: String, email: String, display_name?: String|null, bio?: String|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profile')
        .insert(data);
    if (error) {
        throw new Error(error.message);
    }
}

export async function updateUserProfile(data) {

}