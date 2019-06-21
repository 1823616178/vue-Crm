<template>
  <el-table
    :data="tableData"
    height="250"
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="产品编码"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="产品名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="产品规格">
    </el-table-column>
    <el-table-column
      prop="address"
      label="使用比例">
    </el-table-column>
    <el-table-column
      prop="address"
      label="层次">
    </el-table-column>
    <el-table-column
      prop="address"
      label="说明">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props(){

    },
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    }
  }
</script>
