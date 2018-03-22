import Vue from "vue";
import _ from "underscore";

class Solver {
  predictLog:[] = new Array();

  predictNumber():number {
    if (this.predictLog.length == 0)
      return Number(_.sample(_.range(1, 10), 3).join(''));

    return 0;
  },

  restChoosableNumber():number {
    if (this.predictLog.length == 0)
      return _.reduce(_.range(10 - Number(this.difficulty), 10), (a, b) => { return a * b; });

    return 0;
  }
}

/*
        <h4>残り候補数: {{ this.solver.restChoosableNumber() }}</h4>
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
        <h4>正答確率: {{ this.probability }}</h4>
      </div>

    </div>
  `,

  props: {
    difficulty: String,
    solver: Solver
  },

  data() {
    return {
      minNumber: 1,
      maxNumber: 9
    };
  },

  created() {
  },

  computed: {
    probability() {
    }
  }
});

Vue.component('select-buttons', {
  template: `
    <div class="select-buttons">
      <slot></slot>
      <ul>
        <li v-for="i in Number(difficulty)">
          <select-button @click="select(i-1)" :val="i-1">{{ i - 1 }}</select-button>
        </li>
      </ul>
      <br>
    </div>
  `,

  props: {
    difficulty: String
  },

  data() {
    return {
      buttons: []
    };
  },

  created() {
    this.buttons = this.$children;
  },

  methods: {
    select(index) {
      this.buttons.forEach(button => {
        button.isActive = (button.index == index);
      });
    }
  }
});

Vue.component('select-button', {
  template: `
    <button class="select-button" :class="{ 'is-active': isActive }" @click="$emit('click')"><slot></slot></button>
  `,

  props: {
    val: Number
  },

  data() {
    return {
      isActive: false,
      index: this.val
    };
  }
});

Vue.component('reset-button', {
  template: `
    <button class="reset-button" @click=reset><slot></slot></button>
  `,

  methods: {
    reset() {
      console.log("reset");
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

