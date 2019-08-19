<template>
    <div>
        <el-card>
            <el-row type="flex" align="middle" justify="start">
                <el-col :span="3">
                    <el-select v-model="QueryData.queryStatus" @change="SelectValStatus" filterable clearable
                               placeholder="选择指派状态">
                        <el-option
                                v-for="(item,index) in SelectBillStatus"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="QueryData.queryPeople" @change="SelectValPeoples" filterable clearable
                               placeholder="选择业务员">
                        <el-option
                                v-for="item in queryPeopleList"
                                :key="item.id"
                                :label="item.introduction"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </el-card>
        <el-row type="flex" align="middle" justify="center">
            <el-col :span="23">
                <el-table :data="EnterPriseList" border style="margin-top: 20px" v-loading="TableLoading">
                    <el-table-column label="企业名称" header-align="center" align="center"
                                     prop="company_name"></el-table-column>
                    <el-table-column label="企业类型" align="center" header-align="center" prop="company_type">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.company_type==1" type="success">盘厂</el-tag>
                            <el-tag v-if="scope.row.company_type==2" type="success">供应商</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请人员" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == '1'">{{scope.row.proposer}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="分配业务" align="center" header-align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status=='2'">{{scope.row.allocatedPerson}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" header-align="center" sortable prop="status">
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       v-if="scope.row.status == 0"
                                       type="success" @click="DistributionBus(scope)">
                                分配业务
                            </el-button>
                            <el-button size="mini" v-if="scope.row.status == 1" type="warning"
                                       @click="ApplyConfirm(scope,0)">
                                确认申请
                            </el-button>
                            <el-button size="mini" v-if="scope.row.status == 1" type="warning"
                                       @click="ApplyConfirm(scope,1)">
                                取消申请
                            </el-button>
                            <el-button size="mini" v-if="scope.row.status == 2" type="danger"
                                       @click="DelectAccredit(scope)">删除授权
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row type="flex" align="middle" justify="center">
            <el-col :span="10">
                <el-pagination
                        background
                        style="width:100%;margin-top: 20px;"
                        layout="prev, pager, next"
                        :total="QueryTotal"
                        :current-page.sync="QueryData.page"
                        @current-change="GetEnterPriseData">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="IsSyncDaig">
            <el-table :data="rolesList">
                <el-table-column v-for="(item,index) in DiagTableData" :key="index" :label="item.label"
                                 :prop="item.prop">

                </el-table-column>
                <el-table-column label="选择">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-check" type="success" circle @click="SelectPerson(scope)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    style="width:100%;margin-top: 20px;"
                    layout="prev, pager, next,jumper"
                    :total="DiagQueryTotal"
                    :current-page.sync="DiagQuert.page"
                    @current-change="DistributionBus">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
    import {getEcterInfoList, SelectVStatus, SelectValPeople} from '@/api/BusinAction/action.js'
    import {ApplyConfirmRequests, DistributionBusiness, DelectDistributionBusiness} from '@/api/BusinAction/assgin.js'
    import {
        GetUserInfogroup,
    } from '@/api/role'


    export default {
        name: "BusinessManage",
        activated() {
            this.GetEnterPriseData()
        },
        data() {
            this.DiagTableData = [
                {prop: "introduction", label: "姓名"},
                {prop: "PhoneNumber", label: "电话"},
                {prop: "username", label: "账号"},
            ];
            this.SelectBillStatus = [
                {value: "0", label: "未申请"},
                {value: "1", label: "已申请"},
                {value: "2", label: "已指派"},
            ];
            return {
                queryPeopleList: [],
                TableLoading: false,
                RowListData: [],
                rolesList: [],
                IsSyncDaig: false,
                EnterPriseList: [],
                QueryTotal: 0,
                QueryData: {
                    page: 1,
                    queryData: "",
                    queryStatus: "",
                    queryPeople: "",
                    queryName: ""
                },
                DiagQuert: {
                    page: 1,
                },
                DiagQueryTotal: 0,
            }
        },
        mounted() {
            // this.GetEnterPriseData()
        },
        created() {
            this.GetEnterPriseData()
        },
        methods: {
            SelectValPeoples() {
                this.QueryData.page = 1
                this.TableLoading = true
                getEcterInfoList(this.QueryData).then((res) => {
                    this.EnterPriseList = res.data.data;
                    this.QueryTotal = res.data.total
                    this.TableLoading = false
                })
            },
            SelectValStatus(data) {
                this.TableLoading = true
                this.QueryData.page = 1
                if (this.QueryData.queryStatus == '0') {
                    this.GetEnterPriseData()
                } else {
                    getEcterInfoList(this.QueryData).then((res) => {
                        this.EnterPriseList = res.data.data
                        this.QueryTotal = res.data.total
                        this.TableLoading = false
                    })
                }
            },
            DelectAccredit(scope) {
                DelectDistributionBusiness(scope.row).then((res) => {
                    this.GetEnterPriseData()
                })
            },
            SelectPerson(scope) {
                var data = {
                    user: scope.row,
                    row: this.RowListData
                };
                DistributionBusiness(data).then((res) => {
                    this.GetEnterPriseData();
                    this.IsSyncDaig = false;
                })
            },
            DistributionBus(scope) {
                this.RowListData = scope.row
                this.IsSyncDaig = true
                GetUserInfogroup(this.DiagQuert).then((res) => {
                    this.rolesList = res.data.data
                    this.DiagQueryTotal = res.data.total
                })
            },
            ApplyConfirm(scope, val) {
                var data = {
                    id: scope.row,
                    val: val
                };
                console.log(val)
                ApplyConfirmRequests(data).then((res) => {
                    this.GetEnterPriseData()
                })
            },
            GetEnterPriseData() {
                this.TableLoading = true;
                getEcterInfoList(this.QueryData).then((res) => {
                    if (res) {
                        this.EnterPriseList = res.data.data;
                        this.QueryTotal = 0;
                        this.QueryTotal = res.data.total;
                        this.queryPeopleList = res.data.queryPeopleList
                        this.TableLoading = false;

                    }
                })
            },
        },

    }
</script>

<style scoped>

</style>
