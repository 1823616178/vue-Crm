<template>
    <div>
        <el-card shadow="always">
            <el-row type="flex" align="middle" justify="start">
                <el-col :span="3">
                    <el-button @click="AddFromData" type="success">添加业务</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-row type="flex" align="middles" justify="center" style="padding: 10px;">
            <el-col :span="23">
                <el-table :data="FrimTableData" border>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div style="margin-top: 20px;">
                                <el-button @click="AddLog(props)" type="success">新增日志</el-button>
                            </div>

                            <el-timeline style="margin-top: 10px;">
                                <el-timeline-item v-if="props.row.UserLog!==undefined"
                                                  :timestamp="(item.creatDate) +'   '+ item.editorUser"
                                                  placement="top"
                                                  v-for="(item,index) in props.row.UserLog" :key="index">
                                    <el-card>
                                        <h4>日志内容</h4>
                                        <el-input type="textarea" v-model="item.tailLog"></el-input>
                                        <el-button size="mini" type="info" style="margin-top: 10px"
                                                   v-if="item.Logid!==''" @click="reviseContent(item)">修改内容
                                        </el-button>
                                        <el-button size="mini" type="success" style="margin-top: 10px"
                                                   v-else @click="AddLogData(item,props)">添加内容
                                        </el-button>
                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>

                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item,index) in FirmLabelData"
                                     :key="index"
                                     :label="item.label"
                                     :prop="item.prop"
                                     header-align="center"
                                     align="center">

                    </el-table-column>
                    <el-table-column align="center" header-align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="success" size="mini" @click="anmendTableData(scope,1)">修改</el-button>
                            <el-button type="danger" size="mini" @click="anmendTableData(scope,0)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination style="margin-top: 10px;display: flex;justify-content: center;"
                               background
                               layout="prev, pager, next,jumper"
                               :total="PageTotal"
                               :current-page.sync="QueryData.page"
                               @current-change="GetDrawerList">
                </el-pagination>
            </el-col>
        </el-row>


        <el-drawer :visible.sync="drawerSync" direction="ltr" :close-on-press-escape="true"
                   :title="drawerEditorTitle=='editor'?'修改':'新增'">
            <el-form label-width="100px" :model="FirmListData" ref="FrimDataRef" :rules="FirmListDataRule">
                <el-form-item label="公司名称" prop="firmName">
                    <el-input v-model="FirmListData.firmName" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="公司类型" prop="firmType">
                    <el-select v-model="FirmListData.firmType">
                        <el-option v-for="(item,index) in FirmTypeSelectData"
                                   :label="item.label"
                                   :key="index"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业地址" prop="firmAddr">
                    <el-input style="width: 80%" v-model="FirmListData.firmAddr"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="ContactUser">
                    <el-input style="width: 80%" v-model="FirmListData.ContactUser"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话" prop="ContactUserPhone">
                    <el-input style="width: 80%" v-model="FirmListData.ContactUserPhone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitFromOnBack">确定</el-button>
                    <el-button type="info" @click="drawerSync=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import {
        NewSpecialFormData,
        GetDrawerListTree,
        DeleteTableInfo,
    } from '@/api/BusinAction/SpecialBusiness'
    import {parseTime} from '@/utils'
    import {AddLogData,reviseContentData} from '@/api/BusinAction/Userinfo.js'

    export default {
        name: "SpecialBuiness",
        data() {
            this.FirmLabelData = [
                {label: "序号", prop: "id"},
                {label: "企业名称", prop: "firmName"},
                {label: "企业编码", prop: "firmCode"},
                {label: "企业类型", prop: "firmType"},
                {label: "企业地址", prop: "firmAddr"},
                {label: "联系人", prop: "ContactUser"},
                {label: "联系人电话", prop: "ContactUserPhone"},
                {label: "跟厂业务", prop: "allocatedPerson"}
            ];

            return {
                QueryData: {
                    page: 1
                },
                PageTotal: 0,
                FrimTableData: [],
                drawerSync: false,
                drawerEditorTitle: 'new',
                FirmListData: {
                    firmName: "",
                    firmType: "",
                    firmAddr: "",
                    ContactUser: "",
                    ContactUserPhone: "",
                    type: undefined,
                },
                FirmListDataRule: {
                    firmName: [{required: true, message: '必填项', trigger: 'change'}],
                    firmType: [{required: true, message: '必填项', trigger: 'change'}],
                    firmAddr: [{required: true, message: '必填项', trigger: 'change'}],
                    ContactUser: [{required: true, message: '必填项', trigger: 'change'}],
                    ContactUserPhone: [{required: true, message: '必填项', trigger: 'change'}],
                },
                FirmTypeSelectData: [
                    {
                        value: '1',
                        label: "盘厂",
                    },
                    {
                        value: "2",
                        label: "供应商"
                    }
                ],
            }
        },
        created() {
            this.GetDrawerList();
        },
        methods: {
            /*
            * 修改日志内容
            * */
            reviseContent(item) {
                reviseContentData(item).then((res) => {
                    this.GetDrawerList();
                    this.$message("更新成功")
                })
            },
            /**
             * 添加内容
             * */
            AddLogData(log, props) {
                console.log(props)
                var data = {
                    logData: log,
                    row: props.row
                }
                AddLogData(data).then((res) => {
                    if (res.data.code == 1) {
                        this.GetDrawerList()
                        this.$message("添加成功")
                    }
                })
            },
            /**
             *
             * 新增按钮事件
             * @param props
             * @constructor
             */
            AddLog(props) {
                var Userlog = {
                    Logid: '',
                    creatDate: parseTime(new Date().getTime()),
                    firmid: props.row.id,
                    tailLog: '',
                }
                this.FrimTableData[props.$index].UserLog.splice(0, 0, Userlog)
                console.log(props)
            },
            anmendTableData(data, type) {
                if (type == 1) {
                    this.drawerEditorTitle = 'editor';
                    this.drawerSync = true;
                    this.FirmListData = data.row
                }
                if (type == 0) {

                    this.$confirm("此操作会删除当前数据是否继续?", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消"
                    }).then(() => {
                        DeleteTableInfo(data.row).then((res) => {
                            if (res.data.code == 1) {
                                this.GetDrawerList();
                                this.$message({
                                    type: "success",
                                    message: "删除成功"
                                });
                            }
                        })

                    }).catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        })
                    })
                }

            },
            GetDrawerList() {
                GetDrawerListTree(this.QueryData).then((res) => {
                    this.FrimTableData = res.data.data
                    this.PageTotal = res.data.total
                })
            },
            AddFromData() {
                const FormRestart = {
                    firmName: "",
                    firmType: "",
                    firmAddr: "",
                    ContactUser: "",
                    ContactUserPhone: "",
                    type: undefined,
                };
                this.drawerSync = true;
                console.log(this)
                this.drawerEditorTitle = 'new';
                this.FirmListData = FormRestart

            },
            submitFromOnBack() {
                if (this.drawerEditorTitle == 'new') {
                    this.FirmListData.type = 0
                } else {
                    this.FirmListData.type = 1
                }
                this.$refs['FrimDataRef'].validate((vali) => {
                    if (vali) {
                        console.log(this.FirmListData.type)
                        NewSpecialFormData(this.FirmListData).then((res) => {
                            if (res.data.code == 1) {
                                this.drawerSync = false
                                this.GetDrawerList();
                                this.$notify({
                                    title: "提示",
                                    type: "success",
                                    message: "操作成功"
                                })
                            }
                        })
                    }
                })
            },
        },

    }
</script>

<style scoped>

</style>
