<template>
  <div>
    <el-button type="primary" style="margin-bottom: 5px;" @click="AddRepiceDetails" v-show="isSelect">添加配方明细</el-button>
    <el-table
      :data="DataList"
      height="250"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="number"
        label="产品编码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="Name"
        label="产品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cInvStd"
        label="产品规格">
      </el-table-column>
      <el-table-column
        prop="ratio"
        label="使用比例">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层次">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="说明">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClicks(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delateClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="newAddDialog"
               :title="diagType"
               width="30%"
    >
      <el-form
        :model="newDiageAdd"
        :rules="editrule2"
        ref="newDiageDetil"
        label-width="80px"
        label-position="left">
        <!--        <el-form-item label="产品编码" prop="number">-->
        <!--          <el-input-->
        <!--            v-model="newDiageAdd.number"-->
        <!--            placeholder="输入"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="产品名称" prop="Name">
          <el-input
            v-model="newDiageAdd.Name"
            placeholder="输入"/>
        </el-form-item>
        <el-form-item label="产品规格" prop="cInvStd">
          <el-input
            v-model="newDiageAdd.cInvStd"
            placeholder="输入"/>
        </el-form-item>
        <el-form-item label="层次" prop="level">
          <el-input
            v-model="newDiageAdd.level"
            placeholder="输入"/>
        </el-form-item>
        <el-form-item label="使用比例" prop="ratio">
          <el-input
            v-model="newDiageAdd.ratio"
            placeholder="输入"/>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input
            v-model="newDiageAdd.remark"
            placeholder="输入"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger"
                   @click="newAddDialog=false">{{ $t('permission.cancel') }}
        </el-button>
        <template v-if="diagType == '新增配方明细'">
          <el-button type="primary"
                     @click="addNewReciptData">{{ $t('permission.confirm') }}
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary"
                     @click="UpdataNewReciptData">{{ $t('permission.confirm') }}
          </el-button>
        </template>

      </div>
    </el-dialog>
  </div>


</template>

<script>
  import {newProductDiageDetil, getRecipeDetail, DeleteDetails, UpdataNewReciptDatas} from '@/api/article.js'
  import {parseTime} from '@/utils/index.js'

  export default {
    props: {
      isSelect: {
        type: Boolean,
        required: true
      },
      tableDataIndex: {
        type: Object,
        required: true
      },
      DataList: {
        type: Array,
        required: true
      },
      formulaList: {
        type: Array,
        required: true
      },
      productIndex: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        diagType: '',
        newAddDialog: false,
        tableData: [],
        editrule2: {
          number: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          cInvStd: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          Name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          ratio: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        },
        newDiageAdd: {
          id: "",
          number: '',
          cInvStd: '',
          Name: '',
          ratio: '',
          remark: '',
          level: ''
        },
      }
    },
    methods: {
      UpdataNewReciptData() {
        UpdataNewReciptDatas(this.newDiageAdd).then((ress) => {
          if (ress.data.code == 1) {
            this.$emit("channgeDataList")
            this.$refs['newDiageDetil'].resetFields()
            this.$message("修改成功")
            this.newAddDialog = false
          }
          if (ress.data.code == 0) {
            this.$message("不修改请关闭")
            this.$emit("channgeDataList")
            this.newAddDialog = false
          }
        })
      },
      handleClicks(data) {
        this.newAddDialog = true
        this.diagType = "编辑配方明细";
        this.newDiageAdd = data
      },
      delateClick(data) {
        DeleteDetails(data).then((res) => {
          if (res.data.code == 1) {
            this.$emit("channgeDataList")
          }
        })
      },
      AddRepiceDetails() {
        var self = this
        this.diagType = "新增配方明细"
        this.newAddDialog = true;
        this.$refs['newDiageDetil'].resetFields()

      },
      addNewReciptData() {
        this.$refs['newDiageDetil'].validate((valid) => {
          this.newAddDialog = false
          if (valid) {
            newProductDiageDetil(this.formulaList[this.productIndex], this.tableDataIndex, this.newDiageAdd).then((ress) => {
              if (ress.data.code == 1) {
                this.$emit("channgeDataList")
              }
            })
          }
        })
      }
    }
  }
</script>
