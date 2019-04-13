<template>
  <vueDragInfinite :json="abc"
                   :name="name"
                   @save="saveJson" />
</template>

<script>
import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'
export default {
  components: { vueDragInfinite },
  data: function () {
    return {
      name: '动态排版',
      abc: [
        {
          style: {
            width: "150px",
            height: "150px",
            fontSize: "14px",
            color: "#fff",
            left: "50px",
            backgroundColor: "#999"
          },
          text: '这是第一个'
        },
        {
          style: {
            width: "100px",
            height: "100px",
            fontSize: "14px",
            color: "#fff",
            backgroundColor: "#333"
          },
          text: '这是第二个'
        }
      ]
    }
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
