<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.serial"
                :placeholder="$t('production.serial')"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.id"
                 :placeholder="$t('production.id')"
                 clearable
                 style="width: 90px"
                 class="filter-item">
        <el-option v-for="(item,index) in importanceOptions"
                   :key="index"
                   :label="item.id"
                   :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.code"
                 :placeholder="$t('production.code')"
                 clearable
                 class="filter-item"
                 style="width: 130px">
        <el-option v-for="(item,index) in calendarTypeOptions"
                   :key="index"
                   :label="item.code"
                   :value="item.code" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table :key="tableKey"
              ref="multipleTable"
              v-loading="listLoading"
              :data="listData"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       align="center" />
      <el-table-column :label="$t('production.id')"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.time')"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.getdate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.serial')"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.serial }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.code')"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.name')"
                       min-width="90px">
        <template slot-scope="scope">
          <span class="link-type"
                @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.width')"
                       width="90px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.bridge')"
                       width="50px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bridge }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.complete')"
                       width="50px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.complete }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.specification')"
                       align="center"
                       width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.specification"
                class="link-type">{{ scope.row.specification }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('production.require')"
                       width="50px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.require }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('production.remark')"
                       width="90px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('production.getdate')"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.getdate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('production.dispatch')"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dispatch | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('production.status')"
                       class-name="status-col"
                       width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('production.actions')"
                       align="center"
                       width="230"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     @click="handleUpdate(scope.row)">{{ $t('production.edit') }}</el-button>
          <el-button v-if="scope.row.status!='published'"
                     size="mini"
                     type="success"
                     @click="handleModifyStatus(scope.row,'published')">
            {{ $t('production.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'"
                     size="mini"
                     @click="handleModifyStatus(scope.row,'draft')">
            {{ $t('production.draft') }}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'"
                     size="mini"
                     type="danger"
                     @click="handleModifyStatus(scope.row,'deleted')">
            {{ $t('production.delete') }}
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
               :rules="rules"
               label-position="left"
               label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('production.id')"
                      prop="id">
          {{temp.id}}
        </el-form-item>
        <el-form-item :label="$t('production.stage')"
                      prop="stage">
          <el-select v-model="temp.stage"
                     :placeholder="$t('production.stage')"
                     clearable
                     style="width: 90px"
                     class="filter-item">
            <el-option v-for="(item,index) in StageName"
                       :key="index"
                       :label="item"
                       :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('production.PinName')"
                      prop="PinName">
          <el-input v-model="temp.PinName" />
        </el-form-item>

        <el-form-item :label="$t('production.require')">
          <el-input v-model="temp.require" />
        </el-form-item>

        <el-form-item :label="$t('production.specification')">
          {{temp.specification}}
        </el-form-item>

        <el-form-item :label="$t('production.bridge')">
          {{temp.bridge}}
        </el-form-item>

        <el-form-item :label="$t('production.recipe')">
          <el-select v-model="temp.id"
                     :placeholder="$t('production.recipe')"
                     clearable
                     style="width: 90px"
                     class="filter-item">
            <el-option v-for="(item,index) in StageName"
                       :key="index"
                       :label="item"
                       :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('production.remark')">
          <el-input v-model="temp.remark"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    placeholder="Please input" />
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
import { productionList, fetchListS, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { constants } from 'fs';

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
      tableKey: 0,
      list: null,
      listData: null,
      total: 0,
      totalData: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        serial: '',
        // importance: undefined,
        type: undefined,
        sort: 'id'
      },
      importanceOptions: [],
      calendarTypeOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' },
      { label: 'ID Descending', key: '-id' }],
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
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        PinName: [{ required: true, message: "请输入品名", trigger: "change" }],
      },
      downloadLoading: false
    }
  },
  created () {
    this.getListTwo()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getListTwo () {
      this.listLoading = true
      productionList(this.listQuery).then(response => {
        if (response) {
          this.$nextTick(() => {
            this.listData = response.data.items
            this.totalData = response.data.total
            this.importanceOptions = response.data.items
            this.calendarTypeOptions = response.data.items
            console.log(response)
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
          // this.temp.author = 'admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
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
          updateArticle(tempData).then(() => {
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
    // handleFetchPv (pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    // handleDownload () {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['id', 'name', 'specification', 'width', 'bridge', 'status']
    //     const filterVal = ['id', 'name', 'specification', 'width', 'bridge', 'status']
    //     const data = this.formatJson(filterVal, this.listData)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson (filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }

    handleDownload () {
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
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style>
</style>
