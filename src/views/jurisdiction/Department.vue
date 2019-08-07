<template>
    <div class="app-container">
        <el-card style="margin-bottom: 10px">
            <span>一个微信号对应一个用户，请不要重复选择，如果一个微信对应两个用户，将会识别为名字排序靠前的用户</span>
        </el-card>
        <el-button type="primary"
                   @click="handleAddRole">新增用户
        </el-button>

        <el-table :data="rolesList"
                  style="width: 100%;margin-top:30px;"
                  border>
            <el-table-column align="center"
                             label="用户id"
                             width="100">
                <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="用户名"
                             width="200">
                <template slot-scope="scope">{{ scope.row.username }}</template>
            </el-table-column>
            <el-table-column align="header-center"
                             label="密码">
                <template slot-scope="scope">{{ scope.row.password }}</template>
            </el-table-column>
            <el-table-column align="header-center"
                             label="Email">
                <template slot-scope="scope">{{ scope.row.Email }}</template>
            </el-table-column>
            <el-table-column align="header-center"
                             label="真实名字"
                             width="100">
                <template slot-scope="scope">{{ scope.row.introduction }}</template>
            </el-table-column>
            <el-table-column align="header-center"
                             label="权限"
                             width="80px">
                <template slot-scope="scope">{{ scope.row.role }}</template>
            </el-table-column>
            <el-table-column align="header-center"
                             label="所属部门">
                <template slot-scope="scope">{{ scope.row.DepartName }}</template>
            </el-table-column>
            <el-table-column align="header-center"
                             label="电话号码"
                             width="120px">
                <template slot-scope="scope">{{ scope.row.PhoneNumber }}</template>
            </el-table-column>
            <el-table-column label="绑定微信" header-align="center" align="center" prop="WeChatId">
                <template slot-scope="scope">
                    {{scope.row.WeChatId}}
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
                <template slot-scope="scope">
                    <el-button type="primary"
                               size="small"
                               @click="handleEdit(scope)">{{ $t('permission.editUser') }}
                    </el-button>
                    <el-button
                            type="danger"
                            size="small"
                            @click="DeleteUser(scope)">删除用户

                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                background
                layout="prev, pager, next"
                :total="pageTotal"
                :current-page.sync="pageSize"
                @current-change='getRoles'>
        </el-pagination>

        <el-dialog :visible.sync="dialogVisible"
                   v-loading="RuleLoading"
                   width="500px"
                   :title="dialogType==='edit'?'Edit Role':'New Role'">
            <el-form :model="role"
                     ref="FormData"
                     :rules="routeForm"
                     label-width="80px"
                     label-position="left">
                <el-form-item label="用户名"
                              prop="username">
                    <el-input v-model="role.username"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="role.password"
                              type="password"/>
                </el-form-item>
                <el-form-item label="真实名字" prop="introduction">
                    <el-input v-model="role.introduction"/>
                </el-form-item>
                <el-form-item label="手机号码" prop="PhoneNumber">
                    <el-input v-model="role.PhoneNumber"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="Email">
                    <el-input v-model="role.Email"/>
                </el-form-item>
                <el-form-item label="用户角色" prop="rolevalue">
                    <el-select v-model="role.rolevalue" placeholder="请选择">
                        <el-option
                                v-for="(item,index) in roleOption"
                                :key="index"
                                :label="item.describe"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属部门" prop="Depart">
                    <el-select v-model="role.Depart" placeholder="请选择">
                        <el-option
                                v-for="(item,index) in DepartOption"
                                :key="item.id"
                                :label="item.SectionName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="綁定微信" prop="WeChatId">
                    <span>{{role.WeChatId}}</span>
                    <el-button type="warning" icon="el-icon-star-off" circle
                               @click="UserDrawerDaiag = true"></el-button>
                </el-form-item>
            </el-form>

            <el-drawer
                    style="overflow: auto"
                    title="选择用户"
                    :visible.sync="UserDrawerDaiag"
                    direction="ttb">
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="22">
                        <el-table :data="UserDrawerData">
                            <el-table-column v-for="(item,index) in BindingUserWeChat" :key="index" :label="item.label"
                                             :prop="item.prop"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button type="success" icon="el-icon-s-opportunity" circle
                                               @click="confirmData(scope)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-drawer>
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
        addNewRole,
        AddRoleLocalTrue,
        DeleteUserInfo
    } from '@/api/role'
    import i18n from '@/lang'
    import {type} from 'os';

    const defaultRole = {
        username: "",
        password: "",
    }

    export default {
        data() {
            this.BindingUserWeChat = [
                {prop: "id", label: "序号"},
                {prop: "city", label: "地区"},
                {prop: "country", label: "国家"},
                {prop: "nickName", label: "用户名"},
                {prop: "openid", label: "唯一标识"}
            ]
            return {
                UserDrawerData: [],
                pageTotal: 0,
                pageSize: 1,
                RuleLoading: false,
                UserDrawerDaiag: false,
                selectRole: [
                    {label: 'admin', value: "admin"},
                    {label: 'editor', value: "editor"},
                ],
                rolevalue: [],
                roleOption: [],
                Userid: undefined,
                DepartOption: [],
                role: {
                    username: "",
                    password: "",
                    PhoneNumber: 'null',
                    Email: '无Email',
                    Depart: '',
                    rolevalue: '',
                    introduction: '',
                    WeChatId: ""
                },
                routeForm: {
                    username: [{required: true, message: '必填项', trigger: 'change'}],
                    password: [{required: true, message: '必填项', trigger: 'change'}],
                    PhoneNumber: [{required: true, message: '必填项', trigger: 'change'}],
                    Depart: [{required: true, message: '必填项', trigger: 'change'}],
                    rolevalue: [{required: true, message: '必填项', trigger: 'change'}],
                    introduction: [{required: true, message: '必填项', trigger: 'change'}],
                    Email: [{required: true, message: '必填项', trigger: 'change'}],
                },
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
            confirmData(data) {
                console.log(data)
                this.role.WeChatId = data.row.openid
            },
            DeleteUser(data) {
                this.$confirm('确定删除?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async () => {
                        DeleteUserInfo(data.row).then((res) => {
                            if (res.data.code == 1) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                this.getRoles()
                            }
                        })
                    })
                    .catch(err => {
                        window.console.error(err)
                    })
            },
            async getRoles() {
                console.log(this.pageSize)
                var data = {
                    page: this.pageSize
                }

                const res = await GetUserInfogroup(data)
                this.UserDrawerData = res.data.WeiChat
                this.rolesList = res.data.data
                this.roleOption = res.data.role
                this.pageTotal = res.data.total
                this.DepartOption = res.data.Depart
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
                    this.role = deepClone(this.data)
                    this.role.Depart = null
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
                    info: this.role,
                    role: this.role.rolevalue,
                    id: this.Userid
                }
                if (isEdit) {
                    this.$refs['FormData'].validate((valid) => {
                        if (valid) {
                            UpUserEditorRole(data).then((res) => {
                                this.getRoles()
                                this.$message("更新成功")
                            })
                            this.dialogVisible = false
                        }
                    })

                } else {
                    this.$refs['FormData'].validate((valid) => {
                        if (valid) {
                            AddRoleLocalTrue(this.role, this.role.rolevalue).then((res) => {
                                if (res.data.code == 1001) {
                                    this.$message("账号重复")
                                } else {
                                    this.dialogVisible = false
                                    this.getRoles()
                                    this.$message("添加成功 ")
                                }

                            })
                        }
                    })
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
<style>
    .el-drawer__open .el-drawer.ttb {
        overflow: auto;
    }
</style>
