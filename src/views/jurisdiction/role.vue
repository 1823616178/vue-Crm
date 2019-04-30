<template>
  <div class="app-container">
    <el-button type="primary"
               @click="handleAddRole">{{ $t('permission.addRole') }}</el-button>

    <el-table :data="rolesList"
              style="width: 100%;margin-top:30px;"
              border>
      <el-table-column align="center"
                       label="权限"
                       width="220">
        <template slot-scope="scope">{{ scope.row.roles }}</template>
      </el-table-column>
      <el-table-column align="center"
                       label="角色"
                       width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center"
                       label="描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     @click="handleEdit(scope)">{{ $t('permission.editPermission') }}</el-button>
          <el-button type="danger"
                     size="small"
                     @click="handleDelete(scope)">{{ $t('permission.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible"
               :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role"
               label-width="80px"
               label-position="left">
        <el-form-item label="角色">
          <el-input v-model="role.name"
                    placeholder="输入姓名" />
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="role.roles"
                     placeholder="选择权限">
            <el-option v-for="(item,index) in selectRole"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="role.description"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea"
                    placeholder="权限描述" />
        </el-form-item>
        <el-form-item label="路由">
          <el-tree ref="tree"
                   :check-strictly="checkStrictly"
                   :data="routesData"
                   :props="defaultProps"
                   show-checkbox
                   node-key="path"
                   class="选择路由" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger"
                   @click="dialogVisible=false">{{ $t('permission.cancel') }}</el-button>
        <el-button type="primary"
                   @click="confirmRole">{{ $t('permission.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutesTest, getRoutes, addRolelocalHost, upDataRoleLocalHost, deleteRoleslocalHost } from '@/api/role'
import i18n from '@/lang'
import { type } from 'os';

const defaultRole = {
  roles: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data () {
    return {
      selectRole: [
        { label: 'admin', value: "admin" },
        { label: 'editor', value: "editor" },
      ],
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
  computed: {
    routesData () {
      return this.routes
    }
  },
  created () {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes () {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    async getRoles () {
      const res = await getRoutesTest()
      this.rolesList = res.data
    },
    i18n (routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes (routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr (routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole () {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit (scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete ({ $index, row }) {
      console.log(row)
      this.$confirm('确定删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRoleslocalHost({ id: row.id })
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { window.console.error(err) })
    },
    generateTree (routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole () {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        await upDataRoleLocalHost(this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].roles === this.role.roles) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        await addRolelocalHost(this.role)
        // this.role.key = data
        this.rolesList.push(this.role)
      }

      const { description, roles, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>权限: ${roles}</div>
            <div>角色: ${name}</div>
            <div>描述: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild (children = [], parent) {
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
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
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
