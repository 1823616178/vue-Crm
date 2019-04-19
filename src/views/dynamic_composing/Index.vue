<template>
  <vueDragInfinite :json="add"
                   :name="name"
                   @save="saveJson" />
</template>

<script>
import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'
import indexVue from '../login/index.vue';
import { constants } from 'fs';
export default {
  components: { vueDragInfinite },
  data: function () {
    return {
      name: '动态排版',
      abc: [
        {
          style: {
            width: "350px",
            height: "300px",
            fontSize: "14px",
            color: "#fff",
            backgroundColor: "#999"
          },
          text: '这是第一个'
        },
        {
          style: {
            width: "350px",
            height: "300px",
            fontSize: "14px",
            color: "#fff",
            top:"0",
            backgroundColor: "#999"
          },
          text: '这是第二个'
        }
      ],
      add: []
    }
  },
  created () {
    this.$nextTick((res) => {
      this.add = []
      for (let i in this.abc) {
        for (let j = 0; j < 3; j++) {
          var b = 300 * j
          this.abc[i].style.top = b + 'px'
          let arr = this.abc[i]
          this.add.slice(arr)
        }
        console.log(this.add)
      }
      console.log(this.add)
    })
  },
  methods: {
    saveJson: function (data) {
      window.console.log(data)
    }
  }
}
</script>

<style>
</style>
