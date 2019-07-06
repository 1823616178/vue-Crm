<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.serial"
                :placeholder="$t('production.serial')"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">{{ $t('table.export') }}
      </el-button>
    </div>

    <el-table :key="tableKey"
              ref="multipleTable"
              v-loading="listLoading"
              :data="listData"
              row-key="id"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">

      <el-table-column type="selection"
                       align="center"/>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row type="flex"
                  justify="start"
                  style="height: 100%;">
            <el-col :span="24">
              <div class="BackQie2">
                <div v-for="(item,index) in props.row.style"
                     :key="index" style="overflow: auto;width: 100%;">
                  <el-row type="flex"
                          justify="center"
                          style="text-align: center;">
                    <div style="height: 100px;width: 50px;background: #0a76a4;line-height: 100px">{{index}}</div>
                    <vueDragInfinite :json="item"
                                     :ratio="3"/>
                  </el-row>
                  <div style="background: #4AB7BD;width: 100%;height: 10px;"></div>
                </div>
                <!--  -->
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.id')"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="派工单"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{scope.row.sCoCOde}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分切长度"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{scope.row.FenQie}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品编码"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.dispathid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分切班组"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.groupCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.spec }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽度"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="杠数"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.hangval }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完工情况杠数"
                       min-width="90px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.CompleteCase == 0" type="info">未完工</el-tag>
          <el-tag v-if="scope.row.CompleteCase == 1" type="success">已完工{{scope.row.CompleteCase}}杠</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生产要求"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.productclaim }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配方编号"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.Repic }}</span>
        </template>
      </el-table-column>
      <el-table-column label="派工时间"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.dispathDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="要货时间"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.gavegoodsdate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.actions')"
                       align="center"
                       width="150"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.CompleteCase==1"
                     size="mini"
                     type="success"
                     @click="handleModifyStatus(scope.row,'published')">
            {{ $t('production.publish') }}
          </el-button>
          <el-button v-if="scope.row.CompleteCase==0"
                     size="mini"
                     @click="handleModifyStatus(scope.row,'draft')">
            {{ $t('production.draft') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev,pager,next" :total="totalData" :current-page.sync="listQuery.page"
                   @current-change="getListTwo"></el-pagination>

    <el-dialog title="编辑派工单"
               :visible.sync="dialogFormVisible"
               :width="500+'px'">
      <el-form ref="Completionform" :model="CompletionSingle" label-width="80px" :rules="CompletionSingleRules">
        <el-form-item label="生产要求" prop="productclaim">
          <el-input v-model="CompletionSingle.productclaim"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="CompletionSingle.remark"></el-input>
        </el-form-item>
        <el-form-item label="配方" prop="Repic">
          <el-col :span="17">
            <el-input
              placeholder="选择配方"
              v-model="CompletionSingle.Repic"
              :disabled="true">
            </el-input>
          </el-col>
          <el-col :offset="3" :span="4">
            <el-button icon="el-icon-search" @click="SelectRepicFunc" type="success" circle></el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="流延条码" :visible.sync="BarCodeDiag">
      <el-form :model="BarCodeRow" :inline="true" label-width="100px">
        <el-form-item label="存货编码">
          <el-input v-model="BarCodeRow.cInvCode" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="存货名称">
          <el-input v-model="BarCodeRow.cInvName" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="BarCodeRow.cInvStd" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="宽度">
          <el-input v-model="BarCodeRow.width" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="长度">
          <el-input v-model="BarCodeRow.FenQie" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="BarCodeRow.cInvStd" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="计量编码">
          <el-input v-model="BarCodeRow.cComUnitCode" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="大杠膜编号">
          <el-input v-model="BarCodeRow.HangCode" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="芯">
          <el-row>
            <el-col :span="15">
              <el-input v-model="BarCodeRow.Core" placeholder="选择芯"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button icon="el-icon-search" type="info" circle @click="innerVisibleClickFunc"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="BarCodeRow.iMassDate" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="计量名称">
          <el-input v-model="BarCodeRow.cComUnitName" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="毛重">
          <el-input v-model="BarCodeRow.Rought" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="芯重">
          <el-input v-model="BarCodeRow.CoreWeight" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="净重">
          <el-input v-model="JingWeight" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="保质期">
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="15">
              <el-input v-model="BarCodeRow.iMassDate" style="width: 50px;"></el-input>
            </el-col>
            <el-col>
              <div>个月</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="质检员">
          <el-input v-model="BarCodeRow.user" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="班组">
          <el-input v-model="BarCodeRow.groupCode" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="内部编号">
          <el-input v-model="BarCodeRow.InventoryCode" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="识别号">
          <el-input v-model="BarCodeRow.InventoryCode" style="width: 150px;"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog
        width="30%"
        title="选择芯"
        :visible.sync="innerVisible"
        append-to-body>
        <el-table :data="CoreListData">
          <el-table-column label="需要" prop="id">
          </el-table-column>
          <el-table-column label="芯编号" prop="Core">
          </el-table-column>
          <el-table-column label="芯重" prop="CoreWeight">
          </el-table-column>
          <el-table-column label="选择">
            <template slot-scope="scope">
              <el-button type="info" @click="isSelectCore(scope)">确定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible"
               title="Reading statistics">
      <el-table :data="pvData"
                border
                fit
                highlight-current-row
                style="width: 100%">
        <el-table-column prop="key"
                         label="Channel"/>
        <el-table-column prop="pv"
                         label="Pv"/>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="DiagSelectSwitch" title="选择配方">
      <el-table :data="DiagSelectSwitchData">
        <el-table-column v-for="(item,index) in stairList"
                         :key="index"
                         :prop="item.prop"
                         :label="item.label">

        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="info" @click="chooseRepic(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="OnCurrentPage"
        :total="SelectDiagTotal"
        @current-change="CurrentSyncPage">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import {
    productionList,
    fetchListS,
    createArticle,
    updataListlocalHost,
    GetComposeList,
    CompeleterSync,
    UpdataComplexTables,
    SearchIdComplexData,
    DiagSelectSwitchDataList,
    innerVisibleClickFunc
  } from '@/api/article'
  import waves from '@/directive/waves' // Waves directive
  import Sortable from 'sortablejs'
  import {parseTime} from '@/utils'
  import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {constants} from 'fs';
  import {GetFormList} from '@/api/LiuYanRequests.js'

  export default {
    name: 'ComplexTable',
    components: {Pagination, vueDragInfinite},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    computed: {
      JingWeight() {
        var Val = this.BarCodeRow.Rought - this.BarCodeRow.CoreWeight
        return Val
      }
    },
    data() {
      this.stairList = [
        {prop: 'id', label: "序号"},
        {prop: 'Name', label: "配方名称"},
        {prop: 'CreatDate', label: "创建时间"},
        {prop: 'StopDate', label: "停用时间"},
        {prop: 'number', label: "编号"},

      ]
      return {
        CoreListData: [],
        BarCodeRow: {
          InventoryCode: '',
          InventoryName: "",
          width: "",
          lenth: "",
          cInvStd: "",
          measureCode: "",
          HangCode: "",
          core: "",
          ProductDate: "",
          MeasurName: "",
          Rought: "",
          CoreWeight: "",
          suttle: "",
          ExpriDate: "",
          qualityPerson: "",
          TeamGroup: "",
          internalCode: "",
          Idecode: "",
          user: ""
        },
        innerVisible: false,
        BarCodeDiag: false,
        CompletionSingleRules: {
          productclaim: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          remark: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          CompleteCase: [
            {required: true, message: '必填', trigger: 'change'}
          ]
        },

        SelectDiagTotal: 0,
        CompletionSingle: {
          productclaim: "",
          remark: "",
          CompleteCase: "",
          Repic: ""
        },
        rowData: {},
        selectDiagPage: 0,
        OnCurrentPage: undefined,
        abc: [],
        DiagSelectSwitchData: [],
        DiagSelectSwitch: false,
        divIndexId:
        undefined,
        hangVal: 1,
        DataAbc: [],
        multipleSelection: [],
        StageName:
          ['机台1', '机台2', '机台3', '机台4'],
        tableKey: 0,
        list: null,
        listData: [],
        total: 0,
        totalData: 0,
        listLoading: true,
        listQuery: {
          page: 0,
          limit: 20,
          serial: '',
          // importance: undefined,
          type: undefined,
          sort: 'id'
        }
        ,
        recipeId: '',
        ratio: "",
        importanceOptions: [],
        calendarTypeOptions: [],
        sortOptions: [
          {label: 'ID Ascending', key: '+id'},
          {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          PinName: '',
          stage: '',
          remark: '',
          require: '',
          timestamp: new Date(),
          serial: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap:
          {
            update: '流延派工任务',
            create:
              'Create'
          },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          PinName: [{required: true, message: "请输入品名", trigger: "change"}],
        },
        downloadLoading: false,
        oldList: [],
        newList: [],
        sortable: null,
      }
    },
    created() {
      this.getListTwo()
    },
    methods: {
      isSelectCore(data) {
        this.BarCodeRow['Core'] = data.row.Core
        this.BarCodeRow['CoreWeight'] = data.row.CoreWeight
        this.innerVisible = false
      },
      innerVisibleClickFunc() {
        this.innerVisible = true
        innerVisibleClickFunc().then((res) => {
          this.CoreListData = res.data
          console.log(res)
        })
      },
      chooseRepic(data) {
        this.CompletionSingle.Repic = data.row.number
        this.DiagSelectSwitch = false
      },
      CurrentSyncPage() {
        var query = {
          page: this.OnCurrentPage
        }
        DiagSelectSwitchDataList(query).then((res) => {
          this.DiagSelectSwitchData = res.data.data
          this.SelectDiagTotal = res.data.total
        })
      },
      SelectRepicFunc() {
        this.DiagSelectSwitch = true
        var query = {
          page: 1
        }
        DiagSelectSwitchDataList(query).then((res) => {
          this.DiagSelectSwitchData = res.data.data
          this.SelectDiagTotal = res.data.total
        })
      },
      isClickDataSyncCompole() {
        console.log('yes')
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      getListTwo() {
        this.listLoading = true;
        productionList(this.listQuery).then(response => {
          if (response) {
            this.listData = response.data.items;
            this.totalData = response.data.total;
            this.importanceOptions = response.data.items;
            this.calendarTypeOptions = response.data.items;
            this.oldList = this.listData.map(v => v.id);
            this.newList = this.oldList.slice();
            this.listLoading = false;
            this.$nextTick(() => {
              this.setSort()
            })
          }
        })
      },

      setSort() {
        const el = this.$refs.multipleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          setData: function (dataTransfer) {
            dataTransfer.setData('Text2', '')
          },
          onEnd: evt => {
            const targetRow = this.listData.splice(evt.oldIndex, 1)[0];
            this.listData.splice(evt.newIndex, 0, targetRow)
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },
      handleFilter() {
        this.listQuery.page = 0
        var qu = {
          id: this.listQuery.serial
        }
        SearchIdComplexData(qu).then((res) => {
          this.listData = res.data.data
          this.totalData = res.data.total
        })
      },
      handleModifyStatus(row, status) {
        console.log(row)
        this.BarCodeDiag = true
        this.rowData = row
        var user = this.$store.getters.introduction
        row['user'] = user
        GetFormList(row).then((res) => {
          this.BarCodeRow = res.data
        })
      },
      sortChange(data) {
        const {prop, order} = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
      },
      createData(data) {
        // this.$refs['Completionform'].validate((valid) => {
        //   if (valid) {
        //     const data = {
        //
        //     }
        //     console.log(data)
        //   }
        // })
        console.log(this.$refs)
      },
      handleUpdate(row) {
        this.divIndexId = row.id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.CompletionSingle = row
      },
      updateData(data) {
        this.$refs['Completionform'].validate((valid) => {
          if (valid) {
            const data = {
              id: this.divIndexId,
              qu: this.CompletionSingle
            }
            UpdataComplexTables(data).then((res) => {
              this.getListTwo()
              this.dialogFormVisible = false
              this.$message("修改成功")
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleDownload() {
        if (this.multipleSelection.length) {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', 'name', 'remark', 'require', 'status']
            const filterVal = ['id', 'name', 'remark', 'require', 'status']
            const list = this.multipleSelection
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
            this.$refs.multipleTable.clearSelection()
            this.downloadLoading = false
          })
        } else {
          this.$message({
            message: 'Please select at least one item',
            type: 'warning'
          })
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    }
  }
</script>
<style>
  .sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
  }

  .el-table th > .cell {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    color: #f00;
  }

  .BackQie2 {
    /* position: absolute; */
    background: #8e388e;
    width: 1100px;
  }
</style>

<style scoped>
  .icon-star {
    margin-right: 2px;
  }

  .drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .show-d {
    margin-top: 15px;
  }
</style>
