<template>
    <div class="mi-perfil">
        <!-- tome prestado el template y le hice algunas modificaciones -->
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div class="col-span-4 sm:col-span-3">
                    <div class="bg-white shadow rounded-lg p-6">
                        <div class="flex flex-col items-center">
                            <h2 class="text-xl font-bold">{{ user.display_name }}</h2>
                            <p class="text-gray-700">{{ user.email }}</p>
                            <div class="mt-6 flex flex-wrap gap-4 justify-center">
                                <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Editar</a>
                            </div>
                        </div>
                        <hr class="my-6 border-t border-gray-300">
                        <div class="flex flex-col">
                            {{ user.bio || "No biografia aun :(." }}
                        </div>
                    </div>
                </div>
                <div class="col-span-4 sm:col-span-9">
                    <div class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-xl font-bold mb-4">Publicaciones</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { subscribeToAuthStateChanges } from '../services/auth';

    export default {
        name: "Perfil",
        data(){
            return {
                user: {
                    id: null,
                    display_name: null,
                    email: null,
                    bio: null,
                }
            };
        },
        mounted(){
            subscribeToAuthStateChanges(async userState => this.user = userState);
        }
    };
</script>
