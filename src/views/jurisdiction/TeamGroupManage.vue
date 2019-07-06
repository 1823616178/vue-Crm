<template>
  <div>
    <el-row type="flex" align="middle" justify="center" style="margin-top:20px">
      <el-col :span="22">
        <el-button type="success" @click="AddManageDiag">新增班组</el-button>
        <el-table stripe :data="ManageListData">
          <el-table-column v-for="(item,index) in ManageTable"
                           :key="index"
                           :prop="item.prop"
                           :label="item.label">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="IsClickDelect(scope)">删除</el-button>
            </template>

          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog width="500px" :visible.sync="IsSelectPoint">
      <el-form ref="GroupForm" :rules="TeamGroupDataRules" :model="TeamGroupData" label-width="80px">
        <el-form-item label="班组名称" prop="name">
          <el-input v-model="TeamGroupData.name"></el-input>
        </el-form-item>
        <el-form-item label="大杠范围">
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="10">
              <el-input v-model="TeamGroupData.scopeMin"></el-input>
            </el-col>
            <el-col :span="3">{{"————"}}</el-col>
            <el-col :span="10">
              <el-input v-model="TeamGroupData.scopeMax"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="所属部门" prop="point">
          <el-select v-model="TeamGroupData.point" placeholder="请选择">
            <el-option v-for="(item,index) in SelectPoint"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button type="info" @click="IsSelectPoint=false">取消</el-button>
            <el-button type="primary" @click="AddManageList(scope)">确认</el-button>
          </template>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import {AddNewGroup, GetGroupManage, DeleteGroupList} from '@/api/article.js'

  export default {
    name: "TeamGroupManage",

    data() {
      this.ManageTable = [
        {prop: "id", label: "序号"},
        {prop: "group_id", label: "班组编号"},
        {prop: "group_name", label: "班组名称"},
        {prop: "group_Maxscope", label: "大杠范围(最大)"},
        {prop: "group_Minscope", label: "大杠范围(最小)"},
        {prop: "group_point", label: "所属部门"},
        {prop: "groupCode", label: "班组编号"},
      ];
      return {
        PageQuery: {
          page: 1,
        },
        TeamGroupData: {
          name: "",
          scopeMax: '',
          scopeMin: '',
          point: ''
        },
        TeamGroupDataRules: {
          point: [{required: true, message: '必填', trigger: 'blur'}],
        },
        IsSelectPoint: false,
        SelectPoint: [],
        ManageListData: [],
        ManageTotal: undefined,
      }
    },
    created() {
      this.getListData()
    },
    methods: {
      IsClickDelect(data) {
        var query = {
          id: data.row.id
        }
        DeleteGroupList(query).then((res) => {
          this.getListData()
        })
      },
      getListData() {
        GetGroupManage(this.PageQuery).then((res) => {
          this.ManageListData = res.data.data;
          this.ManageTotal = res.data.total;
          this.SelectPoint = res.data.select
        })
      },
      AddManageDiag() {
        this.IsSelectPoint = true;
      },
      AddManageList(data) {
        this.$refs['GroupForm'].validate((vaile) => {
          if (this.TeamGroupData.scopeMin > this.TeamGroupData.scopeMax) {
            this.$message("请检查区间")
          } else {
            if (vaile) {
              AddNewGroup(this.TeamGroupData).then((res) => {
                this.$refs['GroupForm'].resetFields();
                this.$notify({
                  message: "添加成功"
                });
                this.IsSelectPoint = false;
                this.getListData()
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
