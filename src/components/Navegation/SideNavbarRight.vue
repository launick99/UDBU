<template>
    <div class="hidden lg:block lg:flex-shrink-0">
        <div class="max-w-80 space-y-4">
            <Trends></Trends>
            <People></People>
            <Birthday></Birthday>
        </div>
    </div>
</template>

<script setup>
import Birthday from '../Posts/Birthday.vue';
import People from '../Posts/People.vue';
import Trends from '../Posts/Trends.vue';


</script>