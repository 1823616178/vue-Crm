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
  background-color: #a7a7a763;
  height: 100%;
}

.right-container {
  /* border: #fce38a; */
  border-style: outset;
  /* background-color: #fce38a; */
  height: 100%;
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
