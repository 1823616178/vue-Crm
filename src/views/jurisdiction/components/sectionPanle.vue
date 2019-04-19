<template>
  <div class="components-container">
    <split-pane split="vertical"
                @resize="resize">
      <template slot="paneL">
        <div class="left-container verticaloverflow">
          <Kanban :key="1"
                  :list="list1"
                  :options="options"
                  class="kanban todo"
                  header-text="全体员工" />
        </div>
      </template>
      <template slot="paneR">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container verticaloverflow">
              <Kanban :key="2"
                      :list="list2"
                      :options="options"
                      class="kanban working"
                      header-text="超级管理员" />
            </div>
          </template>
          <template slot="paneR">
            <div class="top-container verticaloverflow">
              <Kanban :key="3"
                      :list="list3"
                      :options="options"
                      class="kanban done"
                      header-text="普通用户" />
            </div>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import Kanban from '@/components/Kanban'
export default {
  components: { splitPane, Kanban },
  methods: {
    resize () {
      console.log('resize')
    }
  },
  data () {
    return {
      options: {
        group: 'mission',
        animation: 300,
        dragClass: "oNdragClass",
        sort: true,
        disabled: false
      },
      list1: [
        { name: '张三', tesk: "分切", role: '管理管理管理管理管理管理管理管理管理管理管理管理管理管理管理管理管理', id: 1 },
        { name: '李四', tesk: "分切", role: '管理', id: 2 },
        { name: '王五', tesk: "分切", role: '管理', id: 3 },
        { name: '赵六', tesk: "分切", role: '管理', id: 4 },
        { name: '牛七', tesk: "分切", role: '管理', id: 5 },
        { name: '牛七', tesk: "分切", role: '管理', id: 6 },
        { name: '牛七', tesk: "分切", role: '管理', id: 7 },
        { name: '牛七', tesk: "分切", role: '管理', id: 8 },
        { name: '牛七', tesk: "分切", role: '管理', id: 9 },
        { name: '牛七', tesk: "分切", role: '管理', id: 10 },
        { name: '张三', tesk: "分切", role: '管理', id: 1 },
        { name: '李四', tesk: "分切", role: '管理', id: 2 },
        { name: '王五', tesk: "分切", role: '管理', id: 3 },
        { name: '赵六', tesk: "分切", role: '管理', id: 4 },
        { name: '牛七', tesk: "分切", role: '管理', id: 5 },
        { name: '牛七', tesk: "分切", role: '管理', id: 6 },
        { name: '牛七', tesk: "分切", role: '管理', id: 7 },
        { name: '牛七', tesk: "分切", role: '管理', id: 8 },
        { name: '牛七', tesk: "分切", role: '管理', id: 9 },
        { name: '牛七', tesk: "分切", role: '管理', id: 10 }
      ],
      list2: [
      ],
      list3: [
      ]
    }
  }
}
</script>

<style>
.verticaloverflow {
  overflow: auto;
}
.oNdragClass {
  color: aqua;
  background-color: blueviolet;
  font-family: "Times New Roman", Times, serif;
}
.leftVew {
  background-color: #fce38a;
  height: 100%;
}
.components-container {
  position: relative;
  height: 70vh;
}

.left-container {
  background-color: #f38181;
  height: 100%;
}

.right-container {
  background-color: #fce38a;
  height: 200px;
}

.top-container {
  background-color: #fce38a;
  width: 100%;
  height: 100%;
}

.bottom-container {
  overflow: initial;
  width: 100%;
  background-color: #95e1d3;
  height: 100%;
}
</style>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>
