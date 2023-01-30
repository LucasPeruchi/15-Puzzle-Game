<template>
  <div class="flex flex-col items-center justify-center md:mt-48 mt-32">
    <span class="text-4xl mb-4">
      Ranking
    </span>

    <div class="flex justify-around w-60 mb-8">
      <div class="mr-2">
        <div  @click="selectedTab = 'time'" v-bind:class="{'text-blue-500 border-b-blue-500 hover:text-blue-500 hover:border-blue-500 dark:hover:text-blue-500': selectedTab === 'time'}" class="flex items-center p-2 border-b-2 border-white rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer">
          <font-awesome-icon icon="fa-solid fa-stopwatch" />
          <span class="ml-2">Time</span>
        </div>
      </div>
      <div class="ml-2">
        <div @click="selectedTab = 'moves'" v-bind:class="{'text-blue-500 border-b-blue-500 hover:text-blue-500 hover:border-blue-500 dark:hover:text-blue-500': selectedTab === 'moves',  }" class="flex items-center p-2 border-b-2 border-white rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer">
          <font-awesome-icon icon="fa-solid fa-arrows-up-down-left-right" />
          <span class="ml-2">Moves</span>
        </div>
      </div>
    </div>

    <div class="w-96 h-96 rounded-md border-2">
      <div class="flex border-b-2">
        <div class="w-6/12 px-2">
          <span class>Name</span>
        </div>
        <div class="w-4/12 border-x-2 px-2">
          <span class>Time</span>
        </div>
        <div class="w-2/12 px-2">
          <span class>Moves</span>
        </div>
      </div>

      <template v-if="selectedTab === 'time'">
        <div class="flex border-b-2" v-for="item in recordsByTime">
          <div class="w-6/12 px-2">
            <span class>{{ item.name }}</span>
          </div>
          <div class="w-4/12 border-x-2 px-2">
            <span class>{{ item.time}}</span>
          </div>
          <div class="w-2/12 px-2">
            <span class>{{ item.count }}</span>
          </div>
        </div>
      </template>

      <template v-if="selectedTab === 'moves'">
        <div class="flex border-b-2" v-for="item in recordsByMoves">
          <div class="w-6/12 px-2">
            <span class>{{ item.name }}</span>
          </div>
          <div class="w-4/12 border-x-2 px-2">
            <span class>{{ item.time}}</span>
          </div>
          <div class="w-2/12 px-2">
            <span class>{{ item.count }}</span>
          </div>
        </div>
      </template>
    </div>

    
    <div class="flex justify-center w-80 mt-8">
      <router-link to="/game">
        <button class="w-18 border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer">
          <div class="flex items-center">
            <span>New game</span>
          </div>
        </button>
      </router-link>
    </div>
    
  </div>
</template>

<script>
import { getMovesScores, getTimesScores } from "@/services/ranking"
export default {
  name: 'Ranking',
  data() {
    return {
      selectedTab: 'time',
      recordsByTime: [],
      recordsByMoves: []
    }
  },
  created() {
    this.getScores();
  },

  methods: {
    async getScores() {
      await getMovesScores().then((response) => {
        this.recordsByMoves = response.data;
      });

      await getTimesScores().then((response) => {
        this.recordsByTime = response.data;
      });
    }

  }

}

</script>

<style>

</style>