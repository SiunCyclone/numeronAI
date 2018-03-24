import Vue from "vue";
import _ from "underscore";

type Answer = {
  answer: number,
  eat: number,
  bite: number
}

class Solver {
  constructor() {
    this.predict(0, 0);
  }

  predict(eat:number, bite:number):void {
    if (this._answerLog.length === 0) {
      // Set random 3 number
      this._answer = Number(_.sample(_.range(1, 10), 3).join(''));
      return;
    }

    let answer:number;

    this._answerLog.push({
      answer: answer,
      eat: eat,
      bite: bite
    });
  }

  get answer() { return this._answer; }

  get candidateCount():number {
    if (this._answerLog.length === 0)
      return _.reduce(_.range(10 - this.difficulty, 10), (a, b) => { return a * b; });

    return 0;
  }

  public difficulty:number;
  private _answer:number;
  private _answerLog:Answer[] = [];
  private _candidateList:number[] = [];
}

  /*
      <div class="predict-log">
        <ul>
          <li v-for="log in predictLog">
            {{ log.number }} {{ log.eat }} {{ log.bite }}
          </li>
        </ul>
      </div>
   */

Vue.component('predict-area', {
  template: `
    <div class="predict-area">
      <div class="predict-view">
        <h2>{{ solver.answer }}</h2>
        <h4>正答確率: {{ }}</h4>
        <h4>残り候補数: {{ candidateCount }}</h4>
      </div>

    </div>
  `,

  props: {
    difficulty: String,
    solver: Solver
  },

  computed: {
    candidateCount() {
      this.solver.difficulty = this.difficulty;
      return this.solver.candidateCount;
    }
  }
});

Vue.component('select-area', {
  template: `
    <div class="select-area">
      <select-buttons :difficulty="difficulty" text="EAT"></select-buttons>
      <select-buttons :difficulty="difficulty" text="BITE"></select-buttons>

      <confirm-button @click="confirm">確定</confirm-button>
      <reset-button @click="reset">リセット</reset-button>
    </div>
  `,

  props: {
    difficulty: String,
    solver: Solver
  },

  data() {
    return {
      eatButtons: [],
      biteButtons: []
    };
  },

  mounted() {
    this.eatButtons = this.$children[0];
    this.biteButtons = this.$children[1];
  },

  methods: {
    confirm() {
      if (this.eatButtons.activeButton === '' || this.biteButtons.activeButton === '') {
        console.log("EATとBITE両方選択してください");
        return;
      }

      this.solver.predict(this.eatButtons.activeButton, this.biteButtons.activeButton);
      this.reset();
    },

    reset() {
      this.eatButtons.reset();
      this.biteButtons.reset();
    }
  }
});

Vue.component('select-buttons', {
  template: `
    <div class="select-buttons">
      {{ name }}
      <ul>
        <li v-for="i in Number(difficulty)">
          <select-button @click="select(i-1)" :index_i="i-1">{{ i - 1 }}</select-button>
        </li>
      </ul>
      <br>
    </div>
  `,

  props: {
    difficulty: String,
    text: String,
  },

  data() {
    return {
      buttons: [],
      activeButton: '',
      name: this.text
    };
  },

  mounted() {
    this.buttons = this.$children;
  },

  methods: {
    select(index) {
      this.buttons.forEach(button => {
        button.isActive = (button.index === index);

        if (button.isActive)
          this.activeButton = button;
      });
    },

    reset() {
      this.buttons.forEach(button => {
        button.isActive = false;
      });

      this.activeButton = '';
    }
  }
});

Vue.component('select-button', {
  template: `
    <button class="select-button" :class="{ 'is-active': isActive }" @click="$emit('click')"><slot></slot></button>
  `,

  props: {
    index_i: Number
  },

  data() {
    return {
      isActive: false,
      index: this.index_i
    };
  }
});

Vue.component('confirm-button', {
  template: `
    <button class="confirm-button" @click=confirm><slot></slot></button>
  `,

  methods: {
    confirm() {
      this.$emit('click');
    }
  }
});

Vue.component('reset-button', {
  template: `
    <button class="reset-button" @click=reset><slot></slot></button>
  `,

  methods: {
    reset() {
      this.$emit('click');
    }
  }
});

new Vue({
  el: '#main',

  data: {
    difficulty: '3',
    maxDifficulty: 5,
    solver: new Solver()
  }
})

