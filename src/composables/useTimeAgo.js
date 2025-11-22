/**
 * Formatea el tiempo
 *
 * @param {String|Date} date
 * @returns {String}
 */
export function timeAgo(date) {
    if (!date){
        return '';
    }
    const ahora = new Date();
    const fechaPost = new Date(date);
    const dif = (ahora - fechaPost) / 1000;

    if (dif < 30) {
        return 'justo ahora';
    }
    else if (dif < 60) {
        const segundos = Math.floor(dif);
        return `hace ${segundos} segundo${segundos !== 1 ? 's' : ''}`;
    }
    else if (dif < 3600) {
        const minutos = Math.floor(dif / 60);
        return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }
    else if (dif < 86400) {
        const horas = Math.floor(dif / 3600);
        return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    }
    else {
        const dias = Math.floor(dif / 86400);
        if (dias < 30) {
            return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
        }
        return fechaPost.toLocaleDateString() + ' ' + fechaPost.toLocaleTimeString();
    }
}
