<template>
     <div class="flex flex-col items-center justify-center md:mt-48 mt-32">
        <div class="flex flex-col items-center md:mt-48 mt-32">
            <span class="text-5xl mb-10">Start new game?</span>
            <div class="flex w-full justify-around">
                <router-link to="/game">
                    <button class="w-18 border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer">
                        New game
                    </button>
                </router-link>
                <router-link to="/ranking">
                    <button class="w-18 border-2 p-3 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer">
                        <font-awesome-icon icon="fa-solid fa-ranking-star" />
                        Ranking
                    </button>
                </router-link>
            </div>
        </div>
     </div>
</template>

<script>
export default {
  name: 'Home',

}

</script>

<style>

</style>