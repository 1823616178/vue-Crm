<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.cSOCode"
                placeholder="搜索订单号"
                style="width: 300px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">{{ $t('table.search') }}
      </el-button>
    </div>

    <el-table :data="listData"
              stripe
              high
              border
              v-loading="isLoading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.children"
            height="250"
            border
            style="width: 100%">
            <el-table-column
              prop="cInvCode"
              label="产品编码"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cInvName"
              label="产品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cInvStd"
              label="产品规格"
              width="180">
            </el-table-column>
            <el-table-column
              prop="iQuantity"
              label="订货数量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cbdefine4"
              label="订货宽度"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cbdefine3"
              label="订货长度"
              width="180">
            </el-table-column>
            <el-table-column
              prop="dPreDate"
              label="订货件数">
            </el-table-column>
            <el-table-column
              prop="dPreDate"
              label="发货日期">
            </el-table-column>
            <el-table-column
              prop="dbclosedate"
              label="关闭日期">
            </el-table-column>
            <el-table-column
              prop="cMemo"
              label="备注">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       v-for="( { prop, label }) in colConfigs"
                       :key="prop"
                       :prop="prop"
                       :label="label"></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination :total="total"
                     :page.sync="listQuery.page"
                     :limit.sync="listQuery.limit"
                     :current-page="PageLimit"
                     @current-change="propsClick"
                     background
                     layout="prev, pager, next"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList} from '@/api/article'
  import {querySaleOrder, getSaleOrderList, deleteSaleOrder, querySaleOrderDetail,SearchSaleList} from '@/api/mock'
  import Pagination from '@/components/Pagination'

  export default {
    components: {Pagination},
    data() {
      this.colConfigs = [
        {prop: "cSOCode", label: "订单号"},
        {prop: "dDate", label: "订单日期"},
        {prop: "cCusCode", label: "客户编码"},
        {prop: "cPersonCode", label: "员工编码"},
        {prop: "iTaxRate", label: "税率"},
        {prop: "dclosesystime", label: "关闭日期"},
        {prop: "cMemo", label: "备注"},
        {prop: "cDefine1", label: "客户采购单号"},
      ];

      this.colConfigsChiled = [
        {prop: "cSOCode", label: "订单号"},
        {prop: "cCusCode", label: "客户编码"},
      ];
      this.orderDetailConfigs = [
        {prop: "iSOsID", label: "单条明细ID"},
        {prop: "cbdefine3", label: "订货长度"},
        {prop: "cbdefine4", label: "订货件数"},

      ];
      return {
        propsData: [
          {
            cSOCode: 1231,
            cCusCode: 1231231
          },
        ],
        isLoading: false,
        expressOptions: ['申通', '顺丰'],
        faithOptions: [1, 2, 3, 4],
        importanceOptions: [],
        calendarTypeOptions: [],
        totalData: 0,
        listData: null,
        total: 0,
        tableData: [],
        orderDetailData: [],
        deleteParam: {
          orderId: undefined,
        },
        PageLimit: 1,
        dialogTableVisible: false,
        // key: 1, // table key
        // formTheadOptions: ['apple', 'banana', 'orange'],
        // checkboxVal: defaultFormThead, // checkboxVal
        // formThead: defaultFormThead // 默认表头 Default header
        rules: {},
        listQuery: {
          pag: 1,
          limit: 10,
          cSOCode: undefined,
        },
        temp: [],
      };
    },
    created() {
      this.getData()
      // this.getListTwo()
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(
          i => valArr.indexOf(i) >= 0
        );
        this.key = this.key + 1; // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
      }
    },
    methods: {
      propsClick(data) {
        const page = {
          pag: this.PageLimit
        }
        this.isLoading = true
        getSaleOrderList(page).then(response => {
          this.listData = response.data.data;
          this.total = response.data.total;
          this.isLoading = false
        })
      },
      handleDelete(index, listData) {
        this.deleteParam.orderId = listData[index].orderId;
        deleteSaleOrder(this.deleteParam).then(response => {
          listData.splice(index, 1);
        })
      },
      handleDetail(row) {
        // this.temp = Object.assign({}, row) // copy obj
        this.dialogTableVisible = true;
        this.listQuery.orderId = row.cSOCode;
        querySaleOrderDetail(this.listQuery).then(response => {
          // this.orderDetailData = response;
          this.temp = response.data.data
          console.log(this.temp)
        })
        this.$nextTick(() => {
          this.$refs['dataForm']
        })
      },

      handleFilter() {

        SearchSaleList(this.listQuery).then(response => {
          this.listData = response.data.data;
          this.total = this.listData.total;
        })
      },
      getData() {
        this.isLoading = true
        var page = {
          pag: this.PageLimit
        }
        getSaleOrderList(page).then(response => {
          this.listData = response.data.data;
          this.total = response.data.total;
          this.isLoading = false
        })
      },
    }
  };
</script>

