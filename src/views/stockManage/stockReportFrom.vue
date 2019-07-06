<template>
  <div>
    <el-form :inline="true" ref="Inventory" :model="Inventory" :rules="InventoryRule" label-width="100px">
      <el-form-item label="产品编码" prop="cinvcode" style="width: 300px;">
        <el-input style="width: 150px;" v-model="Inventory.cinvcode"></el-input>
        <el-button icon="el-icon-search" type="primary" circle @click="selectTableData"></el-button>
      </el-form-item>
      <el-form-item label="产品名称" prop="cinvname">
        <el-input v-model="Inventory.cinvname"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="cinvstd">
        <el-input v-model="Inventory.cinvstd">></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="ComputationUnit ">
        <el-input v-model="Inventory.ComputationUnit"></el-input>
      </el-form-item>
      <el-form-item label="税率" prop="iTaxRate">
        <el-input v-model="Inventory.iTaxRate"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input v-model="Inventory.count"></el-input>
      </el-form-item>
      <el-form-item label="无税单价" prop="taxless">
        <el-input v-model="Inventory.taxless"></el-input>
      </el-form-item>
      <el-form-item label="含税单价" prop="taxIncluded">
        <el-input v-model="Inventory.taxIncluded"></el-input>
      </el-form-item>
      <el-form-item label="金额" prop="money">
        <el-input v-model="Inventory.money"></el-input>
      </el-form-item>
      <el-form-item label="税额" prop="taxVal">
        <el-input v-model="Inventory.taxVal"></el-input>
      </el-form-item>
      <el-form-item label="税价合计" prop="taxTotal">
        <el-input v-model="Inventory.taxTotal"></el-input>
      </el-form-item>
      <el-form-item label="运费" prop="freight">
        <el-input v-model="Inventory.freight"></el-input>
      </el-form-item>
      <el-form-item label="运费单价" prop="freightUnit">
        <el-input v-model="Inventory.freightUnit"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="Inventory.remark"></el-input>
      </el-form-item>
      <el-form-item label="件数" prop="piece">
        <el-input v-model="Inventory.piece"></el-input>
      </el-form-item>
      <el-form-item label="宽度" prop="width">
        <el-input v-model="Inventory.width"></el-input>
      </el-form-item>
      <el-form-item label="长度" prop="length">
        <el-input v-model="Inventory.length"></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" align="middle" justify="end">
      <el-col :span="3">
        <el-button @click="AddPoinfo" type="success">确定</el-button>
      </el-col>
    </el-row>
    <el-dialog append-to-body :visible.sync="SelectTabDiag" v-loading="diagSelectLoad"
               width="1000px" title="选择产品编号">
      <el-table :data="SelctDataList">

        <template slot-scope="scope">
          <el-table-column align="center"
                           v-for="(item, inedx) in tableConle"
                           :key="inedx"
                           :prop="item.prop"
                           :label="item.label"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>


<script>
  import {saveOrder, queryInventoryList} from '@/api/StockOrderMang.js'

  export default {

    data() {
      this.tableConle = [
        {prop: "cInvCode", label: "产品编码"},
        {prop: "cInvName", label: "产品名称"},
        {prop: "cInvStd", label: "规格"},
        // {prop: "", label: "单位"},
        {prop: "iTaxRate", label: "税率"},
      ];
      return {
        diagSelectLoad: false,
        SelectTabDiag: false,
        SelctDataList: [],
        Inventory: {
          cinvcode: "",
          cinvname: '',
          cinvstd: '',
          ComputationUnit: '',
          iTaxRate: "",
          count: undefined,
          remark: '',
          taxless: undefined,
          taxIncluded: undefined,
          money: undefined,
          taxVal: undefined,
          taxTotal: undefined,
          freight: undefined,
          freightUnit: undefined,
          piece: "",
          width: '',
          length: "",
          addPeople: ''
        },
        InventoryRule: {
          cinvcode: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          cinvname: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          cinvstd: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          ComputationUnit: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          iTaxRate: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          count: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          taxless: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          taxIncluded: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          taxVal: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          taxTotal: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          freight: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          freightUnit: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          piece: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          length: [
            {required: true, message: '必填', trigger: 'blur'}
          ],


        }
      }
    },
    created() {
    },
    methods: {
      handleClick(row) {
        this.Inventory.cinvcode = row.cInvCode
        this.Inventory.cinvname = row.cInvName
        this.Inventory.cinvstd = row.cInvStd
        this.Inventory.iTaxRate = row.iTaxRate
        this.SelectTabDiag = false;
      },
      AddPoinfo() {
        this.Inventory.addPeople = this.$store.getters.introduction
        this.$refs['Inventory'].validate((valid) => {
          if (valid) {
            saveOrder(this.Inventory).then((res) => {
              console.log(res)
            })
          }
        })
      },
      selectTableData() {
        this.$refs['Inventory'].resetFields()
        this.SelectTabDiag = true
        this.diagSelectLoad = true
        queryInventoryList().then((res) => {
          this.SelctDataList = res.data.data
          this.diagSelectLoad = false
        })
      }
    }
  }
</script>
<style></style>
