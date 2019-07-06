<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" align="middle" justify="center">
        <el-col :span="6" :offset="1">
          <el-button class="filter-item"
                     style="margin-left: 10px;"
                     type="primary"
                     @click="AddSection"
                     v-show="isEditSelect">添加部门
          </el-button>
          <el-button class="filter-item"
                     style="margin-left: 10px;"
                     type="primary"
                     @click="DeleteSection">删除部门
          </el-button>
        </el-col>
        <el-col :span="24" :offset="6">
          <el-button class="filter-item"
                     style="margin-left: 10px;"
                     type="primary"
                     icon="el-icon-edit"
                     @click="handleCreate">{{ $t('table.add') }}
          </el-button>
<!--          <el-button v-waves-->

<!--                     class="filter-item"-->
<!--                     type="primary"-->
<!--                     icon="el-icon-download"-->
<!--                     @click="handleDownload">{{ $t('table.export') }}-->
<!--          </el-button>-->
        </el-col>
      </el-row>
    </div>

    <el-dialog title="增加部门"
               :visible.sync="isAddSection"
               width="600px">
      <el-form ref="dataForm"
               :model="SectinData"
               label-position="left"
               label-width="70px"
               style="margin-left:50px;">

        <el-form-item label="部门名称">
          <el-input v-model="SectinData.duty"/>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="isAddSection = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary"
                   @click="AddSectionButton">{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-table :key="tableKey"
              ref="multipleTable"
              :data="listData"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       align="center"/>
      <el-table-column :label="$t('Peole.id')"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.Jobnumber')"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.Jobnumber}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.name')"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type"
          >{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.Phone')"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type"
          >{{ scope.row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.unit')"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SectionName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column :label="$t('Peole.role')"-->
      <!--                       width="150px"-->
      <!--                       align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.role }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column :label="$t('production.actions')"
                       align="center"
                       width="230"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     @click="handleUpdate(scope.row)">{{ $t('production.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getListTwo"/>

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"
               :model="temp"
               :rules='rules'
               label-position="left"
               label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('Peole.Jobnumber')"
                      prop="Jobnumber">
          <el-input v-model="temp.Jobnumber"/>
        </el-form-item>
        <el-form-item label="姓名"
                      prop="Name">
          <el-input v-model="temp.Name"/>
        </el-form-item>
        <el-form-item :label="$t('Peole.Phone')"
                      prop="Phone">
          <el-input v-model="temp.Phone"/>
        </el-form-item>

        <el-form-item :label="$t('Peole.unit')">
          <el-input v-model="temp.unit" :disabled="true"/>
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
  </div>
</template>

<script>
  import {
    productionList,
    fetchListS,
    fetPeopleList,
    fetchPv,
    createArticlelocalHost,
    updateArticlelocalHost,
  } from '@/api/article'
  import {GetDepartData, DeleteSectionData, addNewPeople, UpGroupPeople} from '@/api/role.js'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: {Pagination},
    directives: {waves},
    props: {
      SeSyncDayta: {
        type: Object,
        default: {},
        required: true
      },
      isEditSelect: {
        type: Boolean,
        default: false,
        required: true,
      }
    },
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
    data() {
      return {
        DeparOption: [],
        loading: false,
        SectinData: {
          duty: ""
        },
        isAddSection: false,
        multipleSelection: [],
        StageName: ['机台1', '机台2', '机台3', '机台4'],
        ReloName: ['admin', 'editor'],
        tableKey: 0,
        list: null,
        listData: null,
        total: 0,
        totalData: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          Jobnumber: undefined,
          Phone: ''
        },
        importanceOptions: [],
        calendarTypeOptions: [],
        sortOptions: [
          {label: 'ID Ascending', key: '+id'},
          {label: 'ID Descending', key: '-id'}
        ],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          Jobnumber: undefined,
          Name: '',
          phone: undefined,
          unit: '',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          Jobnumber: [{required: true, message: '必填项', trigger: 'change'}],
          Name: [{required: true, message: '必填项', trigger: 'change'}],
          Phone: [{required: true, message: '必填项', trigger: 'change'}],
          unit: [{required: true, message: '必填项', trigger: 'change'}]
        },
        downloadLoading: false
      }
    },
    created() {
      // this.getList()
      this.getListTwo()
    },
    methods: {
      DeleteSection() {
        DeleteSectionData(this.SeSyncDayta.data).then((res) => {
          if (res.data.code == 1) {
            this.$emit('getTreeList')
          }
        })
      },
      AddSectionButton() {
        GetDepartData(this.SectinData, this.SeSyncDayta.data).then((res) => {
          console.log(res)
          if (res.data.code == 1) {
            this.$emit('getTreeList')
            this.isAddSection = false
          }
        })
      },
      GetRemoteData() {
      },
      AddSection() {
        this.isAddSection = true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      getList() {
        this.listLoading = true
        fetchListS(this.listQuery).then(response => {
          console.log(response)
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false;
          // Just to simulate the time of the request
        })
      },
      getListTwo(data) {
        this.listLoading = true
        fetPeopleList(data).then(response => {
          if (response) {
            console.log(data)
            this.listData = response.data.items
            this.totalData = response.data.total
            this.importanceOptions = response.data.items
            this.calendarTypeOptions = response.data.items
            this.listLoading = false;
            // Just to simulate the time of the request
          }
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getListTwo()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
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
          Jobnumber: undefined,
          Name: '',
          phone: undefined,
          unit: '',
          // author: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.temp.unit = this.SeSyncDayta.data.name
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addNewPeople(this.SeSyncDayta.data, this.temp).then((res) => {
              this.getListTwo()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
            // this.temp.author = 'vue-element-admin'
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            UpGroupPeople(this.temp).then((res) => {
              console.log(res)
              this.getListTwo(this.SeSyncDayta.data);
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
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
            const tHeader = ['Id', 'Jobnumber', 'name', 'Phone', 'unit']
            const filterVal = ['id', 'Jobnumber', 'name', 'Phone', 'unit']
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
</style>
