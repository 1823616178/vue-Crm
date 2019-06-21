<template>
  <div class="app-container">
    <el-button type="primary"
               @click="handleAddRole">{{ $t('permission.addRole') }}
    </el-button>

    <el-table :data="rolesList"
              style="width: 100%;margin-top:30px;"
              border>
      <el-table-column align="center"
                       label="用户id"
                       width="220">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center"
                       label="用户名"
                       width="220">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column align="header-center"
                       label="密码">
        <template slot-scope="scope">{{ scope.row.password }}</template>
      </el-table-column>
      <el-table-column align="header-center"
                       label="个性名称">
        <template slot-scope="scope">{{ scope.row.describe }}</template>
      </el-table-column>
      <el-table-column align="header-center"
                       label="权限">
        <template slot-scope="scope">{{ scope.row.role }}</template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     @click="handleEdit(scope)">{{ $t('permission.editUser') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible"
               v-loading="RuleLoading"
               :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role"
               label-width="80px"
               label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="role.username"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="role.password"
                    type="textarea"/>
        </el-form-item>
        <el-form-item label="个性名称">
          <el-input v-model="role.describe"
                    type="textarea"/>
        </el-form-item>
        <el-form-item label="选择权限">
          <el-select v-model="rolevalue" placeholder="请选择">
            <el-option
              v-for="(item,index) in roleOption"
              :key="index"
              :label="item.describe"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger"
                   @click="dialogVisible=false">{{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary"
                   @click="confirmRole">{{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import path from 'path'
  import {deepClone} from '@/utils'
  import {
    getRoutesTest,
    getRoutes,
    addRolelocalHost,
    upDataRoleLocalHost,
    deleteRoleslocalHost,
    GetRoleRUle,
    GetUserInfogroup,
    getUserPeopleInfo,
    UpUserEditorRole,
    addNewRole
  } from '@/api/role'
  import i18n from '@/lang'
  import {type} from 'os';

  const defaultRole = {
    roles: '',
    describe: '',
    description: '',
    routes: []
  }

  export default {
    data() {
      return {
        RuleLoading: false,
        selectRole: [
          {label: 'admin', value: "admin"},
          {label: 'editor', value: "editor"},
        ],
        rolevalue: '',
        roleOption: [],
        Userid: undefined,
        role: Object.assign({}, defaultRole),
        routes: [],
        rolesList: [],
        dialogVisible: false,
        dialogType: 'new',
        checkStrictly: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    computed: {},
    created() {
      // Mock: get all routes and roles list from server
      this.getRoles()
    },
    methods: {
      async getRoles() {
        const res = await GetUserInfogroup()
        this.rolesList = res.data
      },
      // Reshape the routes structure so that it looks the same as the sidebar
      handleAddRole() {
        this.role = Object.assign({}, defaultRole)
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedNodes([])
        }
        this.dialogType = 'new'
        this.dialogVisible = true
      },
      handleEdit(scope) {

        this.dialogType = 'edit'
        this.dialogVisible = true
        this.checkStrictly = true
        this.role = deepClone(scope.row)
        this.Userid = scope.row.id
        this.RuleLoading = true;
        getUserPeopleInfo(this.Userid).then((res) => {
          this.RuleLoading = false
          this.data = res.data.user
          this.roleOption = res.data.role
          console.log(this.roleOption)
          this.role = deepClone(this.data.user)
          this.checkStrictly = false
        })

      },
      handleDelete({$index, row}) {
        this.$confirm('确定删除?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await deleteRoleslocalHost({id: row.id})
            this.rolesList.splice($index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            window.console.error(err)
          })
      },
      async confirmRole() {
        const isEdit = this.dialogType === 'edit'
        var data = {
          role: this.rolevalue,
          id: this.Userid
        }
        if (isEdit) {
          await UpUserEditorRole(data).then((res) => {
            console.log(res)
          })
          // for (let index = 0; index < this.rolesList.length; index++) {
          //   if (this.rolesList[index].roles === this.role.roles) {
          //     this.rolesList.splice(index, 1, Object.assign({}, this.role))
          //     break
          //   }
          // }
          this.dialogVisible = false
          window.reload()
        } else {
          await addRolelocalHost(this.role)
          // this.role.key = data
          this.rolesList.push(this.role)
        }
      },
      // reference: src/view/layout/components/Sidebar/SidebarItem.vue
      onlyOneShowingChild(children = [], parent) {
        let onlyOneChild = null
        const showingChildren = children.filter(item => !item.hidden)

        // When there is only one child route, the child route is displayed by default
        if (showingChildren.length === 1) {
          onlyOneChild = showingChildren[0]
          onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
          return onlyOneChild
        }

        // Show parent if there are no child route to display
        if (showingChildren.length === 0) {
          onlyOneChild = {...parent, path: '', noShowingChildren: true}
          return onlyOneChild
        }

        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }

    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
