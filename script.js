Vue.component('correct-buttons', {
  template: `
    <div class="correct-buttons">
      {{ label }}
      <ul>
        <li v-for="i in number">
          <correct-button @click="select(i-1)" :val="i-1">{{ i - 1 }}</correct-button>
        </li>
      </ul>
      <br>
    </div>
  `,

  props: {
    number: Number
  },

  data() {
    return {
      label: '〇の数',
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

Vue.component('correct-button', {
  template: `
    <button class="correct-button" :class="{ 'is-active': isActive }" @click="$emit('click')"><slot></slot></button>
  `,

  props: {
    val: Number
  },

  data() {
    return {
      isActive: false,
      index: -1
    };
  },

  mounted() {
    this.index = this.val;
  }
});

new Vue({
  el: '#main'
})

