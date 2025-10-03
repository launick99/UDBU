import supabase from './supabase';

/**
 * Objeto que representa al usuario autenticado.
 * Inicialmente está vacío hasta que el usuario inicia sesión o se registra.
 */
let user = {
    id: null,
    email: null,
}

/**
 * Lista de observadores (callbacks) que serán notificados cuando cambie el estado del usuario.
 */
let observers = [];

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
    setUser(data);
}

/**
 * Registra un nuevo usuario en Supabase usando email y contraseña.
 * Lanza un error si ocurre algún problema durante el registro.
 * @param {string} email - Email del usuario a registrar.
 * @param {string} password - Contraseña del usuario.
 */
export async function register(email, password) {
    const {data, error} = await supabase.auth.signUp({email, password});
    if (error) {
        // console.error('Registration error:', error.message);
        throw new Error( error.message);
    }
    setUser(data);
    // console.log('usuario registrado exitosamente:', data);
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
    setUser(data);
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

/* ---- Observer ---- */

/**
 * Suscribe un callback para ser notificado cuando cambie el estado del usuario.
 * El callback se ejecuta inmediatamente con el estado actual.
 * @param {(userState: {id: String|null, email: String|null}) => void} callback - Función a ejecutar cuando cambie el usuario.
 */
export async function subscribeToAuthStateChanges(callback) {
    observers.push(callback);
    notify(callback);
}

/**
 * Notifica a un callback específico con el estado actual del usuario.
 * @param {(userState: {id: String|null, email: String|null}) => void} callback - Callback a notificar.
 */
function notify(callback) {
    callback(...user); 
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
    notifyAll();
}