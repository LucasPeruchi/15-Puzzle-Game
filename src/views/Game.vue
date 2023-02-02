<template>
  <div class="flex flex-col items-center justify-center md:mt-48 mt-32">
    <template v-if="newGame">
      <div v-for="(columns, index) in numbers" class="flex w-full justify-center m-2">
        <div v-for="(value, index2) in columns" class="flex flex-col h-full justify-center m-2">
          <div class="flex items-center justify-center md:w-20 md:h-20 w-16 h-16 cursor-pointer border border-2 rounded-md" v-bind:class="{'border-green-700': verifyCorrectTile(index, index2)}" @click="changeTile(value, index, index2)">
            <span class="text-4xl font-bold select-none" v-bind:class="{'text-green-700': verifyCorrectTile(index, index2)}">{{ value }}</span>
          </div>
        </div>
      </div>
      <div class="flex w-80 justify-between">
        <span>Time: {{timer}}</span>
        <span>Moves: {{ count }}</span>
      </div>

      <div class="flex justify-between w-80 mt-8">
        <button @click="startGame()" class="flex justify-center border-2 p-3 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer">
          <div class="flex items-center">
            <font-awesome-icon icon="fa-solid fa-repeat" />
            <span class="ml-2">Restart</span>
          </div>
        </button>
        <router-link to="/ranking">
        <button class="w-18 border-2 p-3 rounded-lg bg-yellow-500 border-yellow-500 font-bold cursor-pointer">
          <div class="flex items-center">
            <font-awesome-icon icon="fa-solid fa-ranking-star" />
            <span class="ml-2">Ranking</span>  
          </div>
        </button>
      </router-link>
      </div>
    </template>

    <template v-if="!newGame && endGame">
        <div class="flex flex-col items-center">
          <span class="text-5xl mb-4">You Win!!!</span>
          <span class="text-3xl mb-4">Time: {{ timer }}</span>
          <span class="text-3xl mb-8">Moves: {{ count }}</span>
        </div>
        <div class="flex flex-col">
          <label>Name: </label>
          <div>
            <input v-model="name" class="text-black px-2" maxlength="18"/> 
            <button v-if="name !== ''" @click="saveScore()" class="ml-4 w-18 border-2 px-3 py-1 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer">Save</button>
          </div>
        </div>
        <div class="flex justify-between w-80 mt-8">
          <button class="w-18 border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer" @click="startGame()">
          <div class="flex items-center">
            <span>New game</span>
          </div>
        </button>
        <router-link to="/ranking">
        <button class="w-18 border-2 p-3 rounded-lg bg-yellow-500 border-yellow-500 font-bold cursor-pointer">
          <div class="flex items-center">
            <font-awesome-icon icon="fa-solid fa-ranking-star" />
            <span class="ml-2">Ranking</span>  
          </div>
        </button>
      </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { saveScore } from "@/services/ranking"
