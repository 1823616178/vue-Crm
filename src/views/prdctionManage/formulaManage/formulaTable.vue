<template>
  <div>
    <ve-tree :data="chartData"
             :settings="chartSettings"
             :extend='extend'
             :events="chartEvents"/>

    <div class="components-container">
      <split-pane split="vertical"
                  @resize="resize"
                  :min-percent='0'
                  :max-percent='80'
                  :default-percent='20'>
        <template slot="paneL">
          <div class="left-container verticaloverflow">
            <div style="text-align: center;font-size: 150%;margin-top: 15px"><label>产品列表</label></div>
            <div v-for="(item,index) in formulaList"
                 :key="item.ROW_NUMBER"
                 style="margin-top: 5px;text-align: center;">
              <el-row type="flex"
                      justify="center"
                      align="center">
                <el-col :span="22"
                        class="text-center">
                  <div class="pan-btn blue-btn PeiFCss"
                       @click="formulaDetail(index)">产品名称：{{item.cInvName}}<br>
                  </br>规格：{{item.cInvStd}}
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div class="right-container verticaloverflow demo-dynamic">
            <el-row :gutter="150" type="flex" align="middle" justify="center">
              <el-col :span="24">
                <el-row type="flex" align="middle" justify="center">
                  <h1 style="line-height: 2px">配方管理</h1>
                </el-row>
                <el-button type="primary" style="margin-bottom: 20px;" v-show="isAddRecipe" @click="addRecipe">添加配方
                </el-button>
                <el-table
                  @row-dblclick="GetDetail($event)"
                  :data="tableData"
                  height="250"
                  border
                  :row-class-name="tableRowClassName"
                  style="width: 100%">
                  <el-table-column
                    prop="id"
                    label="序号"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="number"
                    label="编号"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="Name"
                    label="名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="CreatDate"
                    label="启用时间">
                    <template slot-scope="scope">
                      <span>{{ scope.row.CreatDate | parseTime('{y}-{m}-{d}') }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="StopDate"
                    label="停用时间">
                    <template slot-scope="scope">
                      <span>{{ scope.row.StopDate | parseTime('{y}-{m}-{d}') }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button @click="delateClick(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <Formula @channgeDataList="channgeDataList" style="margin-top: 20px;" :DataList="DataList"
                         :formulaList="formulaList" :tableDataIndex="tableDataIndex" :isSelect="isSelect"
                         :productIndex="productIndex"></Formula>
              </el-col>
            </el-row>
          </div>
        </template>
        <!-- </el-dialog> -->
      </split-pane>

    </div>
    <el-dialog :visible.sync="newAddDialog"
               title='增加配方'
               width="30%"
    >
      <el-form
        :model="newDiageAdd"
        :rules="editrule2"
        ref="newDiageAdd"
        label-width="80px"
        label-position="left">
        <el-form-item label="启用时间" prop="CreatDate">
          <el-date-picker type="date" v-model="newDiageAdd.CreatDate"
                          placeholder="启用时间"
                          value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="停用时间" prop="StopDate">
          <el-date-picker type="date" v-model="newDiageAdd.StopDate"
                          placeholder="启用时间"
                          value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input
            v-model="newDiageAdd.Name"
            placeholder="输入"/>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-switch
            v-model="isDelete"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger"
                   @click="newAddDialog=false">{{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary"
                   @click="addNewReciptData(amendFormData)">{{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible"
               title='修改配方'
               width="30%"
    >
      <el-form
        :model="amendFormData"
        :rules="editrule"
        ref="amendFormData"
        label-width="80px"
        label-position="left">
        <el-form-item label="序号">
          {{amendFormData.id}}
        </el-form-item>
        <el-form-item label="编号">
          {{amendFormData.number}}
        </el-form-item>
        <el-form-item label="启用时间" :prop="NewDateTime">
          <el-date-picker type="date" value-format="yyyy:MM:dd" v-model="NewDateTime" placeholder="启用时间"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            v-model="amendFormData.Name"
            placeholder="输入角色名"/>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-switch
            v-model="isDelete"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger"
                   @click="dialogVisible=false">{{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary"
                   @click="confirmRole(amendFormData)">{{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SectionPan from './components/sectionPanle.vue'
  import Formula from './components/formula.vue'
  import {parseTime} from '@/utils/index.js'
  // import { fetchList } from '@/api/article'
  import {querySaleOrder, getOrderList, getFormulaList, getOneFormula, updateFormula} from '@/api/mock'
  import {
    ProductClass,
    QueyProduct,
    QueryRepicList,
    upRepicList,
    newDiageAdd,
    getRecipeDetail,
    delateClick
  } from '@/api/article'
  import splitPane from 'vue-splitpane'
  import Kanban from '@/components/Kanban'
  import Pagination from '@/components/Pagination'
  import {constants} from 'fs';
  import {GetTreeList} from '@/api/article.js'

  export default {
    components: {Pagination, SectionPan, splitPane, Kanban, Formula},

    data() {
      var self = this
      this.chartEvents = {
        click: function (e) {
          console.log(e)
          self.name = e.name
          self.ClickProubectData(e)
        }
      };
      this.RecpieList = [];
      this.chartSettings = {
        seriesMap: {
          tree1: {
            orient: 'vertical'
          }
        }
      }
      return {
        NewRepiceStopTimeDate: undefined,
        NewRepicCreatDate: undefined,
        DataList: [],
        newDiageAdd: {
          id: "",
          CreatDate: new Date(),
          StopDate: new Date(),
          Name: '',
          isDefault: false
        },
        NewDateTime: undefined,
        newAddDialog: false,
        amendFormData: {
          id: "",
          a: undefined,
          Name: '',
          isDefault: false
        },
        editrule: {
          a: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ]
        },
        editrule2: {
          CreatDate: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ],
          StopDate: [
            {required: true, message: '请选择日期', trigger: 'blur'}
          ],
          Name: [
            {required: true, message: '请填写名称', trigger: 'blur'}
          ]
        },
        isAddRecipe: false,
        isDelete: false,
        productIndex: {},
        dialogVisible: false,
        Pageswitch: undefined,
        chartData: {
          columns: ['name', 'value'],
          rows: [
            {
              name: 'tree1',
              value: [],
            }
          ]
        },
        extend: {
          textStyle: {
            color: '#DAA520',
            fontSize: 12,
            fontWeight: 'bold',
          },
          series: {
            // symbolSize: 10,
            symbol: 'roundRect',
            symbolSize: [70, 50],
            itemStyle: {
              shadowColor: "#8FBC8F",
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              shadowBlur: 10,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgb(135,206,250)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgb(	0,191,255)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              borderColor: "#3CB371"
            },
            label: {
              normal: {
                show: true
              }
            }
          }
        },
        batch2: true,
        totalData: 0,
        listData: null,
        total: 0,
        tableData: [],
        tableDataIndex: {},
        isSelect: false,
        // key: 1, // table key
        // formTheadOptions: ['apple', 'banana', 'orange'],
        // checkboxVal: defaultFormThead, // checkboxVal
        // formThead: defaultFormThead // 默认表头 Default header
        listQuery: {
          page: 1,
          limit: 10,
          // customerServ: undefined,
          // customerName: undefined,
          // payCondition: undefined,
          // sendExpress: undefined,
          // customerFaith: undefined,
          // sort: '+id',
          formulaId: undefined,
        },
        temp: {},
        showData: {
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
          "remark": "-----",
        },
        editData: {},
        options: {
          group: 'mission',
          animation: 300,
          dragClass: "oNdragClass",
          sort: true,
          disabled: false
        },
        list1: [],
        list2: [],
        list3: [],
        formulaList: [],
        dialogTableVisible: false,
        canEdit: true,
        formLabelWidth: "120px",
      };
    },

    computed: {
      test() {
        return 1;
      }
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(
          i => valArr.indexOf(i) >= 0
        );
        this.key = this.key + 1; // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
      }
    },

    created() {
      // this.getData();
      this.getTreeList();
    },
    methods: {
      channgeDataList() {
        getRecipeDetail(this.tableDataIndex).then((res) => {
          this.DataList = res.data
          this.$notify({
            message:"添加成功"
          })
        })
      },
      delateClick(data) {
        delateClick(data).then((res) => {
          if (res) {
            QueryRepicList(this.formulaList[this.productIndex]).then((ress) => {
              this.tableData = ress.data
            })
          }

        })
      },
      GetDetail(data) {
        this.tableDataIndex = data
        this.isSelect = true
        getRecipeDetail(data).then((res) => {
          this.DataList = res.data
        })
      },
      addNewReciptData(data) {
        this.$refs['newDiageAdd'].validate((valid) => {
          if (valid) {
            newDiageAdd(this.productIndex, this.newDiageAdd, this.isDelete, this.formulaList[this.productIndex], this.ListData).then(ress => {
              this.newAddDialog = false;
              this.$refs['newDiageAdd'].resetFields()
              QueryRepicList(this.formulaList[this.productIndex]).then((res) => {
                this.tableData = res.data
                this.$notify({
                  message:"添加成功",
                  type:"success"
                })
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }

        })
      },
      addRecipe() {
        console.log(this.productIndex)
        this.newAddDialog = true
      },
      confirmRole(data) {
        this.$refs['amendFormData'].validate((valid) => {
          if (valid) {
            this.amendFormData.a = this.NewDateTime
            upRepicList(this.formulaList[this.productIndex], data, this.isDelete).then((res) => {
              this.dialogVisible = false
              QueryRepicList(this.formulaList[this.productIndex]).then((ress) => {
                this.tableData = ress.data
                this.$notify({
                  message: '更新成功',
                  type: 'success'
                })
              })
            })
          }
        })
      },
      handleClick(data) {
        var time = +data.CreatDate
        var date = new Date(time * 1000)
        var tim = parseTime(time)
        var arr = tim.slice(0, 10)
        console.log(arr)
        this.dialogVisible = true
        this.amendFormData = data
        this.NewDateTime = arr
        this.isDelete = !data.isDelete

      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      ClickProubectData(e) {
        let data = {
          id: e.data.value
        }
        this.ListData = e.data.value
        QueyProduct(data).then((res) => {
          this.formulaList = res.data
        })
      },
      getTreeList() {
        ProductClass().then((res) => {
          console.log(res.data)
          this.chartData.rows[0].value = [res.data]
        })
      },
      cancelUpdate(index) {
        this.dialogTableVisible = false;
        var temp = this.formulaList[index];
        Object.assign(this.editData, temp);
      },
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateFormula(this.editData).then(response => {

              this.dialogTableVisible = false;
              this.getData();
              this.formulaDetail(this.editData.index);
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      editFormula() {
        console.log(this.editData);
        this.dialogTableVisible = true;
      },
      resize() {
        console.log('resize')
      },
      formulaDetail(index) {
        this.isSelect = false;
        this.isAddRecipe = true
        this.productIndex = index
        QueryRepicList(this.formulaList[index]).then((res) => {
          this.tableData = res.data
        })
        // this.editData.index = index;
        // this.canEdit = false;
      },
      // getData() {
      //   getFormulaList().then(response => {
      //     this.formulaList = response.data.data;
      //     this.total = response.data.data.length;
      //   });
      //   getFormulaList().then(response => {
      //     this.list1 = response.data.data;
      //   });
      // },
      Onchange(value) {
        if (value === true) {
          this.batch2 = false
        } else {
          this.batch2 = true
        }
      },
      handleDelete(index, row) {
        row.splice(index, 1);
      },
      handleDetail(row) {
        this.temp = Object.assign({}, row) // copy obj
        console.log(row.orderId);
        this.dialogTableVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm']
        })
      },

      handleFilter() {
        querySaleOrder(this.listQuery).then(response => {
          this.listData = response.data.items
          this.total = this.listData.length
          console.log(this.tableData)
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
<style>
  .pan-btn {
    position: relative;
    float: left;
    width: 100%;
  }

  .el-table .warning-row {
    background: bottom;
  }

  .el-table .success-row {
    background: bottom;
  }
</style>

