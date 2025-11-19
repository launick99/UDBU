import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthStateChanges } from "../services/auth";

export function useAuthUserState() {
    let unsuscribeFromAuth = () => {};
    const user = ref({
        id: null,
        email: null,
        display_name: null,
        bio: null,
        // avatar_url: null,
    });

    onMounted(() => unsuscribeFromAuth = subscribeToAuthStateChanges( userstate => user.value = userstate ));
    onUnmounted(() => { unsuscribeFromAuth(); });

    return { user };
}