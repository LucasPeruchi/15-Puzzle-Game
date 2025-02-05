<template>
  <div class="flex flex-col items-center justify-center md:mt-6 mt-16">
    <template v-if="newGame">
      <template v-if="!loading">
        <div class="flex flex-col justify-center items-center">
          <div v-for="(columns, rowIndex) in grid" :key=rowIndex class="flex flex-row w-full md:gap-2 gap-1 mb-2">
            <div v-for="(item, columnIndex) in columns" :key=columnIndex class="flex flex-row w-full">
              <div class="rounded-lg border-2 border-white md:w-20 md:h-20 w-14 h-14 pl-1.5 pt-1.5"
                    :class="item.class">
                <input ref="input" :disabled="count < rowIndex" v-if="count >=rowIndex" :class="item.class" class="md:w-16 md:h-16 w-10 h-10 bg-gray-500 text-5xl pb-5 text-center" maxlength="1" type="text" v-model="grid[rowIndex][columnIndex].value" @keydown="inputLetter($event, rowIndex, columnIndex)" @click="selectInput(rowIndex, columnIndex)">
              </div>
            </div>
          </div>
      </div>

      <div class="flex flex-col gap-4 keyboard w-full justify-center items-center mt-6">
        <div class="flex md:gap-3 gap-1" v-for="row in rows" :key="row">
          <div v-for="key in row" :key="key" @click="keyPressed(key)" class="flex flex-col md:p-4 px-2.5 py-2 md:text-3xl text-2xl text-center"
              :class="key.class === 'wrong' ? 'bg-gray-700 text-gray-400' : 'bg-gray-600 cursor-pointer hover:bg-gray-300 text-gray-100'">
            {{ key.letter }}
          </div>
        </div>
      </div>

        <div class="flex justify-between w-80 mt-8">
          <button @click="startGame()" class="flex justify-center border-2 p-3 rounded-lg bg-blue-500 border-blue-500 font-bold cursor-pointer">
            <div class="flex items-center">
              <font-awesome-icon icon="fa-solid fa-repeat" />
              <span class="ml-2">Restart</span>
            </div>
          </button>

          <button @click="sendAnswer(rowIndex, columnIndex)" class="flex justify-center border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer">
            <div class="flex items-center">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span class="ml-2">Check</span>
            </div>
          </button>
        </div>
      </template>

      <template v-if="loading">
        <div class="flex flex-col items-center justify-center md:mt-48 mt-36">
        <div class="flex items-center justify-center md:mt-32 mt-32">
          <span class="animate-spin h-8 w-8 border-t-4 border-white border-t-white rounded-full"></span>
          <span class="text-5xl ml-6">Loading...</span>
        </div>
     </div>

      </template>
    </template>

    <template v-if="!newGame">
        <div class="flex flex-col justify-center items-center md:mt-80 mt-64">
          <span class="text-5xl mb-12">{{ win === 1 ? 'You Win!!!' : 'You Loose!!!' }}</span>
          <span class="text-2xl mb-8">The correct answer is: <span class="text-2xl font-bold">{{ answer }}</span></span>
          <span class="text-2xl mb-4"> Attempts: {{ count }}</span>
        </div>
        <div class="flex justify-center w-80 mt-8">
          <button class="w-18 border-2 p-3 rounded-lg bg-green-500 border-green-500 font-bold cursor-pointer" @click="startGame()">
          <div class="flex items-center">
            <span>New game</span>
          </div>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import jsonData from "@/assets/words.json";
