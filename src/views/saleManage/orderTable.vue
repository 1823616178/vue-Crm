<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.customerName"
                :placeholder="$t('orderTable.customerName')"
                style="width: 300px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.customerFaith"
                 :placeholder="$t('orderTable.customerFaith')"
                 clearable
                 style="width: 120px"
                 class="filter-item">
        <el-option v-for="item in faithOptions"
                   :key="item"
                   :label="item"
                   :value="item"/>
      </el-select>
      <el-select v-model="listQuery.sendExpress"
                 :placeholder="$t('orderTable.sendExpress')"
                 clearable
                 style="width: 120px"
                 class="filter-item">
        <el-option v-for="item in expressOptions"
                   :key="item"
                   :label="item"
                   :value="item"/>
      </el-select>
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
              fit
              highlight-current-row
              style="width: 100%">
      <!--      <el-table-column align="center"-->
      <!--                       prop="cSOCode"-->
      <!--                       :label="$t('orderTable.orderId')"/>-->
      <!--      <el-table-column align="center"-->
      <!--                       prop="cSOCode"-->
      <!--                       :label="$t('orderTable.orderDate')"-->
      <!--                       sortable/>-->
      <el-table-column align="center"
                       v-for="( { prop, label }) in colConfigs"
                       :key="prop"
                       :prop="prop"
                       :label="label"></el-table-column>

      <el-table-column :label="$t('table.actions')"
                       align="center"
                       width="100">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="primary"
                     @click="handleDetail(scope.row)">{{$t('orderTable.detail')}}
          </el-button>
          <!--          <el-button size="mini"-->
          <!--                     @click="handleEdit( scope.row)">{{$t('table.edit')}}-->
          <!--          </el-button>-->
          <!--          <el-button size="mini"-->
          <!--                     type="danger"-->
          <!--                     @click="handleDelete(scope.$index,listData)">{{$t('table.delete')}}-->
          <!--          </el-button>-->

          <el-dialog :title="$t('orderTable.detail')"
                     :visible.sync="dialogTableVisible"
                     class=""
                     fullscreen>
            <el-form :v-model="temp"
                     :rules="rules"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
              <el-row :gutter="20">
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.orderId')"
                                  prop="orderId">
                      {{temp.ID}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.cInvCode')"
                                  prop="cInvCode">
                      {{temp.cInvCode}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.dPreDate')"
                                  prop="dPreDate">
                      {{temp.dPreDate}}
                    </el-form-item>

                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.iSOsID')"
                                  prop="iSOsID">
                      {{temp.iSOsID}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.AutoID')"
                                  prop="AutoID">
                      {{temp.AutoID}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.cInvName')"
                                  prop="cInvName">
                      {{temp.cInvName}}
                    </el-form-item>

                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.cDefine34')"
                                  prop="cDefine34">
                      {{temp.cDefine34}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.dPreMoDate')"
                                  prop="dPreMoDate">
                      {{temp.dPreMoDate}}
                    </el-form-item>
<!--                    <el-form-item :label="$t('orderTable.dreleasedate')"-->
<!--                                  prop="dreleasedate">-->
<!--                      {{temp.dreleasedate}}-->
<!--                    </el-form-item>-->

                    <el-form-item :label="$t('orderTable.dbclosesystime')"
                                  prop="dbclosesystime">
                      {{temp.dbclosesystime}}
                    </el-form-item>

                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-form-item :label="$t('orderTable.iQuantity')"
                                  prop="iQuantity">
                      {{parseInt(temp.iQuantity)}}
                    </el-form-item>
                    <el-form-item :label="$t('orderTable.cSCloser')"
                                  prop="cSCloser">
                      {{temp.cSCloser}}
                    </el-form-item>
<!--                    <el-form-item :label="$t('orderTable.sendExpress')"-->
<!--                                  prop="sendExpress">-->
<!--                      {{temp.sendExpress}}-->
<!--                    </el-form-item>-->
<!--                    <el-form-item :label="$t('orderTable.sendExpress')"-->
<!--                                  prop="sendExpress">-->
<!--                      {{temp.sendExpress}}-->
<!--                    </el-form-item>-->
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-form-item :label="$t('orderTable.iTaxRate')"
                                prop="iTaxRate">
                    {{temp.iTaxRate}}
                  </el-form-item>
                  <el-form-item :label="$t('orderTable.dbclosedate')"
                                prop="dbclosedate">
                    {{temp.dbclosedate}}
                  </el-form-item>
<!--                  <div class="grid-content bg-purple">-->
<!--                    <el-form-item :label="$t('orderTable.expressPhone')"-->
<!--                                  prop="expressPhone">-->
<!--                      {{temp.expressPhone}}-->
<!--                    </el-form-item>-->
<!--                    <el-form-item :label="$t('orderTable.customerOrder')"-->
<!--                                  prop="customerOrder">-->
<!--                      {{temp.customerOrder }}-->
<!--                    </el-form-item>-->
<!--                  </div>-->
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
            <div slot="footer"
                 class="dialog-footer">
              <el-button type="primary"
                         @click="dialogTableVisible = false">{{ $t('tagsView.close') }}
              </el-button>
            </div>
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
                  @pagination="getListTwo"/>
    </div>
  </div>
</template>

<script>
  import {fetchList} from '@/api/article'
  import {querySaleOrder, getSaleOrderList, deleteSaleOrder, querySaleOrderDetail} from '@/api/mock'
  import Pagination from '@/components/Pagination'

  export default {
    components: {Pagination},
    data() {
      this.colConfigs = [
        {prop: "cSOCode", label: "订单号"},
        {prop: "cCusCode", label: "客户编码"},
        {prop: "dDate", label: "订单日期"},
        {prop: "cPersonCode", label: "员工编码"},
        {prop: "iTaxRate", label: "税率"},
        {prop: "cDefine1", label: "客户采购单号"},
        {prop: "cCusName", label: "客户名称"},
        {prop: "ccusperson", label: "客户联系人"},
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
        dialogTableVisible: false,
        // key: 1, // table key
        // formTheadOptions: ['apple', 'banana', 'orange'],
        // checkboxVal: defaultFormThead, // checkboxVal
        // formThead: defaultFormThead // 默认表头 Default header
        rules: {},
        listQuery: {
          page: 1,
          limit: 10,
          customerServ: undefined,
          customerName: undefined,
          payCondition: undefined,
          sendExpress: undefined,
          customerFaith: undefined,
          orderId: undefined,
          sort: '+id',
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
      handleDelete(index, listData) {
        this.deleteParam.orderId = listData[index].orderId;
        deleteSaleOrder(this.deleteParam).then(response => {
          listData.splice(index, 1);
        })
      },
      handleDetail(row) {
        // this.temp = Object.assign({}, row) // copy obj
        this.dialogTableVisible = true;
        this.listQuery.orderId = row.ID;
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
        querySaleOrder(this.listQuery).then(response => {
          this.listData = response.data.data;
          this.total = this.listData.length;
        })
      },
      getData() {
        getSaleOrderList().then(response => {
          this.listData = response.data;
          this.total = response.data.length;
        })
      },
      getListTwo() {
        this.listLoading = true
        getSaleOrderList().then(response => {
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

