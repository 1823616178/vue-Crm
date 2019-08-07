<template xmlns:el-col="http://www.w3.org/1999/html">
    <div>
        <el-card>
            <el-row type="flex" align="middle" justify="center">
                <el-col :span="2">
                    <pan-thumb :image="MyInfoEditor.avatar"
                               style="float: left">
                    </pan-thumb>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle" justify="center" style="margin-top: 20px">
                <el-button class="btn" @click="isShow=true">设置头像</el-button>
            </el-row>
        </el-card>
        <el-row type="flex" justify="center" align="middle">
            <el-col :span="5">
                <vueImage field="file"
                          v-model="isShow"
                          @crop-upload-success="cropUploadSuccess"
                          @crop-upload-fail="cropUploadFail"
                          :width="300"
                          :height="300"
                          method="post"
                          url="http://118.24.131.216:9527/Busin/UpdataBusinData"></vueImage>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle">
            <el-col :span="15" style="margin-top: 20px">
                <el-card>
                    <el-form :model="MyInfoEditor" label-width="80px">
                        <el-form-item label="登录名" prop="username">
                            <template slot-scope="scope">
                                <el-input v-model="MyInfoEditor.username"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <template slot-scope="scope">
                                <el-input v-model="MyInfoEditor.password"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="真实姓名" prop="introduction">
                            <template slot-scope="scope">
                                <el-input v-model="MyInfoEditor.introduction"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="PhoneNumber">
                            <template slot-scope="scope">
                                <el-input v-model="MyInfoEditor.PhoneNumber"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="所在部门" prop="DepartName" >
                            <template slot-scope="scope">
                                <el-input v-model="MyInfoEditor.DepartName" :disabled="true"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="Email" prop="Email">
                            <template slot-scope="scope">
                                <el-input v-model="MyInfoEditor.Email"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item>
                            <template slot-scope="scope">
                                <el-button type="success" @click="amendData(scope)">
                                    修改
                                </el-button>
                            </template>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import PanThumb from '@/components/PanThumb'
    import vueImage from 'vue-image-crop-upload'
    import 'babel-polyfill'
    import {
        GetUserInfo,
        AmendUserData,
    } from '@/api/BusinAction/Userinfo'

    export default {
        name: "PersonManage",
        components: {vueImage, PanThumb},
        data() {
            return {
                isShow: false,
                MyInfoEditor: {
                    username: "",
                    password: "",
                    introduction: '',
                    PhoneNumber: "",
                    DepartName: "",
                    Email: "",
                    avatar: '',
                },
            }
        },
        created() {
            this.GetUserInfoData()
        },
        methods: {
            /***
             * 修改数据
             * **/
            amendData(scope) {
                AmendUserData(this.MyInfoEditor).then((res) => {
                    this.GetUserInfoData();
                    this.$message("修改成功")
                })
            },

            /**
             * 请求数据
             * */
            GetUserInfoData() {
                GetUserInfo().then((res) => {
                    this.MyInfoEditor = res.data
                })
            },

            toggleShow() {
                this.show = !this.show;
            },


            /**
             * 上传成功
             * [param] jsonData  server api return data, already json encode
             * [param] field
             */
            cropUploadSuccess(jsonData, field) {
                var path = jsonData.replace('\\', '/')
                var pathval = 'http://118.24.131.216:9527/ImageUpload/' + path
                this.MyInfoEditor.avatar = pathval
                console.log(pathval);
            },
            /**
             * 上传失败
             * @param status
             * @param field
             */
            cropUploadFail(status, field) {
                this.$message("上传失败，联系网管")
            }
        },
    }
</script>

<style scoped>

</style>