<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.serial"
                :placeholder="$t('Peole.id')"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.id"
                 :placeholder="$t('Peole.Jobnumber')"
                 clearable
                 style="width: 90px"
                 class="filter-item">
        <el-option v-for="(item,index) in importanceOptions"
                   :key="index"
                   :label="item.id"
                   :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.type"
                 :placeholder="$t('Peole.Phone')"
                 clearable
                 class="filter-item"
                 style="width: 130px">
        <el-option v-for="(item,index) in calendarTypeOptions"
                   :key="index"
                   :label="item.code"
                   :value="item.code" />
      </el-select>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves

                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

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
                       align="center" />
      <el-table-column :label="$t('Peole.id')"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.ROW_NUMBER }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.Jobnumber')"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.cPersonCode}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.name')"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.cPersonName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.Phone')"
                       min-width="150px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.cPersonPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Peole.unit')"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cDepName }}</span>
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
                @pagination="getListTwo" />

    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"
               :model="temp"
               label-position="left"
               label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('production.id')"
                      prop="id">
          {{temp.cPersonCode}}
        </el-form-item>
        <el-form-item :label="$t('Peole.Jobnumber')"
                      prop="stage">
          <el-input v-model="temp.cPersonCode" />
        </el-form-item>
        <el-form-item :label="$t('Peole.Phone')"
                      prop="PinName">
          <el-input v-model="temp.cPersonPhone" />
        </el-form-item>

        <el-form-item :label="$t('Peole.unit')">
          <el-input v-model="temp.unit" />
        </el-form-item>

        <el-form-item :label="$t('Peole.duty')">
          <el-input v-model="temp.duty" />
        </el-form-item>

        <el-form-item :label="$t('Peole.role')">
          <el-select v-model="temp.role"
                     :placeholder="$t('Peole.role')"
                     clearable
                     style="width: 90px"
                     class="filter-item">
            <el-option v-for="(item,index) in ReloName"
                       :key="index"
                       :label="item"
                       :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Peole.user')">
          <el-input v-model="temp.user" />
        </el-form-item>

        <el-form-item :label="$t('Peole.CardId')">
          <el-input v-model="temp.CardId" />
        </el-form-item>
        <el-form-item :label="$t('Peole.birthday')">
          <el-input v-model="temp.birthday" />
        </el-form-item>

        <el-form-item :label="$t('Peole.sex')">
          <el-input v-model="temp.sex" />
        </el-form-item>
        <el-form-item :label="$t('Peole.site')">
          <el-input v-model="temp.site" />
        </el-form-item>
        <el-form-item :label="$t('Peole.timestamp')">
          <el-input v-model="temp.timestamp" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
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
                         label="Channel" />
        <el-table-column prop="pv"
                         label="Pv" />
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
import { productionList, fetchListS, fetPeopleList, fetchPv, createArticlelocalHost, updateArticlelocalHost } from '@/api/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter (type) {
      return calendarTypeKeyValue[type]
    }
  },
  data () {
    return {
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
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        Jobnumber: undefined,
        name: '',
        timestamp: new Date().getTime(),
        Phone: undefined,
        unit: '',
        role: '',
        user: "",
        CardId: "",
        birthday: undefined,
        duty: "",
        sex: "",
        site: "",
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
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created () {
    // this.getList()
    this.getListTwo()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    getList () {
      this.listLoading = true
      fetchListS(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false;
        // Just to simulate the time of the request
      })
    },
    getListTwo () {
      this.listLoading = true
      fetPeopleList(this.listQuery).then(response => {
        console.log(response)
        if (response) {
            this.listData = response.data.items
            this.totalData = response.data.total
            this.importanceOptions = response.data.items
            this.calendarTypeOptions = response.data.items
            this.listLoading = false;
            // Just to simulate the time of the request
        }
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getListTwo()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        Jobnumber: undefined,
        name: '',
        timestamp: new Date().getTime(),
        Phone: undefined,
        unit: '',
        role: '',
        user: "",
        CardId: "",
        birthday: undefined,
        duty: "",
        sex: "",
        site: "",
        // author: ''
      }
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createArticlelocalHost(this.temp).then(() => {
            this.listData.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticlelocalHost(tempData).then((res) => {
            console.log(res)
            for (const v of this.listData) {
              if (v.id === this.temp.id) {
                const index = this.listData.indexOf(v)
                this.listData.splice(index, 1, this.temp)
                break
              }
            }
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
    handleDelete (row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },

    handleDownload () {
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
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style>
</style>
