<template>
    <div>
        <el-card>
            <el-row type="flex" align="middle" justify="center">
                <el-col :span="5">
                    <el-select v-model="remoteValueName"
                               style="width: 300px;"
                               filterable
                               remote
                               reserve-keyword
                               multiple
                               placeholder="输入公司名称"
                               :remote-method="getRemoteSearchData"
                               :loading="SearchLoding">
                        <el-option v-for="(item,index) in SearchData"
                                   :key="item.company_code"
                                   :label="item.company_name"
                                   :value="item.company_code"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-button type="success" @click="SearchListData">点击搜索</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-row type="flex" align="middle" justify="center" style="margin-top: 20px">
            <el-col :span="23">
                <el-table border :data="UserReleData" v-loading="isTableLoading" @row-dblclick="DownKetEnterFunc">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="[props.row]" border>
                                <el-table-column label="联系人列表">
                                    <template slot-scope="scope">
                                        <el-table :data="scope.row.LoginUser" border>
                                            <el-table-column label="姓名" prop="real_name"></el-table-column>
                                            <el-table-column label="电话" prop="mobile"></el-table-column>
                                        </el-table>
                                    </template>
                                </el-table-column>
                                <el-table-column label="公司地址" prop="bl_address"></el-table-column>
                                <el-table-column label="法定代表人" prop="leader_name"></el-table-column>
                                <el-table-column label="营业执照号码" prop="bl_number"></el-table-column>
                                <el-table-column label="企业资料" align="center" header-align="center">
                                    <template slot-scope="scope">
                                        <el-tag v-if="scope.row.Children===[]">
                                            无资料
                                        </el-tag>
                                        <el-button size="mini" type="success" @click="DownloadFile(scope)"
                                                   v-else>点击下载
                                        </el-button>

                                    </template>
                                </el-table-column>
                            </el-table>
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
                    <el-table-column label="客户编号" prop="company_code" header-align="center"
                                     align="center"></el-table-column>
                    <el-table-column label="客户名称" prop="company_name" header-align="center"
                                     align="center"></el-table-column>
                    <el-table-column label="重要提示/备注" prop="remaker" align="center" header-align="center">
                        <template slot-scope="scope">
                            <el-input type="textarea" placeholder="输入备注" v-model="scope.row.remaker"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="客户跟踪日志" align="center" header-align="center">
                        <template slot-scope="scope">
                            <span>{{(scope.row.UserLog[0] !== undefined) ? scope.row.UserLog[0].tailLog : ""}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟厂业务" header-align="center" align="center" style="color: #1e6abc">
                        <template slot-scope="scope">
                            <span>{{scope.row.allocatedPerson}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="2">
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="pageTotal"
                                :current-page.sync="QueryData.page"
                                @current-change="GetUserRelevanceData">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="DownloadDiag" title="点击下载">
            <div style="text-align: center">
                <a v-for="(item,index) in DownloadData" :key="index" target="view_window"
                   :href="'http://www.zhonghuadianqi.com'+item.attach_file">{{'http://www.zhonghuadianqi.com'+item.attach_file}}<br></br></a>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        UserRelevanceData,
        AddLogData,
        reviseContentData,
        UploadRemakerImport,
        AddLogData_Two,
        RemoteSearchData,
        SreachListDataValue
    } from '@/api/BusinAction/Userinfo.js'
    import mailTable from '../BusinessManage/composent/tableComponent'
    import {
        DownBusinessFile,
    } from '@/api/BusinAction/action.js'
    import {parseTime} from '@/utils'

    export default {
        name: "MyClient",
        components: {mailTable},
        activated() {
            this.GetUserRelevanceData()
        },
        data() {
            return {
                SearchData: [],
                remoteValueName: "",
                SearchLoding: false,
                QueryData: {
                    page: 1
                },
                UserReleData: [],
                DownloadDiag: false,
                DownloadData: [],
                RemakerDiag: false,
                pageTotal: 0,
                isTableLoading: false,
            }
        },
        mounted() {

        },
        created() {
            this.GetUserRelevanceData()
        },
        methods: {
            SearchListData() {
                this.isTableLoading = true
                SreachListDataValue({code: this.remoteValueName}).then((res) => {
                    this.UserReleData = res.data.data
                    this.isTableLoading = false
                    this.pageTotal = 0
                })
            },
            getRemoteSearchData(query) {
                console.log(query)
                if (query !== "") {
                    this.SearchLoding = true
                    RemoteSearchData({code: query}).then((res) => {
                        this.SearchData = res.data.data
                        this.SearchLoding = false
                    })
                }
                /*RemoteSearchData().then((res) => {
                    console.log()
                })*/
            },
            DownKetEnterFunc(scope) {
                UploadRemakerImport(scope).then((res) => {
                    if (res.data.code == 1) {
                        this.GetUserRelevanceData();
                        this.$message("保存成功")
                    } else {
                        this.$message("保存出错再试一下")
                    }
                })
            },
            /**
             * 修改日志
             * */
            reviseContent(item) {
                reviseContentData(item).then((res) => {
                    this.GetUserRelevanceData();
                    this.$message("更新成功")
                })
            },
            /**
             * 新增日志
             * @param props
             * @constructor
             */
            AddLogData(log, props) {
                console.log(props)
                var data = {
                    logData: log,
                    row: props.row
                }
                AddLogData_Two(data).then((res) => {
                    if (res.data.code == 1) {
                        this.GetUserRelevanceData()
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
                this.UserReleData[props.$index].UserLog.splice(0, 0, Userlog)
            },
            /**
             * 分页
             * @constructor
             */
            GetUserRelevanceData() {
                this.isTableLoading = true
                UserRelevanceData(this.QueryData).then((res) => {
                    this.UserReleData = res.data.data
                    this.pageTotal = res.data.total
                    this.isTableLoading = false
                })
            },
            DownloadFile(scope) {
                var data = {
                    id: scope.row.company_code
                }
                DownBusinessFile(data).then((res) => {
                    console.log(res)
                    this.DownloadDiag = true
                    this.DownloadData = res.data
                })
            },
        }
        ,
    }
</script>

<style scoped>

</style>
