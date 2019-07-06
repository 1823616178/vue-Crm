<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->

    <div>
      <el-button :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-download"
                 @click="handleDownload">{{ $t('table.export') }}
      </el-button>
    </div>
    <el-table ref="dragTable"
              v-loading="listLoading"
              :data="list"
              row-key="id"
              border
              fit
              highlight-current-row
              style="width: 100%">

      <el-table-column type="selection"
                       align="center"/>

      <el-table-column align="center"
                       label="序号"
                       width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px"
                       align="center"
                       label="机台">
        <template slot-scope="scope">
          <span>{{ scope.row.drilling_crew}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px"
                       label="品名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px"
                       align="center"
                       label="规格(µm)">
        <template slot-scope="scope">
          <span>{{ scope.row.poles }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px"
                       label="生产要求">
        <template slot-scope="scope">
          <span>{{ scope.row.require }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="杠数"
                       width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.significance }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px"
                       label="配方">
        <template slot-scope="scope">
          <span>{{ scope.row.recipe }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px"
                       label="执行人">
        <template slot-scope="scope">
          <span>{{ scope.row.executor }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px"
                       label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px"
                       label="重要性">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.significance"
                    :key="n"
                    icon-class="star"
                    class="icon-star"/>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col"
                       label="完成度"
                       width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.complete }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="拖拽"
                       width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler"
                    icon-class="drag"/>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination background layout="prev,pager,next" :total="100"></el-pagination>
    </div>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <!-- <div class="show-d">{{ $t('table.dragTips1') }} : &nbsp; {{ oldList }}</div>
    <div class="show-d">{{ $t('table.dragTips2') }} : {{ newList }}</div> -->
  </div>
</template>

<script>
  import {GetLiuYanList} from '@/api/article'
  import Sortable from 'sortablejs'
  import {connect} from 'net';

  export default {
    name: 'DragTable',
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        sortable: null,
        oldList: [],
        newList: [],
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        GetLiuYanList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
          this.oldList = this.list.map(v => v.id)
          this.newList = this.oldList.slice()
          this.$nextTick(() => {
            this.setSort()
          })
        })
      },
      setSort() {
        const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function (dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0]
            this.list.splice(evt.newIndex, 0, targetRow)
            // for show the changes, you can delete in you code
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)
          }
        })
      },

      handleDownload() {
        if (this.list.length) {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', '机台', '品名', '规格', '生产要求']
            const filterVal = ['id', 'drilling_crew', 'require', 'remark', 'name']
            const list = this.list
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
            this.$refs.dragTable.clearSelection()
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
