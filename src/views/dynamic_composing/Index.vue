<template>
  <div style="user-select: none">
    <el-row type="flex"
            justify="center"
            v-loading.fullscreen.lock="loading" v-infinite-scroll="localMore" style="height: 100%;"
            infinite-scroll-disabled="busy" infinite-scroll-distance="5">
      <el-col :span="4">
        <div @dblclick="showIndentLeft" style="width: 100%;height: 100%"></div>
      </el-col>
      <el-col :span="15">
        <div class="BackQie2">
          <div v-for="(item,index) in abc"
               :key="index">
            <el-row type="flex"
                    justify="center"
                    style="text-align: center;">
              <div style="height: 100px;width: 50px;background: #0a76a4;line-height: 100px">{{index}}</div>

              <vueDragInfinite :json="item"
                               :name="name"
                               :ratio="ratio"
                               @save="saveJson"
                               ref="dragContain"
                               :borderWidth='QieBianVal'
                               :FenQieLength="FenQieLengthCav"
                               :isColorStop="isColorStop"
                               @isColorStopfunc="isColorStopSync"
                               @mouseenter.native="IsMouseUp(index)"
                               @click.native="IsClickCtrl($event,index)"
                               @mouseout.native="isMouseOut(index)"
                               @updateDataPage="updateDataPage"
                               :key="UploadKey"
                               :isUPload="isUPload"
              />
            </el-row>
            <div v-show="(index+1)%cutVal===0" style="background: #4AB7BD;width: 100%;height: 10px;"></div>
          </div>
          <!--  -->
        </div>
      </el-col>
      <el-col :span="5">
        <div @dblclick="showIndentRight" style="height: 100%;width: 100%"></div>
      </el-col>
    </el-row>

    <div>
      <el-dialog title="提示"
                 :visible.sync="centerDialogVisible"
                 width="30%"
                 center>
        <span>默认数组</span><br>
        <span>{{POSTDATA}}</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="control"
         v-drag="contain"
         v-show="dele">
      <div style="line-height:30px;background:#409EFF;cursor:move;color:#fff;text-indent:15px;">
        控制面板
        <el-button type="danger"
                   class="del"
                   @click="deel(index,$event)"
                   circle></el-button>
      </div>
      <div style="padding:7px;"
           @mousedown="mouseDown($event,false)">
        <el-form ref="form"
                 size="mini"
                 label-width="100px">
          <el-form-item label="模板名称">
            <el-select v-model="IsSetType" placeholder="请选择">
              <el-option
                v-for="item in SelectName"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产班组">
            <div class="block">
              <el-select v-model="MakeGroupval"
                         @change="changWdthOrQie"
                         placeholder="选择生产班组">
                <el-option
                  v-for="(item,index) in MakeGroup"
                  :key="index"
                  :label="item.group_name"
                  :value="item.group_id">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="生产机器">
            <div class="block">
              <el-select v-model="MakeGroupval"
                         @change="changWdthOrQie"
                         placeholder="选择生产机器">
                <el-option
                  v-for="(item,index) in MakeGroup"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-row>
            <el-form-item label="宽度">
              <div class="block">
                <span>当前宽度为:{{wid}}</span>
                <el-slider v-model="wid"
                           :max="MaxWid"
                           :min="MinWid"></el-slider>
                <span>手动输入宽度</span>
                <div @keypress.enter="changeWidth">
                  <el-input style="width: 100px" size="mini" v-model="wid"></el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="行分切数">
              <el-input v-model="rowCutVal"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model="ProductName"></el-input>
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input v-model="ProductsCsCode"></el-input>
            </el-form-item>
            <el-form-item label="生成行数">
              <el-input v-model="UseHang"></el-input>
            </el-form-item>
            <el-form-item label="刀数">
              <div class="block">
                <el-select v-model="cutVal"
                           placeholder="请选择刀数">
                  <el-option v-for="(item,index) in cutSelect"
                             :key="index"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="切边距">
              <div class="block">
                <span class="demonstration">切边距为：{{QieBianVal}}</span>
                <el-slider v-model="QieVal"
                           :max="300"></el-slider>
              </div>
            </el-form-item>
            <el-form-item label="派工规格">
              <el-input v-model="DisPathListSync"></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex"
                  justify="start">
            <el-col>
              <el-button type="primary"
                         size="mini"
                         @click="onSave">生成排版
              </el-button>
              <el-button type="primary"
                         size="mini"
                         @click="OnSaveDynamicData">生产派工
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <!--随机数代码提示-->
      </div>
    </div>
    <el-dialog :visible.sync="DiagSyncData">
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="10">
          <el-input v-model="fqcd" placeholder="请输入分切长度"></el-input>
        </el-col>
        <el-col :offset="2">
          <el-button type="success" @click="ComputeWinth">计算</el-button>
        </el-col>
      </el-row>

      <DropDataList :menudata="menudata"></DropDataList>
    </el-dialog>
    <div class="Menucontrol"
         v-drag="contain"
         v-show="dele2">
      <div style="line-height:30px;background:#409EFF;cursor:move;color:#fff;text-indent:15px;">
        订单列表
        <el-button type="danger"
                   class="del"
                   @click="deel2(index,$event)"
                   circle></el-button>
      </div>
      <div style="padding:7px;"
           @mousedown="mouseDown($event,false)">
        <div @contextmenu.prevent="PostNewMakerArr">
          <TreeTable :data="TreeData" :columns="columns" :HangTotal="total" ref="isReload"
                     @AddDivWidth="AddDivWidth($event)"
                     @NextOrderData='NextOrderData' border/>
        </div>
        <!--随机数代码提示-->
      </div>
    </div>
    <div class="Menucontrol2"
         v-drag="contain"
         v-show="dele3">
      <div style="line-height:30px;background:#409EFF;cursor:move;color:#fff;text-indent:15px;">
        大杠膜存货信息
      </div>
      <el-button type="danger"
                 class="del"
                 @click="deel3(index,$event)"
                 circle></el-button>
      <div style="padding:7px;"
           @mousedown="mouseDown($event,false)">
        <div @contextmenu.prevent="HangNewMakerArr">
          <TreeTable :data="TreeDataOrder" :columns="columns2" ref="isReloadPub"
                     @NextOrderData='NextOrderDataTwo' :HangTotal="HangTotal" border/>
        </div>
        <!--随机数代码提示-->
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'
  import TreeTable from '@/components/TreeTable'
  import indexVue from '../login/index.vue';
  import {constants} from 'fs';
  import {setTimeout} from 'timers';
  import {DynamicOrder, HangData, GroupTeamSelectData} from '@/api/article.js'
  import {LimitPageSellOrderData, LimitPageSlitData} from '@/api/remoteSearch.js'
  import DropDataList from './DropDataList'

  export default {
    mounted() {
      let sUserAgent = navigator.userAgent;
      let isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
      let isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
      document.addEventListener('keydown', e => {
        if ((e.keyCode === 17 && isWin) || (e.keyCode === 91 && isMac)) {
          this.isCtrl = true
        }
      })
      document.addEventListener('keyup', e => {
        if ((e.keyCode === 17 && isWin) || (e.keyCode === 91 && isMac)) {
          this.isCtrl = false
        }
      })
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
      },
      FenQieLengthCav() {
        return parseInt(this.FenQieLength)
      }
    },
    components: {vueDragInfinite, Axios, TreeTable, DropDataList},
    data: function () {
      return {
        GotoSyncDiag: false,
        IsSetType: '',
        UseHang: "",
        dele3: true,
        ProductsCsCode: undefined,
        UploadKey: 0,
        ProductName: "",
        DisPathListSync: undefined,
        fqcd: undefined,
        name: undefined,
        DiagSyncData: false,
        valList: 0,
        dele2: true,
        divindexData: undefined,
        addWidthDataSon: undefined,
        isColorStop: false,
        TreeData: [],
        TreeDataOrder: [],
        columns2: [
          {
            label: "产品编码",
            key: "sCoCOde",
            width: 200,
            checkbox: true,
            expand: true
          },
          {
            label: "规格",
            key: "spec",
          },
          {
            label: "派工单编号",
            key: "dispathid",
            width: 120
          },
          {
            label: "产品名称",
            key: "productName",
          },
          {
            label: "宽度",
            key: "width",
          },
          {
            label: "杠数",
            key: "hangval",
          },
        ],
        columns: [
          {
            label: "产品编码",
            key: "cInvCode",
            width: 200,
            checkbox: true,
            expand: true
          },
          {
            label: "产品名称",
            key: "cInvName",
          },
          {
            label: "规格",
            key: "cInvStdtd",
          },
          {
            label: "总重量",
            key: "Allup",
          },
          {
            label: "件数",
            key: "pice",
          },
          {
            label: "米数",
            key: "rice",
          },
          {
            label: "产品规格",
            key: "cInvStd",
          },
          {
            label: "订货米数",
            key: "cbdefine3",
          },
          {
            label: "产品编码",
            key: "cInvCodeSS",
          }, {
            label: "产品名称",
            key: "cInvNameName",
          },
          {
            label: "定长",
            key: "fLength",
          },
          {
            label: "客户简称",
            key: "cCusAbbName",
          },
          {
            label: "订货数量",
            key: "iQuantity",
          },
          {
            label: "订货宽度",
            key: "cDefine34",
          },
          {
            label: "订货日期",
            key: "dDate",
          },
          {
            label: "供货日期",
            key: "dPreDate",
          },
          {
            label: "客户编码",
            key: "cCusCode",
          },


        ],
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        rowCutVal: undefined,
        menudata: [],
        abcCopys: [],
        isDataLoad: 0,
        FenQieLength: 100,//分切长度
        FenQieVal: undefined,//分切数
        blackVal: undefined,
        MaxWid: 2000,
        ratio: 0,
        MinWid: 0,
        groupCode: '',
        HttpUrl: "http://127.0.0.1",
        MakeGroup: [],
        MakeGroupval: undefined,
        borderWidth: 1000,
        PostLoding: true,
        dele: true,
        loading: false,
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
        HangTotal: 0,
        HangPageVal: 1,
        POSTDATA: undefined,
        enumVal: undefined,
        enumMax: 1000,
        enumMin: 200,
        enumArr: [],
        centerDialogVisible: false,
        wid: 1000,//宽度
        wid2: undefined,
        QieVal: 0,//切边距
        heightValue: 100,
        total: undefined,
        HangListVl: undefined,
        json: [],
        SelectName: [
          {
            value: 'cationg',
            label: '流延排版'
          },
          {
            value: 'slitting',
            label: '分切排版'
          }
        ],
        contain: {
          xx: 500,
          yy: 500
        },
        abc: [],
        abccope: [],
        add: [],
        busy: false,
        isUPload: false
      }
    },
    created() {
      this.heig = window.innerHeight;
      // this.GetListData();
      // this.groupMaker();
      this.SelectGruopList();
      this.OrderListData();
      this.HangeLineData();
    },
    methods: {
      SelectGruopList() {
        GroupTeamSelectData().then((res) => {
          this.MakeGroup = res.data
        })
      },
      HangNewMakerArr() {
        var arr1 = []
        for (let i in this.TreeDataOrder) {
          if (this.TreeDataOrder[i]._select == true) {
            for (let j in this.TreeDataOrder[i].style) {
              for (let k in this.TreeDataOrder[i].style[j]) {
                arr1.push(this.TreeDataOrder[i].style[j][k])
              }
            }
          }
        }
        console.log(arr1)
        this.HangListVl = arr1
        this.$refs['isReloadPub'].RestartData()
      },
      NextOrderDataTwo(data) {
        this.HangPageVal = data.page
        this.HangeLineData()
      },
      HangeLineData() {
        const data = {
          page: this.HangPageVal
        }
        HangData(data).then((res) => {
          this.TreeDataOrder = res.data.data
          this.HangTotal = res.data.total
          console.log(this.HangTotal)
        })
      },
      deel3() {
        this.dele3 = false;
      },
      updateDataPage() {
        this.isUPload = true
      },
      OnSaveDynamicData() {
        var arr1 = []
        console.log(this.abc)
        for (let i in this.abc) {
          var arr2 = []
          for (let j in this.abc[i]) {
            var val1 = this.abc[i][j].style.yuanwid
            var val2 = parseInt(val1.slice(0, -2))
            arr2.push(val2)
          }
          arr1.push(arr2)
        }
        var isPostData = [];
        console.log(arr2)
        if (this.UseHang != 0) {
          for (let i=0;i<this.UseHang;i++) {
            isPostData.push(arr1[i])

          }
        } else {
          isPostData = arr1
        }
        console.log(isPostData)
        var data = {
          arr: isPostData,
          Width: this.wid,
          SoCode: this.ProductsCsCode,
          Name: this.ProductName,
          spec: this.DisPathListSync,
          cut: this.cutVal,
          FenQie: this.fqcd,
          group: this.groupCode,
          MakeGroupval: this.MakeGroupval
        }

        if (this.IsSetType == "cationg") {
          LimitPageSellOrderData(data).then((res) => {
            console.log(res)
            if (res) {
              this.$message("派工完成")
            }
          })
        }
        if (this.IsSetType == undefined || this.IsSetType == null || this.IsSetType == 0) {
          this.$message("请选择模式")
        }
        if (this.IsSetType == "slitting") {
          LimitPageSlitData(data).then((res) => {
            if (res) {
              this.$message("派工完成")
            }
          })
        }
      },
      ComputeWinth() {
        this.valList = 0;
        if (this.fqcd != undefined) {
          for (let i in this.menudata) {
            this.menudata[i].count = Math.ceil(this.menudata[0].cInvCode * 0.000001 * this.menudata[i].coding * 0.001 * 900 * this.fqcd)
            this.valList = this.valList + this.menudata[i].count
          }
        }
        console.log(this.valList)
      },
      NextOrderData(data) {
        DynamicOrder(data).then((res) => {
          var js = JSON.parse(res.data.res)
          var arr = [];
          for (let i in js) {
            arr.push(js[i])
          }
          this.TreeData = arr
          this.total = res.data.total
        })
      },
      OrderListData() {
        DynamicOrder().then((res) => {
          this.TreeData = res.data.data
          this.total = res.data.total
        })
      },
      showIndentLeft() {
        this.dele2 = true;
      },
      showIndentRight() {
        this.dele = true;
      },
      PostNewMakerArr() {
        let arr = [];
        this.DiagSyncData = true
        var valList = 0;
        if (this.valList > 2000) {
          this.$message("数据总数已大于2000，请谨慎选择;总数为：" + this.valList)
          this.DiagSyncData = true
        } else {
          for (let i in this.TreeData) {
            for (let j in this.TreeData[i].children) {
              if (this.TreeData[i].children[j]._select === true) {
                let arr2 = {
                  number: parseInt(this.TreeData[i].children[j].cSOCode),
                  count: parseInt(this.TreeData[i].children[j].pice),
                  coding: parseInt(this.TreeData[i].children[j].cDefine34),
                  cInvCode: parseInt(this.TreeData[i].children[j].cInvStd),
                };
                this.menudata.push(arr2)
              }
            }
          }
          this.$refs.isReload.RestartData();
        }
        for (let i in this.menudata) {
          valList += this.menudata[i].count
          this.valList = valList
        }
        if (valList > 2000) {
          this.$message("数据总数已大于2000，请谨慎选择;总数为：" + valList)
        }
        this.$message("菜单选择完成，请生产派工;总数为：" + this.valList)
        if (this.valList > 3000) {

        }
      },
      isMouseOut(index) {
        let re = document.querySelectorAll('.contain');
        re[index].style.background = "#ddd"
      },
      IsMouseUp(value) {
        var re = document.querySelectorAll('.contain');
        re[value].style.background = "rgb(110, 110, 200)"
      },
      IsClickCtrl(e, index) {
        e.preventDefault();
        if (e.button === 0 && this.isCtrl) {
          this.divindexData = index;
          let re = document.querySelector('.Menucontrol');
          re.style.left = e.x - 300 + "px";
          re.style.top = e.y + 'px';
        }
      },
      isColorStopSync(value) {
        this.isColorStop = value
      },
      AddDivWidth(data) {
        this.addWidthDataSon = data;
        if (this.divindexData || this.divindexData === 0) {
          if (data) {
            let wid = Math.ceil(data / this.ratio) + 'px';
            let addjson = {
              style: {
                yuanwid: data + 'px',
                yuanwidth: '',
                float: 'left',
                width: wid,
                height: '100px',
                fontSize: "14px",
                color: "#ffffff",
                left: 0,
                backgroundColor: "#333333",
                top: '0px'
              },
              text: '新的div'
            };
            let le = 0;
            for (let i in this.abc[this.divindexData]) {
              let num = this.abc[this.divindexData][i].style.width;
              let val1 = num.indexOf('p');
              let val2 = num.slice(0, val1);
              le += parseInt(val2)
            }
            addjson.style.left = le + 'px';
            this.abc[this.divindexData].push(addjson)
            console.log(this.abc[this.divindexData])
          }
        } else {
          this.$message("请按Ctrl+鼠标左键选择你想要编辑的行")
        }
      },
      load(tree, treeNode, resolve) {
        resolve([])
      },
      AddJsonArr(MouseData, ListData, DataData) {
        console.log(DataData)
      },
      /*
      * 触底刷新
      * */
      localMore() {
        if (this.abc.length !== 0) {
          this.isDataLoad++;
          this.busy = true;
          Axios.post('http://118.24.131.216/production/GetPaixuListData').then((res) => {
            var data = res.data.arr;
            setTimeout(() => {
              for (let i in data) {
                this.abc.push(data[i])
              }
            }, 500)
          })
          this.busy = false
        }
      },
      changWdthOrQie(values) {
        var machine;
        for (let i in this.MakeGroup) {
          if (this.MakeGroup[i].group_id == values) {
            machine = this.MakeGroup[i].group_id
            this.MinWid = parseInt(this.MakeGroup[i].group_Minscope)
            this.MaxWid = parseInt(this.MakeGroup[i].group_Maxscope)
            this.groupCode = this.MakeGroup[i].groupCode
          }
        }
      },
      changeWidth() {
        this.wid = parseInt(this.wid2);
        if (parseInt(this.wid2) > this.MaxWid) {
          alert("请输入" + this.MaxWid + "以内的数")
        }
        if (parseInt(this.wid2) < this.MinWid) {
          alert("请输入大于" + this.MinWid + "的数")
        }
      },
      /*
      * 发送请求（用于测试接口功能）
      * */
      sendData() {
        var that = this;
        var json = that.abc;
        var arr2 = [];
        var diff = [];
        for (var i in json) {
          var arr1 = [];
          for (var j in json[i]) {
            var val1 = json[i][j].style.width;
            var val2 = val1.indexOf('p');
            var wid = parseInt(val1.slice(0, val2));
            arr1.push(wid)
          }
          arr2.push(arr1)
        }

        for (let i in arr2) {
          var diff2 = [];
          for (let j in arr2[i]) {
            if (arr2[i][j] !== this.abccope[i][j]) {
              var diffval = {};
              diffval = {
                index: j,
                value: arr2[i][j]
              };
              diff2.push(diffval)
            } else {
              console.log('noDiff')
            }
          }
          if (diff2.length !== 0) {
            var diffval2 = {};
            diffval2 = {
              index: i,
              value: diff2
            };
            diff.push(diffval2)
          }
        }
      },
      deel(val1, val2) {
        this.dele = false;
      },
      deel2() {
        this.dele2 = false
      },
      fetchData() {
        import('./content.js').then(data => {
          this.dele = false;
          setTimeout(() => {
            this.$nextTick(() => {
              window.print()
            }, 1000)
          });
        })
      },

      /*

      /测试请求（废弃）
       */
      GetListData() {
        this.PostLoding = true;
        Axios.post('http://118.24.131.216/production/GetPaixuListData').then((res) => {
          this.abc = res.data.arr;
          var arr2 = [];
          for (var i in res.data.arr) {
            var arr1 = [];
            for (var j in res.data[i]) {
              var val1 = res.data[i][j].style.width;
              var val2 = val1.indexOf('p');
              var wid = parseFloat(val1.slice(0, val2));
              arr1.push(wid)
            }
            arr2.push(arr1)
          }
          this.abccope = arr2;
          this.PostLoding = false;
        })
      },
      /*valList
      /生产班组
       */
      groupMaker() {
        Axios.post(this.HttpUrl + '/production/groupMaker').then((res) => {
          this.MakeGroup = res.data
        })
      },
      /*
      * 生成排版
      * */
      onSave() {
        console.log(this.menudata)
        if (this.IsSetType == "cationg") {
          let data = {
            kd: this.wid,
            bj: this.QieVal,
            yfqs: this.cutVal,
            menuwid: this.menudata,
            hfqs: this.rowCutVal,
            n: this.valList,
            pbsj: [],
            num: 0,
            remark: {
              kw: '宽度',
              bj: "切边距",
              hfqs: "行分切数",
              menuwid: "选择的宽度"
            }
          }

          if (data.menuwid.length == 0) {
            this.$message("请先选择订单")
          } else {
            console.log(data)
          }
          Axios.post("http://1.194.239.69:8094/dtpb/LayoAlgo", data)
            .then((ress) => {
              var startVal = 0
              var arrRess = [];
              this.$nextTick(() => {
                this.abc = [];
                this.abccope = [];
                setTimeout(() => {
                  var a = ress.data.pbsj
                  this.abc = a
                  this.ratio = this.wid / 1000
                  console.log(this.abc)
                }, 500);
                console.log(this.abc)
                this.PostLoding = false
              })
            });
        }
        if (this.IsSetType == undefined || this.IsSetType == null || this.IsSetType == 0) {
          this.$message("请选择模式")
        }
        if (this.IsSetType == "slitting") {
          var num = this.HangListVl.length
          let data = {
            kd: this.wid,
            bj: this.QieVal,
            yfqs: this.cutVal,
            menuwid: this.menudata,
            hfqs: this.rowCutVal,
            n: this.valList + num,
            pbsj: this.HangListVl,
            num: num,
            remark: {
              kw: '宽度',
              bj: "切边距",
              hfqs: "行分切数",
              menuwid: "选择的宽度"
            }
          }
          if (data.menuwid.length == 0) {
            this.$message("请先选择订单")
          } else {
            console.log(data)
          }
          console.log(this.HangListVl)
          Axios.post("http://1.194.239.69:8094/dtpb/LayoAlgo", data)
            .then((ress) => {
              var startVal = 0
              var arrRess = [];
              this.$nextTick(() => {
                this.abc = [];
                this.abccope = [];
                setTimeout(() => {
                  this.abc = ress.data.pbsj
                  console.log(this.abc)
                  this.ratio = this.wid / 1000
                }, 500);
                for (let i in this.abc) {
                  this.abc[i]['value'] = startVal
                  startVal += 1
                }
                console.log(this.abc)
                this.PostLoding = false
              })
            });
        }

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
  .BackQie2 {
    /* position: absolute; */
    background: #8e388e;
    width: 1100px;
  }

  .Menucontrol {
    width: 1500px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #b3c0d1;
    position: fixed;
    z-index: 999;
    left: 220px;
    top: 100px;
  }

  .Menucontrol2 {
    width: 700px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #b3c0d1;
    position: fixed;
    z-index: 999;
    left: 220px;
    top: 200px;
  }

  .control {
    width: 250px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #b3c0d1;
    position: fixed;
    z-index: 999;
    right: 20px;
    top: 100px;
  }

  .del {
    position: absolute;
    width: 2px;
    height: 2px;
    top: 5px;
    right: 5px;
    padding: 5px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  }

  .contain {
    position: relative;
    width: 900px;
    height: 900px;
    background: #ddd;
    user-select: none;
  }

  .main-container {
    overflow: auto;
    height: 100%;
    /* height: 1000px; */
  }

  .EnumDataShow {
    position: relative;
    background: #0a76a4;
    height: 100%;
  }

  .app-main[data-v-6beed8bc] {
    overflow: unset;
  }

  .drag.active {
    border-radius: 5px;
    border: 1px solid #85ce61;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  }
</style>
<style scoped>
  /* .app-main {
    overflow: unset;
  } */
</style>
