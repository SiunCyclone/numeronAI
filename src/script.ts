import Vue from 'vue';

Vue.component('predict-area', {
  template: `
    <div class="predict-area">
      <h3>残り候補数: {{ restOptionNumber }}</h3>
    </div>
  `,

  props: {
    difficulty: String
  },

  data() {
    return {
      predictNumbers: [],
      minNumber: 1,
      maxNumber: 9
    };
  },

    //Math.floor(Math.random() * maxNumber) + minNumber;
  computed: {
    restOptionNumber() {
      //this.restOptionNumber = _.reduce(_.range(10 - Number(difficulty), 9), (a, b) => { return a * b; });
    }
  },

  methods: {
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

new Vue({
  el: '#main',

  data: {
    difficulty: '3',
    maxDifficulty: 5
  }
})

