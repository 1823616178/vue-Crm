<template>
  <div>
    <el-card>采购订单管理</el-card>
    <div style="padding: 20px;">
      <el-card :body-style="{padding:'5px'}">
        <el-row type="flex" align="middle" justify="start" style="padding: 5px; margin-left: 30px;">
          <el-col :span="3">
            <el-input placeholder="搜索ID" v-model="pageId"></el-input>
          </el-col>
          <el-col :span="2" style="margin-left: 5px">
            <el-button type="primary" icon="el-icon-search" @click="QueryIdOrder">搜索</el-button>
          </el-col>
          <el-col :offset="1" style="padding: 5px;" :span="3">
            <el-button type="success" @click="isClickDiag">添加采购订单</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" justify="center">
          <el-col :span="23">
            <template>
              <el-table
                v-loading="TableLoading"
                :data="TableList"
                height="700"
                border
                style="width: 100%">
                <el-table-column
                  prop="id"
                  label="订单审核"
                  width="150" align="center">
                  <template slot-scope="scope">
                    <el-button type="success" @click="AffirmOrder(scope)">确认审核</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="订单到货"
                  width="150" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="AffirmAoG(scope)">确认到货</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="ID"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="buy_code"
                  label="采购单号"
                  width="150">
                </el-table-column>
                <el-table-column
                  width="150"
                  prop="arrive_day"
                  label="到货日期">
                </el-table-column>
                <el-table-column
                  width="150"
                  prop="supplier_code"
                  label="供应商编码">
                </el-table-column>
                <el-table-column
                  width="200"
                  prop="supplier_name"
                  label="供应商名称">
                </el-table-column>
                <el-table-column
                  prop="contact_person"
                  label="联系人员">
                </el-table-column>
                <el-table-column
                  prop="supplier_money"
                  width="100"
                  label="供应商余额">
                </el-table-column>
                <el-table-column
                  prop="contact_way"
                  label="业务类型">
                </el-table-column>
                <el-table-column
                  prop="delvery_way"
                  label="发货方式">
                </el-table-column>
                <el-table-column
                  prop="bus_type"
                  label="业务类型">
                </el-table-column>
                <el-table-column
                  prop="pay_way"
                  label="付款方式">
                </el-table-column>
                <el-table-column
                  prop="descr"
                  label="说明">
                </el-table-column>
                <el-table-column
                  prop="fare"
                  label="运费">
                </el-table-column>
                <el-table-column
                  prop="create_person"
                  label="制单人">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  label="制单时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="audit_person"
                  label="审核人">
                </el-table-column>
                <el-table-column
                  prop="audit_time"
                  label="审核时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="modify_person"
                  label="修改人">
                </el-table-column>
                <el-table-column
                  prop="modify_time"
                  label="修改时间"
                  width="180">
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-dialog :visible.sync="isDialog" width="1000px">
      <srockDiag></srockDiag>
    </el-dialog>
    <el-dialog :visible.sync="isDiagAog" width="500px">
      <el-form :rules="DiagAOGDataRules" :model="DiagAOGData" ref="isDiagAogRef" label-width="100px">
        <el-form-item label="ID" prop="id">
          <span>{{DiagAOGData.id}}</span>
        </el-form-item>
        <el-form-item label="入库单号" prop="in_code">
          <span>{{DiagAOGData.in_code}}</span>
        </el-form-item>
        <el-form-item label="入库日期" prop="in_day">
          <el-date-picker v-model="DiagAOGData.in_day" value-format="yyyy-mm-dd" type="date"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="入库数量" prop="in_num">
          <el-input v-model="DiagAOGData.in_num"></el-input>
        </el-form-item>
        <el-form-item label="入库金额" prop="in_money">
          <el-input v-model="DiagAOGData.in_money"></el-input>
        </el-form-item>
        <el-form-item label="入库备注" prop="in_remark">
          <el-input v-model="DiagAOGData.in_remark"></el-input>
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button type="primary" @click="isDiagAog=false">取消</el-button>
            <el-button type="success" @click="ConfirmAog(DiagAOGData)">确定</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {GetOrderListData, GetQueryIdOrder, TableAffirm, AOGAffirm} from '@/api/StockOrderMang.js';
  import srockDiag from './stockReportFrom.vue'
  import store from '@/store/index.js'

  export default {
    components: {srockDiag},
    created() {
      this.TableListData();
    },
    data() {
      return {
        DiagAOGData: {
          id: "",
          in_code: '',
          in_day: undefined,
          in_num: "",
          in_money: "",
          in_remark: '',
        },
        DiagAOGDataRules: {
          in_day: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          in_num: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          in_money: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          in_remark: [
            {required: true, message: '必填', trigger: 'change'}
          ],
        },
        isDiagAog: false,
        pageId: undefined,
        isDialog: false,
        TableList: [],
        Pagetotal: 0,
        QueryData: {
          page: 1,
          size: 10
        },
        TableLoading: false,
      }
    },
    methods: {
      ConfirmAog(data) {
        this.$refs['isDiagAogRef'].validate((valid) => {
          if (valid) {
            AOGAffirm(this.DiagAOGData).then((res) => {
              console.log(res)
            })
          }
        })
      },
      AffirmAoG(data) {
        var date = new Date();
        var Ontime = date.getFullYear().toString() + date.getMonth().toString()
          + date.getDay().toString() + date.getHours().toString()
          + date.getMinutes().toString() + date.getSeconds().toString()
        var Listdata = {
          id: data.row.id,
          in_code: Ontime,
        }
        this.DiagAOGData.id = data.row.id
        this.DiagAOGData.in_code = data.row.buy_code
        this.isDiagAog = true
      },
      AffirmOrder(data) {
        var id = data.row.id
        var person = this.$store.getters.introduction
        TableAffirm(id, person).then((res) => {
          console.log(res)
        })
      },
      QueryIdOrder() {
        this.TableLoading = true
        var data;
        if (this.pageId == "" || this.pageId == undefined || this.pageId == undefined) {
          this.TableListData()
        } else {
          data = this.pageId
        }
        console.log(this.$store.getters.introduction)
        GetQueryIdOrder(data).then((res) => {
          this.TableList = res.data.data
          this.TableLoading = false
        })
      },
      isClickDiag() {
        this.isDialog = true
      },
      TableListData() {
        GetOrderListData(this.QueryData.page, this.QueryData.size).then((res) => {
          this.TableList = res.data.data.rows
          this.total = res.data.total
          this.TableLoading = false
        })
      }
    }
  }
</script>

<style>
  .TableCss {
    height: 1000px;
  }
</style>
