<template>
  <div class="components-container">
    <split-pane split="vertical"
                @resize="resize"
                :min-percent='0'
                :max-percent='80'
                :default-percent='20'>
      <template slot="paneL">
        <div class="left-container verticaloverflow">
          <div style="text-align: center;font-size: 150%;margin-top: 15px"><label>配方列表</label></div>
          <div v-for="(item,index) in oneDetailData"
               :key="index"
               style="margin-top: 5px;text-align: center;">
            <el-row type="flex"
                    justify="center"
                    align="center">
              <el-col :span="22"
                      class="text-center">
                <div class="pan-btn blue-btn PeiFCss"
                     @click="formulaDetail(item.formulaId)">{{item.formulaName}}</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
      <!-- <el-dialog visible.sync="true"> -->
      <template slot="paneR">
        <div class="right-container verticaloverflow demo-dynamic">
          <el-form :model="this.temp"
                   style="width: 70%; padding:20px">
            <el-row :gutter="150">
              <el-col :span="10">
                <el-form-item :label="$t('formulaTable.formulaName')">:
                  {{temp.formulaName}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.formulaId')">:
                  {{temp.formulaId}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.goods')">:
                  {{temp.goods}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.createTime')">:
                  {{temp.createTime}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.createPeop')">:
                  {{temp.createPeop}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.stopTime')">:
                  {{temp.stopTime}}
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item :label="$t('formulaTable.stopPeop')">:
                  {{temp.stopPeop}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.updateTime')">:
                  {{temp.updateTime}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.updatePeop')">:
                  {{temp.updatePeop}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.level')">:
                  {{temp.level}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.defaultVal')">:
                  {{temp.defaultVal}}
                </el-form-item>
                <el-form-item :label="$t('formulaTable.remark')">:
                  {{temp.remark}}
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                             @click="editFormula(temp)"
                             :disabled="canEdit">{{$t('table.edit')}}</el-button>

                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </div>
      </template>
      <!-- </el-dialog> -->
    </split-pane>
    <template>
      <el-dialog :title="$t('table.edit')"
                 :visible.sync="dialogTableVisible"
                 label-width="100px">
        <!-- <div class="grid-content bg-purple"> -->
        <el-form :model="this.temp"
                 ref="formulaForm"
                 :rules="rules"
                 style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('formulaTable.formulaName')"
                        prop="formulaName">
            <el-input v-model="temp.formulaName" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.formulaId')">
            </br>
            {{temp.formulaId}}
          </el-form-item>
          <el-form-item :label="$t('formulaTable.goods')"
                        prop="goods">
            <el-input v-model="temp.goods" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.createTime')"
                        prop="createTime">
            <el-date-picker v-model="temp.createTime" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.createPeop')"
                        prop="createPeop">
            <el-input v-model="temp.createPeop" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.stopTime')"
                        prop="stopTime">
            <el-date-picker v-model="temp.stopTime" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.stopPeop')"
                        prop="stopPeop">
            <el-input v-model="temp.stopPeop" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.updateTime')"
                        prop="updateTime">
            <el-date-picker v-model="temp.updateTime" type="datetime" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.updatePeop')"
                        prop="updatePeop">
            <el-input v-model="temp.updatePeop" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.defaultVal')"
                        prop="defaultVal">
            <el-input v-model="temp.defaultVal" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.level')"
                        prop="level">
            <el-input v-model.number="temp.level" />
          </el-form-item>
          <el-form-item :label="$t('formulaTable.remark')"
                        prop="remark">
            <el-input v-model="temp.remark" />
          </el-form-item>
          <div slot=""
               class="dialog-footer">
            <el-form-item>
              <el-button @click="dialogTableVisible = false">{{$t('permission.cancel')}}</el-button>
              <el-button type="primary"
                         @click="updateData('formulaForm')">{{$t('permission.confirm')}}</el-button>
            </el-form-item>
          </div>
        </el-form>
        <!-- </div> -->
      </el-dialog>
    </template>
  </div>
</template>

<script>
import SectionPan from './components/sectionPanle.vue'
// import { fetchList } from '@/api/article'
import { querySaleOrder, getOrderList, getFormulaList, queryOneFormula } from '@/api/mock'
import splitPane from 'vue-splitpane'
import Kanban from '@/components/Kanban'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination, SectionPan, splitPane, Kanban },
  data () {
    this.colConfigs = [
      { prop: "formulaName", label: "配方名称" },
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
      batch2: true,
      totalData: 0,
      listData: null,
      total: 0,
      tableData: [],

      // key: 1, // table key
      // formTheadOptions: ['apple', 'banana', 'orange'],
      // checkboxVal: defaultFormThead, // checkboxVal
      // formThead: defaultFormThead // 默认表头 Default header
      rules: {
        formulaName: [
          { required: true, message: '请输入配方名称', trigger: 'blur' },
        ],
        goods: [
          { required: true, message: '请选择对应产品', trigger: 'change' }
        ],
        createPeop: [
          { required: true, message: '请输入创建人', trigger: 'change' }
        ],
        stopPeop: [
          { required: true, message: '请输入停止人', trigger: 'change' }
        ],
        updatePeop: [
          { required: true, message: '请输入更新人', trigger: 'change' }
        ],
        defaultVal: [
          { required: true, message: '请输入默认选用值', trigger: 'change' }
        ],
        level: [
          { type: 'number', required: true, message: '请输入配方等级', trigger: 'change' }
        ],
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
      temp: {
        "formulaName": "-----",
        "formulaId": "-----",
        "goods": "-----",
        "createTime": "-----",
        "createPeop": "-----",
        "stopTime": "-----",
        "stopPeop": "-----",
        "updateTime": "-----",
        "updatePeop": "-----",
        "level": "-----",
        "defaultVal": "-----",
        "remark": "-----"
      },
      options: {
        group: 'mission',
        animation: 300,
        dragClass: "oNdragClass",
        sort: true,
        disabled: false
      },
      list1: [],
      list2: [
      ],
      list3: [
      ],
      oneDetailData: [],
      dialogTableVisible: false,
      canEdit: true,
    };
  },

  watch: {
    checkboxVal (valArr) {
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i) >= 0
      );
      this.key = this.key + 1; // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  created () {
    this.getData();
  },
  methods: {

    updateData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogTableVisible = false;
          console.log(this.temp);
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
    editFormula (temp) {
      this.temp = temp;
      this.dialogTableVisible = true;
    },
    resize () {
      console.log('resize')
    },
    formulaDetail (id) {
      // dialogTableVisible = true;
      queryOneFormula().then(response => {
        // dialogTableVisible = true;
        console.log(id);
        this.temp = response.data.data;
        this.canEdit = false;
      })
    },
    getData () {
      getFormulaList().then(response => {
        this.oneDetailData = response.data.data;
        this.total = response.data.data.length
        console.log(response);
        console.log("test" + this.oneDetailData.length);
      })
      console.log("test");
    },
    Onchange (value) {
      if (value === true) {
        this.batch2 = false
      } else {
        this.batch2 = true
      }
    },
    handleDelete (index, row) {
      row.splice(index, 1);
    },
    handleDetail (row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(row.orderId);
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm']
      })
    },

    handleFilter () {
      querySaleOrder(this.listQuery).then(response => {
        this.listData = response.data.items
        this.total = this.listData.length
        console.log(this.tableData)
      })
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
<style>
.pan-btn {
  position: relative;
  float: left;
  width: 100%;
}
</style>

