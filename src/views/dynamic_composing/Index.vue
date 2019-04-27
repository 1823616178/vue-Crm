<template>
    <div>
        <el-row type="flex" justify="center">

            <div class="BackQie" :style="'overflow: auto;height:' + ListHeight +'px'">
                <div v-for="(item,index) in abc"
                     :key="index">
                    <el-row type="flex" justify="center" style="text-align: center;">
                        <div style="height: 100px;width: 50px;background: #0a76a4;line-height: 100px">{{index}}</div>
                        <vueDragInfinite :json="item"
                                         :name="name"
                                         @save="saveJson"
                                         ref="dragContain"/>
                    </el-row>
                </div>

                <!--  -->
            </div>
        </el-row>


        <div>
            <el-dialog title="提示"
                       :visible.sync="centerDialogVisible"
                       width="30%"
                       center>
                <span>默认数组</span><br>
                <span>{{enumArr}}</span>
                <span slot="footer"
                      class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="centerDialogVisible = false">确 定</el-button>
          </span>
            </el-dialog>
        </div>


        <div class="control"
             v-drag="contain">
            <div style="line-height:30px;background:#409EFF;cursor:move;color:#fff;text-indent:15px;">
                控制面板
            </div>
            <div style="padding:7px;"
                 @mousedown="mouseDown($event,false)">
                <el-form ref="form"
                         size="mini"
                         label-width="100px">
                    <el-form-item label="模板名称">
                        <el-input v-model="name"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-form-item label="画布宽度">
                            <div class="block">
                                <span class="demonstration">当前画布宽度：{{wid}}</span>
                                <el-slider v-model="wid"
                                           :max="2000"></el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item label="刀数">
                            <div class="block">
                                <span class="demonstration">刀数</span>
                                <el-select v-model="cutVal"
                                           placeholder="请选择刀数">
                                    <el-option
                                            v-for="(item,index) in cutSelect"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"
                                       size="mini"
                                       @click="GetListData">点击请求数据
                            </el-button>
                        </el-form-item>
                        <!--                        <el-form-item label="画布长度">-->
                        <!--                            <div class="block">-->
                        <!--                                <span class="demonstration">画布长度：{{heightValue}}</span>-->
                        <!--                                <el-slider v-model="heightValue"-->
                        <!--                                           :max="2000"></el-slider>-->
                        <!--                            </div>-->
                        <!--                        </el-form-item>-->
                        <el-form-item label="切边距">
                            <div class="block">
                                <span class="demonstration">切边距为：{{QieVal}}</span>
                                <el-slider v-model="QieVal"
                                           :max="300"></el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item label="最大随机数">
                            <el-input v-model.lazy="enumMax"></el-input>
                        </el-form-item>
                        <el-form-item label="最小随机数">
                            <el-input v-model.lazy="enumMin"></el-input>
                        </el-form-item>
                        <el-form-item label="输出数量">
                            <el-input v-model.lazy="enumVal"></el-input>
                        </el-form-item>

                    </el-row>
                    <el-row type="flex"
                            justify="start">
                        <!--                        <el-col>-->
                        <!--                            <el-button type="primary"-->
                        <!--                                       size="mini"-->
                        <!--                                       @click="addDive()">增加模块-->
                        <!--                            </el-button>-->
                        <!--                        </el-col>-->
                        <el-col>
                            <el-button type="primary"
                                       size="mini"
                                       @click="enumData()">生成随机数

                            </el-button>
                        </el-col>
                        <el-col>
                            <el-button type="primary"
                                       size="mini"
                                       @click="onSave">生产派工
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--随机数代码提示-->
            </div>
        </div>

    </div>
</template>

