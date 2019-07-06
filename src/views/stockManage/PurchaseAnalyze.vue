<template>
  <div>
    <el-row type="flex" align="middle" justify="center">
      <el-col :span="22" style="margin-top: 20px;">
        <el-table :data="PurchaesData">
          <template slot-scope="scope">
            <el-table-column label="订单信息" align="center">
              <el-table-column label="订货产品分类" align="center"></el-table-column>
              <el-table-column label="数量" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="用料信息" align="center">
              <el-table-column label="材料编码" align="center"></el-table-column>
              <el-table-column label="材料名称" align="center"></el-table-column>
              <el-table-column label="规格" align="center"></el-table-column>
              <el-table-column label="数量" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="存货信息" align="center">
              <el-table-column label="仓库" align="center"></el-table-column>
              <el-table-column label="数量" align="center"></el-table-column>
              <el-table-column label="待入库数量" align="center"></el-table-column>
            </el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    created() {

    },
    data() {
      return {
        PurchaesData: []
      }
    },
    component: {},
    methods: {
      GetPurchaseListData() {

      }
    }
  }
</script>
<style>

</style>
