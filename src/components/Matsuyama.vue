<template>
  <div class="flex flex-col items-center justify-center md:mt-48 mt-32">
    <div class="flex flex-col items-center md:mt-48 mt-32" v-if="!newGame && !endGame">
      <span class="text-5xl mb-10">Start new game?</span>
      <button class="w-18 border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer" @click="startGame()">New game</button>
    </div>
    <template v-if="newGame">
      <div v-for="(columns, index) in numbers" class="flex w-full justify-center m-2">
        <div v-for="(value, index2) in columns" class="flex flex-col h-full justify-center m-2">
          <div class="flex items-center justify-center md:w-20 md:h-20 w-16 h-16 cursor-pointer border border-2 rounded-md" @click="changeTile(value, index, index2)">
            <span class="text-4xl font-bold">{{ value }}</span>
          </div>
        </div>
      </div>
      <div class="flex w-80 justify-between">
        <span>Time: {{timer}}</span>
        <span>Moves: {{ count }}</span>
      </div>
      <div class="mt-8 w-40">
        <button @click="startGame()" class="flex justify-center w-full border-2 p-3 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer">
          <div class="w-6 h-6 mr-4">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path>
          </svg>
          </div>
          <span>Restart</span>
        </button>
      </div>
    </template>
    <template v-if="!newGame && endGame">
        <div class="flex flex-col items-center">
          <span class="text-5xl mb-4">You Win!!!</span>
          <span class="text-3xl mb-4">Time: {{ timer }}</span>
          <span class="text-3xl mb-8">Moves: {{ count }}</span>
          <button class="w-18 border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer" @click="startGame()">New game</button>
        </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Matsuyama',
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
    newGame: false,
    count: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    interval: null,
    timer: ''
    }
  },
  created() {
    
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
        return;
      }

      if (!this.randomNumbers.includes(randomNumber)) {
        this.randomNumbers.push(randomNumber)
      } 

      this.randomNumbers = [1,2,3,4,5,6,7,8,13,9,14,10,15,12,11]

      this.generateRandomGrid();      
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
      this.generateRandomGrid();
      this.populateNumbers();
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

        this.timer = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}.${this.seconds.toString().padStart(2, '0')}`

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
    }

  }
  
}
</script>

<style scoped>

</style>
