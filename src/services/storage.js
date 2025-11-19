import supabase from "./supabase";

/**
 * 
 * Sube un archivo al almacenamiento de Supabase
 * 
 * @param {string} name 
 * @param {File} file 
 * @returns 
 */
export async function uploadFile(name, file){
    const {data, error} = await supabase
        .storage
        .from('avatars')
        .upload(name, file);

    if(error){
        console.error("Error subiendo el archivo:", error);
        throw new Error(error.message);
        
    };
    return data;
}