export default {
  name: 'Game',
  props: {
   
  },
  data() {
    return {
      numbers:  [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
    ],
      answer:  [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, undefined],
    ],
    randomNumbers: [],
    newRandomNumbers: [],
    inversions: 0,
    newGame: false,
    count: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    interval: null,
    timer: '',
    name: ''
    }
  },
  created() {
    this.startGame();
  },
  mounted() {
    let self = this; 

    window.addEventListener('keyup', function(ev) {
        self.keyPressed(ev);
    });
  },
  methods: {
    generateRandomGrid() {
      let randomNumber = Math.floor(15 * Math.random()) + 1

      if(this.randomNumbers.length === 15) {
        for(let i = 0; i < 15; i++) {
          this.newRandomNumbers.push(this.randomNumbers[i]);
        }
        this.populateNumbers();
        return;
      }

      if (!this.randomNumbers.includes(randomNumber)) {
        this.randomNumbers.push(randomNumber)
      }

      this.generateRandomGrid();
    },

    checkParity() {
      for (let a = 1; a < 16; a ++) {
        if(this.newRandomNumbers[a - 1] !== a) {
          let indexA = this.newRandomNumbers.findIndex(item => item === a);
          let valueA = this.newRandomNumbers[a - 1];
        
          this.newRandomNumbers[indexA] = valueA;
          this.newRandomNumbers[a - 1] = a;

          a++
          this.inversions = this.inversions + 1;
        }
      }

      const rightNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,undefined];

      let count = 0;
      for (let y = 0; y < 15; y++) {
        if (this.newRandomNumbers[y] !== rightNumbers[y]) {
          this.checkParity();
        }
        
        count ++
      
        if (count === 15) {
          if (this.inversions % 2 === 0) {
            return;
          } else {
            this.startGame();
          }
        }
      }

      return this.inversions;
    },

    populateNumbers() {
      let count = 0;
      for(let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
         this.numbers[x][y] = this.randomNumbers[count];

         count ++
        }
      }
    },

    verifyEmptyTile() {
      let EmptyTileIndex = {
        x: null,
        y: null,
      };

      for(let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
         if (this.numbers[x][y] === undefined) {
          EmptyTileIndex.x = x;
          EmptyTileIndex.y = y;
         }        
        }
      }

      return EmptyTileIndex;
    },

    changeTile(value, i1, i2) {
      const emptyTile = this.verifyEmptyTile();
      const clickedTile = {
        x: i1,
        y: i2,
        value
      }
    
      if(value === undefined) {
        return;
      }

      if(this.isNeighbor(clickedTile, emptyTile)) {
        this.numbers[emptyTile.x][emptyTile.y] = clickedTile.value;
        this.numbers[clickedTile.x][clickedTile.y] = undefined;
        this.count = this.count + 1;
      }

      this.checkAnswer();

      return
    },

    isNeighbor(clicked, empty) {
        if (clicked.x === empty.x) {
          if(clicked.y === empty.y + 1 || clicked.y === empty.y - 1) {
            return true;
          }
        }

        if (clicked.y === empty.y) {
          if(clicked.x === empty.x + 1 || clicked.x === empty.x - 1) {
            return true;
          }
        }

        return false;

    },

    keyPressed(event) {
      if(!this.newGame) {
        return;
      }

      const key = event.key;
      const emptyTile = this.verifyEmptyTile();
      
      if (key === 'ArrowRight' && emptyTile.y > 0) {
        this.numbers[emptyTile.x][emptyTile.y] = this.numbers[emptyTile.x][emptyTile.y - 1];
        this.numbers[emptyTile.x][emptyTile.y - 1] = undefined; 
        this.count = this.count + 1; 
      }

      if (key === 'ArrowDown' && emptyTile.x > 0) {
        this.numbers[emptyTile.x][emptyTile.y] = this.numbers[emptyTile.x - 1][emptyTile.y];
        this.numbers[emptyTile.x - 1][emptyTile.y] = undefined;   
        this.count = this.count + 1;    
      }

      if (key === 'ArrowLeft' && emptyTile.y < 3) {
        this.numbers[emptyTile.x][emptyTile.y] = this.numbers[emptyTile.x][emptyTile.y + 1];
        this.numbers[emptyTile.x][emptyTile.y + 1] = undefined;  
        this.count = this.count + 1;
      }

      if (key === 'ArrowUp' && emptyTile.x < 3) {
        this.numbers[emptyTile.x][emptyTile.y] = this.numbers[emptyTile.x + 1][emptyTile.y];
        this.numbers[emptyTile.x + 1][emptyTile.y] = undefined; 
        this.count = this.count + 1;
      }

      this.checkAnswer();

    },

    startGame() {
      this.randomNumbers = [];
      this.newRandomNumbers = [];
      this.inversions = 0;
      this.generateRandomGrid();
      this.checkParity();
      this.newGame = true;
      this.endGame = false;
      this.count = 0;
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      clearInterval(this.interval);
      this.interval = setInterval(()=> this.startTimer(), 1000);
    },

    startTimer() {
      if (this.newGame) {
        this.seconds = this.seconds + 1;
        
        if (this.seconds === 60) {
          this.seconds = 0;
          this.minutes = this.minutes + 1
        }

        if (this.minutes === 60) {
          this.minutes = 0;
          this.hours = this.hours + 1;
        }

        this.timer = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`

      }
    },

    checkAnswer() {
      let count = 0;
      for(let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          if (this.numbers[x][y] !== this.answer[x][y]) {
            return;
          }
         
          count ++
        
         if (count === 16) {
          this.newGame = false;
          this.endGame = true;
         }
        }
      }
    },
    
    verifyCorrectTile(index, index2) {
      if(index === 3 && index2 === 3) {
        return false;
      }
      
      if (this.numbers[index][index2] === this.answer[index][index2]) {
        return true;
      }
      return false;
    },

    async saveScore() {
      const now = new Date();
      const createdAt = `${now.toLocaleDateString('pt-BR')} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      const user =  {
              name: this.name,
              "createdAt": createdAt,
              "time": this.timer,
              count: this.count
            };
      
      await saveScore(user).then(() => this.$router.push('/ranking'));
    }

  }
  
}
</script>

<style scoped>

</style>
