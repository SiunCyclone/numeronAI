import Vue from "vue";
import _ from "underscore";

type Answer = {
  call: number,
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
      this._call = Number(_.sample(_.range(1, 10), 3).join(''));
      return;
    }

    this._answerLog.push({
      call: this.call,
      eat: eat,
      bite: bite
    });

    let call:number;
  }

  get call():number {
    return this._call;
  }

  get answerLog():Answer[] {
    return this._answerLog;
  }

  get candidateCount():number {
    if (this._answerLog.length === 0)
      return _.range(10 - this.difficulty, 10).reduce((a, b) => { return a * b; });

    return 0;
  }

  public difficulty:number;

  private _call:number;
  private _answerLog:Answer[] = [];
  private _candidateList:number[] = [];
}

var permutation = (originalNumbers:number[], length:number) => {
  var result:number[][] = [];

  var loopLamb = (candidateTmp:number[], numbers:number[]) => {
    numbers.forEach((x) => {
      var candidate = [...candidateTmp, x];

      if (candidate.length === length) {
        result.push(candidate);
      } else {
        var restNumbers = numbers.filter(y => y !== x);
        loopLamb(candidate, restNumbers);
      }
    });
  };

  loopLamb([], originalNumbers);

  return result;
};

Vue.component('predict-area', {
  template: `
    <div class="predict-area">
      <div class="predict-view">
        <h2>{{ solver.call }}</h2>
        <h4>正答確率: {{ correctProbability }} %</h4>
        <h4>候補数: {{ candidateCount }}</h4>
      </div>

      <div class="predict-log">
        <ul>
          <li v-for="log in solver.answerLog">
            {{ log.call }} {{ log.eat }} {{ log.bite }}
          </li>
        </ul>
      </div>
    </div>
  `,

  props: {
    difficulty: String,
    solver: Solver
  },

  computed: {
    correctProbability() {
      return (1 / this.candidateCount * 100).toFixed(3);
    },

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