<script>
    import Axios from 'axios'
    import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'
    import indexVue from '../login/index.vue';
    import {constants} from 'fs';

    export default {
        mounted() {
            // this.contain.xx = this.$refs.dragContain.offsetWidth;
            // this.contain.yy = this.$refs.dragContain.offsetHeight;
        },

        computed: {
            ListHeight() {
                return 650;
            },
            canvas() {
                return this.heightValue
            },
            innerHeig() {
                var ListData;
            },
            maxData() {
                return this.enumMax
            },
            minData() {
                return this.enumMin
            },
            canvaswid() {
                return this.wid
            },
            QieBianVal() {
                return this.QieVal
            }
        },
        components: {vueDragInfinite, Axios},
        data: function () {
            return {
                heig: undefined,
                cutVal: 3,
                arrList: undefined,
                ListVal: undefined,
                cutSelect: [
                    {
                        label: 1,
                        value: 1,
                    },
                    {
                        label: 2,
                        value: 2,
                    },
                    {
                        label: 3,
                        value: 3,
                    },
                    {
                        label: 4,
                        value: 4,
                    },
                    {
                        label: 5,
                        value: 5,
                    }
                ],
                enumVal: undefined,
                enumMax: 1000,
                enumMin: 200,
                enumArr: [],
                centerDialogVisible: false,
                wid: 1000,
                QieVal: 50,
                heightValue: 100,
                json: [],
                name: '动态排版',
                contain: {
                    xx: 500,
                    yy: 500
                },
                abc: [],
                add: []
            }
        },
        created() {
            this.heig = window.innerHeight;
            this.GetListData();
        },
        methods: {
            GetListData() {
                Axios.post('http://127.0.0.1/production/GetPaixuListData').then((res) => {
                    this.abc = res.data.arr;
                    this.ListVal = res.data.data;
                    this.arrList = res.data.List;
                    console.log(res.data)
                    // console.log(res.data)
                    // var ListData={
                    //     style:{
                    //         width:undefined
                    //     }
                    // };
                    // var arr2 = [];
                    // for(let i in res.data){
                    //     for(let j in res.data[i]){
                    //         ListData.style.width = res.data[i][j];
                    //         arr2.push(ListData);
                    //     }
                    // }
                    // console.log(arr2)
                    // this.abc = res.data
                })
            },
            onSave() {
                let data = {
                    NowWidth: this.wid * 5,
                    val: {
                        max: this.enumMax,
                        min: this.enumMin,
                        val: this.enumVal,
                        arr: this.enumArr,
                    },
                    cutEdge: this.QieVal,
                    cutVal: this.cutVal
                }
                console.log(data)
            },
            enumData() {
                this.enumArr = []
                if (this.enumMax > this.wid) {
                    this.$message("请输入不大于最大宽度的数值")
                } else {
                    for (let i = 0; i < this.enumVal; i++) {
                        // var val = parseInt(parseInt(Math.random() * (this.maxData - this.minData + 1) + this.minData, 10))
                        var val = Math.floor(Math.random() * (this.enumMax - this.enumMin + 1) + this.enumMin);
                        if (val < this.enumMin || val === this.enumMin || val === this.enumMax) {
                            i = i - 1;
                            continue;
                        }
                        this.enumArr.push(val)
                        this.$nextTick(() => {
                            this.centerDialogVisible = true;
                        })
                    }
                }
            },
            saveJson: function (data) {
                window.console.log(data)
            },
            mouseDown(e, type) {
                if (type) {

                    let that = this;
                    let oldX = e.pageX, oldY = e.pageY;
                    that.movejson.moveWidth = that.json[that.divindex].style.width;
                    that.movejson.moveHeight = that.json[that.divindex].style.height;
                    document.onmousemove = function (e) {
                        let newX = e.pageX - oldX;
                        let newY = e.pageY - oldY;
                        that.json[that.divindex].style.width = ((newX + parseInt(that.movejson.moveWidth)) >= 80 ? (newX + parseInt(that.movejson.moveWidth)) : '80') + 'px';
                        that.json[that.divindex].style.height = ((newY + parseInt(that.movejson.moveHeight)) >= 50 ? (newY + parseInt(that.movejson.moveHeight)) : '50') + 'px';
                        that.He = that.json[that.divindex].style.width;
                        that.Wid = that.json[that.divindex].style.height;
                    }
                    document.onmouseup = function () {
                        document.onmousemove = document.onmouseup = null;
                    }
                }
                e.stopPropagation();
            }
        },

        directives: {
            drag: {
                bind: function (el, binding, vnode) {
                    el.onmousedown = function (e) {
                        var disx = e.clientX - el.offsetLeft;
                        var disy = e.clientY - el.offsetTop;
                        document.onmousemove = function (e) {
                            let left = e.clientX - disx;
                            let top = e.clientY - disy;
                            if (left < 0) {
                                left = 0;
                            }
                            if (top < 0) {
                                top = 0;
                            }
                            // if (left > this.wid - el.offsetWidth)
                            // {
                            //     left = this.wid - el.offsetWidth;
                            // }
                            // if (top > binding.value.yy - el.offsetHeight)
                            // {
                            //     top = binding.value.yy - el.offsetHeight;
                            // }
                            el.style.left = left + 'px';
                            el.style.top = top + 'px';
                        }
                        document.onmouseup = function () {
                            document.onmousemove = document.onmouseup = null;
                        }
                    }

                },

            }
        }
    }
</script>

<style>
    .BackQie {
        position: absolute;
        background: #000000;
        height: 1000px;
        width: 1050px;
    }


    .control {
        width: 250px;
        border-radius: 5px;
        overflow: hidden;
        background-color: #b3c0d1;
        position: fixed;
        z-index: 999;
        right: 20px;
        top: 15px;
    }

    .contain {
        position: relative;
        width: 900px;
        height: 900px;
        background: #ddd;
        user-select: none;
    }

    .EnumDataShow {
        position: relative;
        background: #0a76a4;
        height: 100%;
    }

    .drag.active {
        border-radius: 5px;
        border: 1px solid #85ce61;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    }
</style>
