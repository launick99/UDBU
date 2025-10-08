import supabase from './supabase';
import { createUserProfile, getUserProfileById, updateUserProfile } from './user-profile';

/**
 * Objeto que representa al usuario autenticado.
 * Inicialmente está vacío hasta que el usuario inicia sesión o se registra.
 */
let user = {
    id: null,
    email: null,
    display_name: null,
    bio: null
}

/**
 * Lista de observadores (callbacks) que serán notificados cuando cambie el estado del usuario.
 */
let observers = [];

//Cargar datos de localStorage
if(localStorage.getItem('user')){
    user = JSON.parse(localStorage.getItem('user'));
}

// Cargar el usuario actual al iniciar el servicio
loadCurrentUser();

/**
 * Obtiene el usuario autenticado actual desde Supabase.
 * Si hay un usuario autenticado, actualiza el objeto 'user' con su información.
 * Finalmente, notifica a todos los observadores registrados sobre el estado actual del usuario (si hay)
 */
async function loadCurrentUser() {
    const {data, error} = await supabase.auth.getUser();
    if (error) {
        // console.error('Get current user error:', error.message);
        return;
    }

    setUser({
        id: data.user.id,
        email: data.user.email
    });
    loadUserFullProfile();
}

async function loadUserFullProfile(){
    setUser( await getUserProfileById(user.id) );
}

/**
 * Registra un nuevo usuario en Supabase usando email y contraseña.
 * Lanza un error si ocurre algún problema durante el registro.
 * @param {string} email - Email del usuario a registrar.
 * @param {string} password - Contraseña del usuario.
 */
export async function register(email, password) {
    try {
        const {data, error} = await supabase.auth.signUp({email, password});
        if (error) {
            // console.error('Registration error:', error.message);
            throw new Error( error.message);
        }

        
        //crear el perfil
        await createUserProfile({ id: data.user.id, email: data.user.email });

        setUser({
            id: data.user.id,
            email: data.user.email
        });
        // console.log('usuario registrado exitosamente:', data);
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Inicia sesión de un usuario usando email y contraseña.
 * Lanza un error si las credenciales son incorrectas o hay un problema.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @return {void}
 */
export async function login(email, password) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if (error) {
        // console.error('Login error:', error.message);
        throw new Error( error.message );
    }   
    setUser({
        id: data.user.id,
        email: data.user.email
    });
    loadUserFullProfile();
}

/**
 * Cierra la sesión del usuario actual.
 * Lanza un error si ocurre algún problema durante el cierre de sesión.
 */
export async function logout() {
    const {data,error} = await supabase.auth.signOut();
    if (error) {
        // console.error('Logout error:', error.message);
        throw new Error( error.message );
    }
    setUser({id: null, email: null});
}

/**
 * 
 * @param {{display_name?: String|null, bio?: String|null}} data 
 */

export async function updateAuthUser(data){
    try {
        await updateUserProfile(user.id, data);
        setUser({
            display_name: data.display_name ?? user.display_name,
            bio: data.bio ?? user.bio
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

/* ---- Observer ---- */

/**
 * Suscribe un callback para ser notificado cuando cambie el estado del usuario.
 * El callback se ejecuta inmediatamente con el estado actual.
 * @param {(userState: {id: String|null, email: String|null}) => void} callback - Función a ejecutar cuando cambie el usuario.
 * @returns { {} => void } - Función para desuscribir el callback.
 */
export function subscribeToAuthStateChanges(callback) {
    observers.push(callback);
    notify(callback);

    return () => { 
        observers = observers.filter(obs => obs !== callback); 
    };
}

/**
 * Notifica a un callback específico con el estado actual del usuario.
 * @param {(userState: {id: String|null, email: String|null}) => void} callback - Callback a notificar.
 */
function notify(callback) {
    callback({...user}); 
}

/**
 * Notifica a todos los observadores registrados con el estado actual del usuario.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/** 
 * Setea el usuario
 */
function setUser(data){
    user = { ...user, ...data };
    if(user.id){
        localStorage.setItem('user', JSON.stringify(user));
    }else{
        localStorage.removeItem('user');
    }
    notifyAll();
}