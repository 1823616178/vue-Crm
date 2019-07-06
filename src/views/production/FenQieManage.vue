<template>
  <div>
    <el-row type="flex" align="middle" justify="center" style="margin-top: 20px">
      <el-col :span="22">
        <el-table border :data="FenQieList">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row type="flex"
                      justify="start"
                      style="height: 100%;">
                <el-col :span="24">
                  <div class="BackQie2">
                    <div v-for="(item,index) in props.row.style"
                         :key="index" style="overflow: auto;width: 100%;">
                      <el-row type="flex"
                              justify="center"
                              style="text-align: center;">
                        <div style="height: 100px;width: 50px;background: #0a76a4;line-height: 100px">{{index}}</div>
                        <vueDragInfinite :json="item"
                                         :ratio="5"/>
                      </el-row>
                      <div style="background: #4AB7BD;width: 100%;height: 10px;"></div>
                    </div>
                    <!--  -->
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column v-for="(item,index) in FenQieListData" :key="item.label" :label="item.label"
                           :prop="item.prop">
          </el-table-column>
          <el-table-column label="完工情况杠数" prop="CompleteCase">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.CompleteCase == 0">未完工</el-tag>
              <el-tag type="success" v-if="scope.row.CompleteCase == 1">已完工</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-for="(item,index) in FenQieListData2" :key="item.label" :label="item.label"
                           :prop="item.prop"></el-table-column>
          <el-table-column label="编辑" prop="CompleteCase">
            <template slot-scope="scope">
              <el-button @click="handleUpdate(scope)" type="success" size="mini">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="CompleteCase">
            <template slot-scope="scope">
              <el-button v-if="scope.row.CompleteCase == 1" type="success" size="mini"
                         @click="CompleFunc(scope,'published')">完工
              </el-button>
              <el-button v-if="scope.row.CompleteCase == 0" type="info" size="mini" @click="CompleFunc(scope,'draft')">
                未完工
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" justify="center">
      <el-col :span="5">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagetotal"
          :current-page.sync="QuestsList.page"
          @current-change="ClickCurrect">
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog title="编辑派工单"
               :visible.sync="dialogFormVisible"
               :width="500+'px'">
      <el-form ref="Completionform" :model="CompletionSingle" label-width="80px" :rules="CompletionSingleRules">
        <el-form-item label="杠数" prop="hangval">
          <el-input v-model="CompletionSingle.hangval"></el-input>
        </el-form-item>
        <el-form-item label="生产要求" prop="productclaim">
          <el-input v-model="CompletionSingle.productclaim"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="CompletionSingle.remark"></el-input>
        </el-form-item>
        <el-form-item label="要货时间" prop="gavegoodsdate">
          <el-date-picker v-model="CompletionSingle.gavegoodsdate" type="date" placeholder="选择日期"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="派工时间" prop="dispathDate">
          <el-date-picker v-model="CompletionSingle.dispathDate" type="date" placeholder="选择日期"
                          format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary"
                   @click="updateData()">{{ $t('table.confirm') }}
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import {GetFenQieList, FenQieListFormData, isCompleteSync} from '@/api/FenQieApi.js'
  import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'

  export default {
    components: {vueDragInfinite},
    name: "FenQieManage",
    data() {
      this.FenQieListData = [
        {label: '序号', prop: "id"},
        {label: '派工单', prop: "sCoCOde"},
        {label: '产品编码', prop: "dispathid"},
        {label: '产品名称', prop: "productName"},
        {label: '规格', prop: "spec"},
        {label: '宽度', prop: "width"},
        {label: '杠数', prop: "hangval"},
        {label: '分切长度', prop: "FenQie"},
      ];
      this.FenQieListData2 = [
        {label: '生产要求', prop: "productclaim"},
        {label: '备注', prop: "remark"},
        {label: '要货时间', prop: "gavegoodsdate"},
        {label: '派工时间', prop: "dispathDate"},
      ];
      return {
        dialogFormVisible: false,
        QuestsList: {
          page: 1
        },
        pagetotal: 0,
        FenQieList: [],
        CompletionSingle: {
          id: '',
          hangval: "",
          productclaim: '',
          remark: '',
          gavegoodsdate: '',
          dispathDate: '',
        },
        CompletionSingleRules: {
          hangval: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          productclaim: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          remark: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          gavegoodsdate: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          dispathDate: [
            {required: true, message: '必填', trigger: 'change'}
          ],
        },
      }
    },
    created() {
      this.getFenQieData()
    },
    methods: {
      ClickCurrect() {
        this.getFenQieData()
      },
      CompleFunc(data, data2) {
        console.log(data2)
        var type = undefined;
        if (data2 == 'draft') {
          type = 0
        }
        if (data2 == 'published') {
          type = 1
        }
        var id = data.row.id
        var arr = {
          id,
          type
        }
        isCompleteSync(arr).then((res) => {
          this.getFenQieData()
        })
      },
      updateData() {
        FenQieListFormData(this.CompletionSingle).then((res) => {
          if (res.data.code == 1) {
            this.dialogFormVisible = false
            this.getFenQieData()
          }
        })
      },
      handleUpdate(data) {
        this.CompletionSingle.id = data.row.id
        this.dialogFormVisible = true;
      },
      getFenQieData() {
        GetFenQieList(this.QuestsList).then((res) => {
          this.FenQieList = res.data.data
          this.pagetotal = res.data.total
        })
      }
    }
  }
</script>

<style scoped>

</style>
