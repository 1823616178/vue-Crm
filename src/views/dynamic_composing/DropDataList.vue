<template>
  <div>
    <el-table
      :data="menudata"
      style="width: 100%"
      max-height="250">
      <el-table-column
        fixed
        prop="number"
        label="订单号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="count"
        label="数量"
        width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.count"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="coding"
        label="宽度"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cInvCode"
        label="规格"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, menudata)"
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      menudata: {
        type: Array,
        required: true,
      }
    },
    methods: {
      deleteRow(index, rows) {
        console.log(index)
        rows.splice(index, 1);
      }
    },
    data() {
      return {
        tableData: []
      }
    }
  }
</script>
