import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profile";

export default function useUserProfile(id){
    const user = ref({
        id: null,
        display_name: null,
        bio: null,
        email: null,
        avatar_url: null,
    });
    const loading = ref(false);

    onMounted( async () => {
        try {
            loading.value = true;
            user.value = await getUserProfileById(id);
        } catch (error) {
            //nada
        }
        loading.value = false;
    });

    return { user, loading };
}