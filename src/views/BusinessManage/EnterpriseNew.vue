<template>
    <div>
        <el-card body-style="padding:10px">
            <el-row type="flex" justify="start" align="middle">
                <!--                <el-col :span="2">-->
                <!--                    <el-button type="success" @click="AddSyncEnterDiag">新增企业</el-button>-->

                <!--                </el-col>-->
                <el-col :span="3">
                    <el-select v-model="QueryData.queryData" @change="SelectValName" filterable placeholder="输入公司名称"
                               clearable>
                        <el-option
                                v-for="item in AllDataList"
                                :key="item.id"
                                :label="item.company_name"
                                :value="item.company_code"
                        >
                        </el-option>
                    </el-select>
                </el-col>
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
        <el-dialog :visible.sync="SyncEnterDiag" :title="dialogType==='editor'?'修改':'新增'">
            <el-form ref="EditForm" :rules="FromListDataRule" :model="FromListData" label-width="100px">
                <el-form-item label="企业类型" prop="firmType">
                    <template>
                        <el-select v-model="FromListData.firmType" placeholder="请选择">
                            <el-option v-for="(item,index) in firmTypeList"
                                       :value="item.value"
                                       :key="index"
                                       :label="item.label"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="企业名称" prop="firmName">
                    <template>
                        <el-input v-model="FromListData.firmName"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="企业地址" prop="firmAddr">
                    <template>
                        <el-input type="textarea" v-model="FromListData.firmAddr"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="联系人" prop="ContactUser">
                    <template>
                        <el-input v-model="FromListData.ContactUser"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="联系人电话" prop="ContactUserPhone">
                    <template>
                        <el-input v-model="FromListData.ContactUserPhone"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="联系电话" prop="firmPhone">
                    <template>
                        <el-input v-model="FromListData.firmPhone"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="企业简介" prop="firmBrief">
                    <template>
                        <el-input v-model="FromListData.firmBrief" type="textarea"></el-input>
                    </template>
                </el-form-item>
                <el-form-item v-for="(item,index) in inButtonAddLogdata" :label="item.label" :key="index">
                    <template slot-scope="scope">
                        <el-input v-model="FromListData.remaker[item.prop]"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="添加备注">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="AddRemakerInput">点击添加</el-button>
                    </template>
                </el-form-item>
                <el-form-item label="上传文件">
                    <el-upload
                            class="upload-demo"
                            :on-change="handleChange"
                            action="http://118.24.131.216:9527/Busin/UpdataBusinData"
                            ref="isUpload"
                            :on-success="UploadSuccess"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-itemx>
                    <template>
                        <el-button type="info">取消</el-button>
                        <el-button type="success" @click="AddsubmitData">确定</el-button>
                    </template>
                </el-form-itemx>
            </el-form>
        </el-dialog>
        <el-row type="flex" justify="center" align="middle">
            <el-col :span="23">
                <el-table :data="EnterPriseList" border v-loading="isLoading"
                          element-loading-text="别着急，数据正在加载...."
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.8)">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div style="text-align: center"
                                 v-if="UserData !==  parseInt(props.row.allocatedPersonId)&&isSuper==0">
                                <el-tag style="color: #1e6abc">这不是你的业务哦</el-tag>
                            </div>
                            <div v-else>
                                <el-table :data="[props.row]" border align="center">
                                    <el-table-column label="联系人列表">
                                        <template slot-scope="scope">
                                            <el-table :data="scope.row.LoginUser">
                                                <el-table-column label="姓名" prop="real_name"></el-table-column>
                                                <el-table-column label="电话" prop="mobile"></el-table-column>
                                            </el-table>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-for="(item,index) in extendTableList" :label="item.label"
                                                     :prop="item.prop" :width="item.width" :key="index"
                                                     header-align="center" align="center"></el-table-column>
                                    <el-table-column label="企业资料" align="center" width="100px" header-align="center">
                                        <template slot-scope="scope">
                                            <el-tag v-if="scope.row.Children == ''||scope.row.Children==undefined||scope.row.Children==null||scope.row.Children==[]">
                                                无资料
                                            </el-tag>
                                            <el-button size="mini" type="success" @click="DownloadFile(scope)"
                                                       v-else>点击下载
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-button size="mini" type="success" style="margin-top: 10px"
                                           v-if="props.row.status===0||props.row.remaker===null"
                                           @click="AmendRemakerData(props,0)">
                                    添加备注
                                </el-button>
                                <el-button size="mini" type="info" style="margin-top: 10px"
                                           v-else @click="AmendRemakerData(props,1)">
                                    修改备注
                                </el-button>
                                <div v-if="props.row.remaker!==null">
                                    <el-divider content-position="center">
                                        备注
                                    </el-divider>
                                    <el-row type="flex" align="middle" justify="center">
                                        <el-col style="text-align: center;">
                                            <span>{{props.row.remaker}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item,index) in TableColumList" :key="index" :prop="item.prop"
                                     :label="item.label" header-align="center" align="center" :min-width="item.width">

                    </el-table-column>
                    <el-table-column label="企业类型" align="center" header-align="center" prop="company_type">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.company_type==1" type="success">盘厂</el-tag>
                            <el-tag v-if="scope.row.company_type==2" type="success">供应商</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="指派状态" align="center" width="100px" header-align="center">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status == 0" type="info">未指派</el-tag>
                            <el-tag v-if="scope.row.status == 1" type="warning">已申请</el-tag>
                            <el-tag v-if="scope.row.status == 2" type="danger">已指派</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请人" align="center" header-align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.proposer}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟厂业务" align="center" header-align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.allocatedPerson}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请指派" align="center" width="100px" header-align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="ApplyBusiness(scope)"
                                       v-if="scope.row.status == undefined||scope.row.status==null||scope.row.status == 0">
                                申请指派
                            </el-button>
                            <el-button size="mini" @click="CancelApply(scope)" type="warning"
                                       v-if="scope.row.status == 1">
                                取消申请
                            </el-button>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="isSuper==1" width="100" align="center" header-align="center" label="修改">
                        <template slot-scope="scope">
                            <el-button size="mini" type="info" @click="AmendCollData(scope)">修改</el-button>
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
                        layout="prev, pager, next,jumper"
                        :total="QueryTotal"
                        :current-page.sync="QueryData.page"
                        @current-change="GetEnterPriseData">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="DownloadDiag" title="点击下载">
            <div style="text-align: center">
                <template v-for="(item,index) in DownloadData">
                    <el-row type="flex" align="middle" justify="start" :key="index">
                        <el-col :span="8">
                            <img preview :src="'http://www.zhonghuadianqi.com'+item.attach_file" class="ImgStyleCss"/>
                        </el-col>
                    </el-row>
                </template>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="DiagMakerStatus" :title="RemakerStatus=='editor'?'修改':'新增'" width="500px">
            <el-form :model="FormRemakerData">
                <el-form-item label="备注">
                    <template slot-scope="scope">
                        <el-input v-model="FormRemakerData.remaker" type="textarea"></el-input>
                    </template>
                </el-form-item>
                <el-form-item>
                    <template slot-scope="scope">
                        <el-button type="danger" @click="DiagMakerStatus=false">取消</el-button>
                        <el-button type="success" @click="UploadRemakerData(scope)">确定</el-button>
                    </template>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getEcterInfoList,
        cancleApplyFunc,
        UpdataBusinData,
        AddFirmData,
        ApplyBusinessData,
        DownBusinessFile,
        selectValSeek,
        SelectValPeople,
        AmendFirmData,
        SelectVStatus,
        UploadRemakerDataList,
    } from '@/api/BusinAction/action.js'
    import mailTable from './composent/tableComponent'

    export default {
        name: "EnterpriseNew",
        components: {mailTable},
        activated() {
            this.GetEnterPriseData();
        },
        data() {
            this.FormFirmData = [
                {prop: 'id', label: "序号"}
            ];
            this.extendTableList = [
                {prop: "bl_address", label: "公司地址"},
                {prop: "leader_name", label: "法定代表人"},
                {prop: "bl_number", label: "营业执照号码"},
            ]
            this.TableColumList = [
                {prop: 'company_code', label: "企业编号", width: "30"},
                {prop: 'company_name', label: "企业名称", width: "150"},
                // {prop: 'assignStatus', label: "指定状态", width: "150"},
                // {prop: 'allocatedPerson', label: "跟厂业务", width: "80"},
            ];
            this.SelectBillStatus = [
                {value: "0", label: "未指派"},
                {value: "1", label: "已申请"},
                {value: "2", label: "已指派"},
            ];
            return {
                imgListData: [],
                inButtonAddLogdata: [],
                fileList: undefined,
                QueryTotal: 0,
                isSuper: undefined,
                UserData: undefined,
                isLoading: false,
                tableIndex: undefined,
                SelectPeople: [],
                QueryData: {
                    page: 1,
                    queryData: "",
                    queryStatus: "",
                    queryPeople: "",
                },
                BaseUrl: "http://127.0.0.1",
                EnterPriseList: [],
                SyncEnterDiag: false,
                dialogType: "new",
                FromListData: {
                    firmType: '',
                    firmName: "",
                    firmAddr: "",
                    ContactUser: "",
                    ContactUserPhone: "",
                    firmPhone: "",
                    firmBrief: "",
                    ImageArr: [],
                    remaker: {},
                    remakerIndex: 1,
                },
                FormRemakerData: {
                    remaker: null
                },
                queryPeopleList: [],
                isRemakerEditor: undefined,
                remakerContent: {},
                DownloadData: [],
                DownloadDiag: false,
                AllDataList: [],
                DiagMakerStatus: false,
                RemakerStatus: '',
                composerIndex: undefined,
                FromListDataRule:
                    {
                        firmType: [{required: true, message: '必填', trigger: 'change'}],
                        firmName:
                            [{required: true, message: '必填', trigger: 'change'}],
                        firmAddr:
                            [{required: true, message: '必填', trigger: 'change'}],
                        ContactUser:
                            [{required: true, message: '必填', trigger: 'change'}],
                        ContactUserPhone:
                            [{required: true, message: '必填', trigger: 'change'}],
                        firmPhone:
                            [{required: true, message: '必填', trigger: 'change'}],
                        firmBrief:
                            [{required: true, message: '必填', trigger: 'change'}],
                    }
                ,
                firmTypeList: [
                    {
                        value: "成套厂",
                        label: '成套厂'
                    },
                    {
                        value: "供应商",
                        label: '供应商'
                    }
                ]
            }
        },
        created() {
            this.GetEnterPriseData()
        },
        methods: {
            SelectValPeoples() {
                this.isLoading = true
                getEcterInfoList(this.QueryData).then((res) => {
                    this.EnterPriseList = res.data.data
                    this.QueryTotal = res.data.total
                    this.isLoading = false
                })
            },
            UploadRemakerData(scope) {
                var data = {
                    form: this.FormRemakerData,
                    index: this.tableIndex,
                    composerIndex: this.composerIndex
                }

                UploadRemakerDataList(data).then((res) => {
                    if (res.data.code == 1) {
                        this.DiagMakerStatus = false
                        this.GetEnterPriseData()
                    } else {
                        this.$message("请输入")
                    }
                })
            },
            AmendRemakerData(scope, isEditor) {
                var EditorData = {
                    data: scope.row,
                    isEditor: isEditor,
                };
                this.tableIndex = scope.row.company_code
                this.composerIndex = scope.row.company_code
                this.isRemakerEditor = isEditor
                if (isEditor == 1) {
                    var arr = []
                    this.FormRemakerData = scope.row.data
                    this.RemakerStatus = "editor"
                } else {
                    this.RemakerStatus = 'new'
                    this.FormRemakerData = {}
                }
                this.DiagMakerStatus = true

            },
            AmendCollData(data) {
                window.location.href = 'http://www.zhonghuadianqi.com/admin'
                // var AddVal = {
                //     firmType: '',
                //     firmName: "",
                //     firmAddr: "",
                //     ContactUser: "",
                //     ContactUserPhone: "",
                //     firmPhone: "",
                //     firmBrief: "",
                //     ImageArr: [],
                //     remaker: {},
                //     remakerIndex: 1,
                // }
                // data.row.remaker = AddVal
                // data.row['remakerIndex'] = 1
                // this.dialogType = 'editor'
                // this.SyncEnterDiag = true
                // this.FromListData = data.row
                // this.inButtonAddLogdata = []
            },
            /**
             *搜索选中的值
             * @constructor
             */
            SelectValName(data) {
                if (data == "全选") {
                    this.GetEnterPriseData()
                } else {
                    getEcterInfoList(this.QueryData).then((res) => {
                        this.EnterPriseList = res.data.data
                        this.QueryTotal = res.data.total
                    })
                }
            },
            SelectValStatus(data) {
                this.isLoading = true
                getEcterInfoList(this.QueryData).then((res) => {
                    this.EnterPriseList = res.data.data
                    this.QueryTotal = res.data.total
                    this.isLoading = false
                })
            },
            AddRemakerInput() {
                var AddList = {
                    label: "备注" + this.FromListData.remakerIndex.toString(),
                    prop: "remaker" + this.FromListData.remakerIndex.toString()
                };
                this.inButtonAddLogdata.push(AddList)
                this.FromListData.remakerIndex += 1
            },
            AddSyncEnterDiag() {
                var AddVal = {
                    firmType: '',
                    firmName: "",
                    firmAddr: "",
                    ContactUser: "",
                    ContactUserPhone: "",
                    firmPhone: "",
                    firmBrief: "",
                    ImageArr: [],
                    remaker: {},
                    remakerIndex: 1,
                }
                this.inButtonAddLogdata = []
                this.dialogType = 'new'
                this.SyncEnterDiag = true
                this.$nextTick(() => {
                    this.FromListData = AddVal
                    this.$refs['isUpload'].clearFiles();
                    this.$refs['EditForm'].resetFields();
                    this.FromListData.ImageArr = []
                    this.FromListData.remaker = {}
                })
            },
            DownloadFile(scope) {
                var data = {
                    id: scope.row.id
                }
                console.log(scope)
                this.DownloadDiag = true
                this.DownloadData = scope.row.Children
            },
            UploadSuccess(response, file, fileList) {
                let path = response
                var val = path.replace('\\', '/')
                this.FromListData.ImageArr.push('http://118.24.131.216:9527/ImageUpload/' + val)
                console.log(this.FromListData.ImageArr)
            },
            handleChange(file, fileList) {
                this.fileList = fileList.slice(-3);
            },
            SyncPageData() {
                console.log(this.QueryData.page)
            },
            CancelApply(scope) {
                var Ques = {
                    id: scope.row.company_code,
                }
                cancleApplyFunc(Ques).then((res) => {
                    if (res.data.code == 1) {
                        this.$message("取消成功")
                        this.GetEnterPriseData()
                    }
                    if (res.data.code == 1001) {
                        this.$message("已被申请")
                    }

                })
            },
            ApplyBusiness(scope) {
                console.log(scope)
                var data = {
                    company_code: scope.row.company_code,
                }
                ApplyBusinessData(data).then((res) => {
                    if (res.data.code == 1) {
                        this.$message("申请成功，等待管理员审核")
                        this.GetEnterPriseData()
                    }
                })
            },
            GetEnterPriseData() {
                this.isLoading = true
                getEcterInfoList(this.QueryData).then((res) => {
                    if (res) {
                        var headData = {
                            company_name: "全选",
                            company_code: '全选'
                        }
                        this.EnterPriseList = res.data.data
                        this.QueryTotal = res.data.total
                        this.AllDataList = res.data.Alldata
                        this.AllDataList.unshift(headData);
                        this.UserData = res.data.userInfo.id
                        this.isSuper = res.data.isSuper.isSuper
                        this.isLoading = false
                        this.queryPeopleList = res.data.queryPeopleList
                    }
                })

            },
            AddsubmitData() {
                if (this.dialogType == 'editor') {
                    this.$refs['EditForm'].validate((valid) => {
                        if (valid) {
                            AmendFirmData(this.FromListData).then((res) => {
                                if (res.data.code == 1) {
                                    this.GetEnterPriseData();
                                    this.SyncEnterDiag = false
                                    this.$message("更新成功")
                                } else {
                                    this.$message("请勿重复更新")
                                }
                            })
                        }
                    })
                } else {
                    this.$refs['EditForm'].validate((valid) => {
                        if (valid) {
                            AddFirmData(this.FromListData).then((res) => {
                                this.GetEnterPriseData();
                                this.SyncEnterDiag = false
                            })
                        } else {
                            return false
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>
    .ImgStyleCss {
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
