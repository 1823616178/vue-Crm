<template>
  <div class="app-container">
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

    <el-table :data="listData"
              stripe
              high
              border
              fit
              highlight-current-row
              style="width: 100%">
      <el-table-column align="center"
                       prop="orderId"
                       :label="$t('orderTable.orderId')" />
      <el-table-column align="center"
                       prop="orderDate"
                       :label="$t('orderTable.orderDate')"
                       sortable />
      <el-table-column align="center"
                       v-for="( { prop, label }) in colConfigs"
                       :key="prop"
                       :prop="prop"
                       :label="label"></el-table-column>

      <el-table-column :label="$t('table.actions')"
                       align="center"
                       width="230">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="primary"
                     @click="handleDetail(scope.row)">{{$t('orderTable.detail')}}</el-button>
          <el-button size="mini"
                     @click="handleEdit( scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index,listData)">{{$t('table.delete')}}</el-button>

          <el-dialog :title="$t('orderTable.detail')"
                     :visible.sync="dialogTableVisible"
                     class=""
                     fullscreen>
            <el-form :model="temp"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
              <el-row :gutter="20">
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.orderId')"
                                  prop="orderId">
                      {{ temp.orderId}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.saleType')"
                                  prop="saleType">
                      {{temp.saleType}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.orderDate')"
                                  prop="orderDate">
                      {{temp.orderDate}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.busineType')"
                                  prop="busineType">
                      {{temp.busineType}}
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.customerName')"
                                  prop="customerName">
                      {{temp.customerName}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.customerPhone')"
                                  prop="customerPhone">
                      {{temp.customerPhone}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.customerServ')"
                                  prop="customerServ">
                      {{temp.customerServ}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.servPhone')"
                                  prop="servPhone">
                      {{temp.servPhone}}
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.customerTax')"
                                  prop="customerTax">
                      {{temp.customerTax}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.payCondition')"
                                  prop="payCondition">
                      {{temp.payCondition}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.customerFaith')"
                                  prop="customerFaith">
                      {{temp.customerFaith}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.customerBalce')"
                                  prop="customerBalce">
                      {{temp.customerBalce}}
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.sendDate')"
                                  prop="sendDate">
                      {{temp.sendDate}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.sendType')"
                                  prop="sendType">
                      {{temp.sendType}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.sendExpress')"
                                  prop="sendExpress">
                      {{temp.sendExpress}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.expressPhone')"
                                  prop="expressPhone">
                      {{temp.expressPhone}}
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.customerOrder')"
                                  prop="customerOrder">
                      {{temp.customerOrder}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.remark')"
                                  prop="remark">
                      {{temp.remark }}
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-table :data="orderDetailData"
                          stripe
                          high
                          border
                          fit
                          highlight-current-row
                          style="width: 100%">
                  <el-table-column align="center"
                                   v-for="({ prop, label }) in orderDetailConfigs"
                                   :key="prop"
                                   :prop="prop"
                                   :label="label">
                  </el-table-column>
                </el-table>
              </el-row>
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
import { querySaleOrder,getOrderList } from '@/api/mock'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data () {
    this.colConfigs = [
      { prop: "customerName", label: "客户尊称" },
      { prop: "customerPhone", label: "客户电话" },
      { prop: "customerServ", label: "客户专员" },
      { prop: "payCondition", label: "付款条件" },
      { prop: "customerFaith", label: "客户信用" },
      { prop: "sendDate", label: "要货日期" },
      { prop: "sendExpress", label: "发货物流" },
      { prop: "remark", label: "备注" }
    ];

    this.orderDetailConfigs = [
      { prop: "goodsName", label: "存货名称" },
      { prop: "goodsType", label: "规格型号" },
      { prop: "width", label: "客户宽度" },
      { prop: "number", label: "数量" },
      { prop: "long", label: "长度" },
      { prop: "pieces", label: "件数" },
      { prop: "priceOfTax", label: "含税单价" },
      { prop: "priceNoTax", label: "无税单价" },
      { prop: "askGoodsDate", label: "要货日期" },
      { prop: "remark", label: "备注" },
      { prop: "sendDate", label: "发货日期" },
      { prop: "name", label: "客户品名" },
      { prop: "type", label: "规格" }
    ];
    return {
      importanceOptions: [],
      calendarTypeOptions: [],
      totalData: 0,
      listData: null,
      total: 0,
      tableData: [],
      orderDetailData: [
        {
          goodsName: "DCPP(低温制袋)",
          goodsType: "50",
          width: "927",
          number: "1000.00",
          long: "50",
          pieces: "5",
          priceOfTax: "12.200",
          priceNoTax: "10.7965",
          askGoodsDate: "2019-04-08",
          remark: "备注",
          sendDate: "2019-05-12",
          name: "DCPP低温制袋",
          type: "50"
        },
        {
          goodsName: "DCPP(低温制袋)",
          goodsType: "50",
          width: "927",
          number: "160.00",
          long: "50",
          pieces: "5",
          priceOfTax: "12.200",
          priceNoTax: "10.7964",
          askGoodsDate: "2019-04-08",
          remark: "备注",
          sendDate: "2019-05-12",
          name: "DCPP低温制袋",
          type: "50"
        },
        {
          goodsName: "JCPP(高摩擦充气)",
          goodsType: "47",
          width: "705",
          number: "1600.00",
          long: "50",
          pieces: "5",
          priceOfTax: "12.200",
          priceNoTax: "10.7965",
          askGoodsDate: "2019-04-08",
          remark: "备注",
          sendDate: "2019-05-12",
          name: "JCPP(高摩擦充气)",
          type: "47"
        },
      ],
      dialogTableVisible: false,
      // key: 1, // table key
      // formTheadOptions: ['apple', 'banana', 'orange'],
      // checkboxVal: defaultFormThead, // checkboxVal
      // formThead: defaultFormThead // 默认表头 Default header
      rules: {
      },
      listQuery: {
        page: 1,
        limit: 10,
        customerServ: undefined,
        customerName: undefined,
        payCondition: undefined,
        sendExpress: undefined,
        customerFaith: undefined,
        sort: '+id'
      },
      temp: {},
    };
  },
  created () {
        this.getData()
        this.getListTwo()
      },
  watch: {
    checkboxVal (valArr) {
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i) >= 0
      );
      this.key = this.key + 1; // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  methods: {
    handleDelete(index,row) {
      row.splice(index,1);
    },
    handleDetail (row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(row.orderId);
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      console.log('测试删除');
      row.status = status
    },
    handleFilter () {
      querySaleOrder(this.listQuery).then(response => {
        this.listData = response.data.items
        this.total = this.listData.length
        console.log(this.tableData)
      })
    },
    getData () {
      getOrderList().then(response => {
        this.listData = response.data.data;
        this.total = response.data.data.length;
      })
      console.log(this.tableData);
    },
    getListTwo () {
      this.listLoading = true
      getOrderList().then(response => {
        if (response) {
          this.$nextTick(() => {
            console.log("=================>")
            this.listData = response.data.data
            this.totalData = response.data.data
            this.importanceOptions = response.data.data.items
            this.calendarTypeOptions = response.data.data.items
            console.log(response.data.data)
          })
        }
      })
    },
  }
};
</script>

