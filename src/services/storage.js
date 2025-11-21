import supabase from "./supabase";

/**
 * 
 * Sube un archivo al almacenamiento de Supabase
 * 
 * @param {string} name 
 * @param {File} file 
 * @returns 
 */
export async function uploadFile(name, file, bucket = 'avatars'){
    const {data, error} = await supabase
        .storage
        .from(bucket)
        .upload(name, file, {upsert: true});

    if(error){
        console.error("Error subiendo el archivo:", error);
        throw new Error(error.message);
    };
    return data;
}

/**
 * 
 * @param {string} name 
 * @param {string} bucket 
 */
export async function deleteFile(name, bucket = 'avatars'){
    const {data, error} = await supabase
        .storage
        .from(bucket)
        .remove(name);
    if(error){
        console.error("[Storage.js deleteFile] Error eliminando el archivo:", error);
        throw new Error(error.message);
    }
}

export function getFileURL(name, bucket = 'avatars'){
    if(!name){
        return '../../public/img/avatar_not_found.png';
    }
    
    return supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl || '../../public/img/avatar_not_found.png';
}