import Vue from "vue";
import _ from "underscore";

class Solver {
  predictNumber():number {
    if (this.predictLog.length == 0)
      return Number(_.sample(_.range(1, 10), 3).join(''));

    return 0;
  }

  restChoosableNumber(difficulty:number):number {
    if (this.predictLog.length == 0)
      return _.reduce(_.range(10 - difficulty, 10), (a, b) => { return a * b; });

    return 0;
  }

  private predictLog:number[] = [];
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
        <h2>{{ this.solver.predictNumber() }}</h2>
        <h4>正答確率: {{ }}</h4>
        <h4>残り候補数: {{ this.solver.restChoosableNumber(Number(this.difficulty)) }}</h4>
      </div>

    </div>
  `,

  props: {
    difficulty: String,
    solver: Solver
  },

  data() {
    return {

    }
  },

  created() {
  },

  computed: {
  }
});

Vue.component('select-area', {
  template: `
    <div class="select-area">
      <select-buttons :difficulty="difficulty" :solver="solver" text="EAT"></select-buttons>
      <select-buttons :difficulty="difficulty" :solver="solver" text="BITE"></select-buttons>

      <confirm-button>確定</confirm-button>
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

    console.log(this.eatButtons);
  },

  methods: {
    reset() {
      this.eatButtons.resetAll();
      this.biteButtons.resetAll();
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
    solver: Solver,
    text: String,
  },

  data() {
    return {
      buttons: [],
      name: this.text
    };
  },

  mounted() {
    this.buttons = this.$children;
  },

  methods: {
    select(index) {
      this.buttons.forEach(button => {
        button.isActive = (button.index == index);
      });

      console.log(this.name);
      //solver.
    },

    resetAll() {
      this.buttons.forEach(button => {
        button.isActive = false;
      });
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
      console.log("confirm button");
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
      console.log("reset button");
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

