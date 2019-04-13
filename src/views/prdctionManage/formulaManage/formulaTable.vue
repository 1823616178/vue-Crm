<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="apple">apple</el-checkbox>
        <el-checkbox label="banana">banana</el-checkbox>
        <el-checkbox label="orange">orange</el-checkbox>
      </el-checkbox-group>-->
      <div class="filter-container">
        <el-input v-model="listQuery.title"
                  :placeholder="$t('orderTable.customerName')"
                  style="width: 600px;"
                  class="filter-item"
                  @keyup.enter.native="handleFilter" />
        <el-button class="filter-item"
                   type="primary"
                   icon="el-icon-search"
                   @click="handleFilter">{{ $t('table.search') }}</el-button>
      </div>
    </div>

    <el-table :data="tableData"
              stripe
              high
              border
              fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center"
                       v-for="( { prop, label }) in colConfigs"
                       :key="prop"
                       :prop="prop"
                       :label="label">
      </el-table-column>
      <el-table-column :label="$t('formulaTable.level')">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.level"
                    :key="n"
                    icon-class="star"
                    class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')"
                       align="center"
                       width="150">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit( scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, tableData)">{{ $t('table.delete') }}</el-button>
          <el-dialog :title="$t('table.edit')"
                     :visible.sync="dialogTableVisible">
            <el-form :model="this.temp">
              <el-form-item :label="$t('formulaTable.formulaId')">
                <el-input :value="temp.formulaId"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.goods')">
                <el-input :value="temp.goods"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.createTime')">
                <el-input :value="temp.createTime"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.createPeop')">
                <el-input :value="temp.createPeop"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.stopTime')">
                <el-input :value="temp.stopTime"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.stopPeop')">
                <el-input :value="temp.stopPeop"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.updateTime')">
                <el-input :value="temp.updateTime"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.updatePeop')">
                <el-input :value="temp.updatePeop"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.defaultVal')">
                <el-input :value="temp.defaultVal"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.level')">
                <el-input :value="temp.level"/>
              </el-form-item>
              <el-form-item :label="$t('formulaTable.remark')">
                <el-input :value="temp.remark"/>
              </el-form-item>
              <div slot=""
                   class="dialog-footer">
                <el-button @click="dialogTableVisible = false">{{$t('permission.cancel')}}</el-button>
                <el-button type="primary"
                           @click="dialogTableVisible = false">{{$t('permission.confirm')}}</el-button>
              </div>
            </el-form>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <span class="demonstration"></span>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="getListTwo" />
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination'
import { getFormulaList, queryFormulaList } from '@/api/mock'
export default {
  components: { Pagination },
  data () {
    this.colConfigs = [
      { prop: "formulaId", label: "配方编号" },
      { prop: "goods", label: "对应产品" },
      { prop: "createTime", label: "创建时间" },
      { prop: "createPeop", label: "创建者" },
      { prop: "stopTime", label: "停止时间" },
      { prop: "stopPeop", label: "停止人" },
      { prop: "updateTime", label: "修改时间" },
      { prop: "updatePeop", label: "修改人" },
      // { prop: "level", label: "配方等级" },
      { prop: "defaultVal", label: "默认选用值" },
      { prop: "remark", label: "备注" }
    ];
    return {
      tableData: [],
      temp: {},
      total: 0,
      dialogFormVisible: false,
      dialogTableVisible: false,
      // key: 1, // table key
      // formTheadOptions: ['apple', 'banana', 'orange'],
      // checkboxVal: defaultFormThead, // checkboxVal
      // formThead: defaultFormThead // 默认表头 Default header
      rules: {

      },
      listQuery: {
        page: 1,
        limit: 20,
        customerServ: undefined,
        customerName: undefined,
        payCondition: undefined,
        sendExpress: undefined,
        customerFaith: undefined,
        sort: '+id'
      },
    };
  },
  created () {
    this.getData()
    this.getListTwo()
  },
  watch: {

  },
  methods: {
    handleDelete(index,row) {
      row.splice(index,1);
    },
    handleEdit (row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp);
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },
    getData () {
      getFormulaList().then(response => {
        this.tableData = response.data.data;
        this.total = response.data.data.length
        console.log(response);
      })
      console.log(this.tableData);
    },
    handleFilter () {
      queryFormulaList(this.listQuery).then(response => {
        this.tableData = response.data.items
        this.total = this.tableData.length
        console.log(this.tableData)
      })
    },
    getListTwo () {
      this.listLoading = true
      queryFormulaList().then(response => {
        if (response) {
          this.$nextTick(() => {
            console.log("=================>")
            this.listData = response.data.items
            this.totalData = response.data.items
            this.importanceOptions = response.data.items
            this.calendarTypeOptions = response.data.items
            console.log(response.data.items)
          })
        }
      })
    }
  }
};
</script>

