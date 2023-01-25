<template>
  <div class="flex flex-col items-center justify-center mt-48">
    <div class="flex flex-col items-center" v-if="!newGame && !endGame">
      <span class="text-5xl mb-10">Start new game?</span>
      <button class="w-18 border-2 p-3 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer" @click="startGame()">New game</button>
    </div>
    <template v-if="newGame">
      <div v-for="(columns, index) in numbers" class="flex w-full h-full justify-center">
        <div v-for="(value, index2) in columns" class="flex-col mr-5">
          <div class="felx h-20 w-20 my-5 pt-3 text-center cursor-pointer border border-2 rounded-md" @click="changeTile(value, index, index2)">
            <span class="text-5xl">{{ value }}</span>
          </div>
        </div>
      </div>
      <div class="flex w-80 justify-between">
        <span>Time: {{ hours }}:{{ minutes }}.{{ seconds }}</span>
        <span>Moves: {{ count }}</span>
      </div>
    </template>
    <template v-if="!newGame && endGame">
        <div class="flex flex-col items-center">
          <span class="text-5xl mb-4">You Win!!!</span>
          <span class="text-3xl mb-4">Time: {{ hours }}:{{ minutes }}.{{ seconds }}</span>
          <span class="text-3xl mb-8">Moves: {{ count }}</span>
          <button class="w-18 border-2 p-3 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer" @click="startGame()">New game</button>
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
    interval: null
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
      
      if (key === 'ArrowRight' && emptyTile.x > 0) {
        console.log(this.verifyEmptyTile().y, this.verifyEmptyTile().x - 1)/
        this.changeTile(this.numbers[emptyTile.y][emptyTile.x - 1], emptyTile.y, emptyTile.x - 1);
      }

      if (key === 'ArrowDown' && emptyTile.y > 0) {
        this.changeTile(this.numbers[emptyTile.y - 1][emptyTile.x], emptyTile.y - 1, emptyTile.x);
      }

      if (key === 'ArrowLeft' && emptyTile.x < 3) {
        this.changeTile(this.numbers[emptyTile.y][emptyTile.x + 1], emptyTile.y, emptyTile.x + 1);
      }

      if (key === 'ArrowUp' && emptyTile.y < 3) {
        this.changeTile(this.numbers[emptyTile.y + 1][emptyTile.x], emptyTile.y + 1, emptyTile.x);
      }
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