export default {
  name: 'Game',
  props: {
   
  },
  data() {
    return {
      newGame: false,
      loading: true,
      grid:  [],
      answer: '',
      rowIndex: null,
      columnIndex: null,
      count: 0,
      win: 0,
      rows: [
          [{ letter: 'q', class: null }, { letter: 'w', class: null }, { letter: 'e', class: null }, { letter: 'r', class: null },
          { letter: 't', class: null }, { letter: 'y', class: null }, { letter: 'u', class: null }, { letter: 'i', class: null },
          { letter: 'o', class: null }, { letter: 'p', class: null }], [{ letter: 'a', class: null }, { letter: 's', class: null },
          { letter: 'd', class: null }, { letter: 'f', class: null }, { letter: 'g', class: null }, { letter: 'h', class: null },
          { letter: 'j', class: null }, { letter: 'k', class: null }, { letter: 'l', class: null }], [{ letter: 'z', class: null },
          { letter: 'x', class: null }, { letter: 'c', class: null }, { letter: 'v', class: null }, { letter: 'b', class: null },
          { letter: 'n', class: null },{ letter: 'm', class: null }]
      ],
    }
  },
  created() {
    this.startGame()
  },
  mounted() {
   
  
  },
  methods: {
    startGame() {
      this.newGame = true;

      this.grid = [];
      this.answer = '';
      this.count = 0;
      this.win = 0;
      this.rowIndex = null;
      this.columnIndex = null;

      this.getRandomWord();

      for (let x = 0; x < 6; x++) {
        let line = [];

        for (let y = 0; y < 5; y++) {
          line.push({ class: null, value: null });
        }

        this.grid.push(line);
      }
    },
    
    selectInput(rowIndex, columnIndex) {
      this.rowIndex = rowIndex;
      this.columnIndex = columnIndex;
    },

    keyPressed(key) {
      if(!key.class) {
        this.grid[this.rowIndex][this.columnIndex].value = key.letter;
      }
    },

    async getRandomWord() {
      this.loading = true;
      const randomNumber = Math.floor(Math.random() * 1000);
      this.answer = jsonData.words[randomNumber];
      this.loading = false;
    },

    inputLetter(event, rowIndex, columnIndex) {
      this.rowIndex = rowIndex;
      this.columnIndex = columnIndex;

      let accents = [222, 219];

      if (accents.includes(event.keyCode)) {
        this.grid[rowIndex][columnIndex].value = null;
        event.preventDefault();
        
        return
      }

      if(event.key === 'Backspace') {
        event.preventDefault();
        if (this.grid[rowIndex][columnIndex].value !== null) {
          this.grid[rowIndex][columnIndex].value = null;
        } else {
          if (columnIndex > 0) {
            this.grid[rowIndex][columnIndex - 1].value = null;
          }
          this.toPreviousInput(rowIndex, columnIndex);
        }
          
        return
      }

      if(event.key === 'Enter') {
        this.sendAnswer(rowIndex, columnIndex);
      }

      let char = String.fromCharCode(event.keyCode); 
      if(/^[A-Za-z]+$/.test(char) && columnIndex < 5) {
        return this.toNextInput(rowIndex, columnIndex, false);
      } else {
        event.preventDefault();
      } 
    },

    sendAnswer(rowIndex, columnIndex) {
      const lineArray = this.grid[this.count];
      const word = [];

      lineArray.forEach(element => {
        word.push(element.value);
      });

      if(!this.checkExistence(word)) {
        console.log('Essa palavra não é aceita');
        return
      }

      if (word.every((letter) => !!letter)) {
        this.checkAnswer(word);
        this.count ++;
        this.toNextInput(rowIndex, columnIndex, true);
      } else {
        console.log('São aceitas apenas palavras de 5 letras');
        return
      }

    },

    checkExistence(word) {
      return jsonData.words.includes(word.join(''));
    },

    checkAnswer(word) {
      for(let i = 0; i < 5; i++) {
        if(word[i] === this.answer[i]) {
          this.grid[this.count][i].class = 'border-1 border-green-900 bg-green-900';
        }

        if(word[i] !== this.answer[i] && this.answer.includes(word[i])) {
          this.grid[this.count][i].class = 'border-1 border-blue-900 bg-blue-900';
        }

        if(word[i] !== this.answer[i] && !this.answer.includes(word[i])) {
          this.grid[this.count][i].class = 'border-1 border-red-900 bg-red-900';
          this.removeLetter(word[i]);
        }
      }

      if (word === this.answer || this.count === 5) {
        this.win = word === this.answer ? 1 : 2;
        this.newGame = false;
      }
    },

    removeLetter(letter) {
      let found = false;
      let foundRow, foundIndex;

      for (let i = 0; i < this.rows.length; i++) {
        for (let j = 0; j < this.rows[i].length; j++) {
          if (this.rows[i][j].letter === letter) {
            found = true;
            foundRow = i;
            foundIndex = j;

            this.rows[i][j].class = 'wrong';
            break;
          }
        }
        if (found) {
          break;
        }
      }
    },

    toNextInput(index, columnIndex, isEnter) {
      const checkList = {
        0: [0, 1, 2, 3, 4],
        1: [5, 6, 7, 8, 9],
        2: [10,11, 12, 13, 14],
        3: [15, 16, 17, 18, 19],
        4: [20, 21, 22, 23, 24],
        5: [25, 26, 27, 28, 29]
      }

      if ((columnIndex >= 4 && !isEnter) || this.count === 6) {
        return
      }

      setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.input[checkList[index][columnIndex] + 1].focus();
          });
        }, 0);        
    },

    toPreviousInput(index, columnIndex) {
      const checkList = {
        0: [0, 1, 2, 3, 4],
        1: [5, 6, 7, 8, 9],
        2: [10,11, 12, 13, 14],
        3: [15, 16, 17, 18, 19],
        4: [20, 21, 22, 23, 24],
        5: [25, 26, 27, 28, 29]
      }

      if (columnIndex === 0) {
        return
      }

      setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.input[checkList[index][columnIndex] - 1].focus();
          });
        }, 0);        
    }

  }
  
}
</script>

<style scoped>
</style>
