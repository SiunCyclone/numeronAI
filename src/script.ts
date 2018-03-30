import Vue from "vue";
import _ from "underscore";

type Answer = {
  call: number[],
  eat: number,
  bite: number
}

type Entropy = {
  value: number,
  candidate: number[]
}

class Solver {
  constructor(difficulty:number) {
    this.reset(difficulty);
  }

  calcEntropy(target:number[]) {
    var judgeMap = new Map();

    this._candidateList.forEach(candidate => {
      var result = judge(target, candidate).join("");

      if (judgeMap.has(result))
        judgeMap.set(result, judgeMap.get(result) + 1)
      else
        judgeMap.set(result, 1);
    });

    var countList = Array.from(judgeMap.values());
    var probabilityList = countList.map(count => count / this.total);
    var entropy = probabilityList.map(p => p * -Math.log2(p)).reduce((a, b) => a + b);

    return entropy;
  }

  createEntroyList(targetList:number[][]):Entropy[] {
    var entropyList:Entropy[] = [];

    targetList.forEach(target => {
      var entropy:Entropy = {
        value: this.calcEntropy(target),
        candidate: target
      };

      entropyList.push(entropy);
    });

    return entropyList;
  }

  updateCandidateList(eat:number, bite:number) {
    this._candidateList = this._candidateList.filter(candidate => {
      if (judge(candidate, this.call).join("") === [eat, bite].join("")) {
        return true;
      } else {
        this._outList.push(candidate);
        return false;
      }
    });
  }

  decideCall():void {
    var candidateEntropyList = this.createEntroyList(this._candidateList);
    var candidateMaxEntropy = Math.max(...candidateEntropyList.map(entropy => entropy.value));

    var outEntropyList = this.createEntroyList(this._outList);
    var outMaxEntropy = Math.max(...outEntropyList.map(entropy => entropy.value));

    if (candidateMaxEntropy >= outMaxEntropy)
      this.call = candidateEntropyList.find(entropy => entropy.value == candidateMaxEntropy).candidate;
    else
      this.call = outEntropyList.find(entropy => entropy.value == outMaxEntropy).candidate;
  }

  predict(eat:number, bite:number):void {
    this.updateCandidateList(eat, bite);
    this.decideCall();

    console.log(this.call);

    this._answerLog.push({
      call: this.call,
      eat: eat,
      bite: bite
    });
  }

  reset(difficulty:number):void {
    this.difficulty = difficulty;
    this.call = _.sample(_.range(1, 10), difficulty);
    this._candidateList = permutation(_.range(1, 10), difficulty);
    console.log(this._candidateList);
    this._outList = [];
    this._answerLog = [];
  }

  get candidateCount():number {
    return this._candidateList.length;
  }

  get answerLog():Answer[] {
    return this._answerLog;
  }

  get total():number {
    return this._candidateList.length + this._outList.length;
  }

  public difficulty:number;
  public call:number[] = [];

  private _candidateList:number[][] = [];
  private _outList:number[][] = [];
  private _answerLog:Answer[] = [];
}

var judge = (call:number[], answer:number[]):number[] => {
  var eat = 0
  var bite = 0

  _.zip(call, answer).forEach(ary => {
    if (ary[0] === ary[1])
      eat += 1
    else if(answer.includes(ary[0]))
      bite += 1
  });

  return [eat, bite];
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
        <h2>{{ callNumber }}</h2>
        <h4>正答確率: {{ correctProbability }} %</h4>
        <h4>候補数: {{ candidateCount }}</h4>
      </div>

      <div class="predict-log">
       <ol>
          <li v-for="log in answerLog">
            {{ log.call }} {{ log.eat }}, {{ log.bite }}
          </li>
        </ol>
      </div>
    </div>
  `,

  props: {
    difficulty: String,
    callNumber: { required: true },
    candidateCount: Number,
    answerLog: { required: true }
  },

  computed: {
    correctProbability() {
      return (1 / this.candidateCount * 100).toFixed(3);
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
    difficulty: String
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

      this.resetButtons();

      var eatIndex = this.eatButtons.activeIndex;
      var eat = this.eatButtons.buttons[eatIndex].index;

      var biteIndex = this.biteButtons.activeIndex;
      var bite = this.biteButtons.buttons[biteIndex].index;

      this.$emit('predict', eat, bite);
    },

    reset() {
      this.resetButtons();
      this.$emit('reset');
    },

    resetButtons() {
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
      activeIndex: -1,
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
          this.activeIndex = index;
      });
    },

    reset() {
      this.buttons.forEach(button => {
        button.isActive = false;
      });

      this.activeIndex = -1;
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
  el: '#solver',

  template: `
    <div>
      <div class="difficulty-menu">
        難易度
        <select v-model="difficulty">
          <option v-for="i in maxDifficulty">{{ i }}</option>
        </select>
      </div>

      <predict-area :difficulty="difficulty" :call-number="solver.call" :candidate-count="solver.candidateCount" :answer-log="solver.answerLog"></predict-area>
      <select-area :difficulty="difficulty" @predict="predict" @reset="reset"></select-area>
    </div>
  `,

  data: {
    difficulty: '3',
    maxDifficulty: 5,
    solver: new Solver(3)
  },

  methods: {
    reset() {
      this.solver.reset(Number(this.difficulty));
    },

    predict(eat, bite) {
      this.solver.predict(eat, bite);
    }
  }
})

