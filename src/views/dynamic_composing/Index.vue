<template>
  <div>
    <el-row type="flex"
            justify="center"
            v-loading.fullscreen.lock="loading" v-infinite-scroll="localMore" style="height: 100%;"
            infinite-scroll-disabled="busy" infinite-scroll-distance="5">
      <div class="BackQie2">
        <div v-for="(item,index) in abc"
             :key="index">
          <el-row type="flex"
                  v-loading="PostLoding"
                  justify="center"
                  style="text-align: center;">
            <div style="height: 100px;width: 50px;background: #0a76a4;line-height: 100px">{{index}}</div>
            <vueDragInfinite :json="item"
                             :name="name"
                             @save="saveJson"
                             ref="dragContain"
                             :borderWidth='QieBianVal'
                             :FenQieLength="FenQieLengthCav"/>
          </el-row>
          <div v-show="(index+1)%3===0" style="background: #4AB7BD;width: 100%;height: 10px;"></div>
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
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="生产班组">
            <div class="block">
              <!--                <span class="demonstration">当前画布宽度：{{wid}}</span>-->
              <el-select v-model="MakeGroupval"
                         @change="changWdthOrQie"
                         placeholder="选择生产班组">
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
                <!--                <span class="demonstration">当前画布宽度：{{wid}}</span>-->
                <span>当前宽度为:{{wid}}</span>
                <el-slider v-model="wid"
                           :max="MaxWid"
                           :min="MinWid"></el-slider>
                <span>手动输入宽度</span>
                <div @keypress.enter="changeWidth">
                  <el-input style="width: 100px" size="mini" v-model="wid2"></el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="行分切数">
              <el-input v-model="FenQieVal"></el-input>
            </el-form-item>
            <el-form-item label="分切长度">
              <el-input v-model="FenQieLength"></el-input>
            </el-form-item>
            <el-form-item label="刀数">
              <div class="block">
                <span class="demonstration">刀数</span>
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
            <el-form-item>
              <el-button type="primary"
                         size="mini"
                         @click="sendData">发送请求
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         size="mini"
                         @click="fetchData">点击打印
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
                <span class="demonstration">切边距为：{{QieBianVal}}</span>
                <el-slider v-model="QieVal"
                           :max="300"></el-slider>
              </div>
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
            <!-- <el-col>
              <el-button type="primary"
                         size="mini"
                         @click="enumData()">生成随机数

              </el-button>
            </el-col> -->
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

    <div class="Menucontrol"
         v-drag="contain"
         v-show="dele">
      <div style="line-height:30px;background:#409EFF;cursor:move;color:#fff;text-indent:15px;">
        订单列表
        <el-button type="danger"
                   class="del"
                   @click="deel(index,$event)"
                   circle></el-button>
      </div>
      <div style="padding:7px;"
           @mousedown="mouseDown($event,false)">
        <el-tree :props="props" :load="loadNodel" lazy show-checkbox></el-tree>
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
  import {setTimeout} from 'timers';

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
      },
      FenQieLengthCav() {
        return parseInt(this.FenQieLength)
      }
    },
    components: {vueDragInfinite, Axios},
    data: function () {
      return {
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        isDataLoad: 0,
        FenQieLength: 100,//分切长度
        FenQieVal: undefined,//分切数
        blackVal: undefined,
        MaxWid: 2000,
        MinWid: 0,
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
        json: [],
        name: '动态排版',
        contain: {
          xx: 500,
          yy: 500
        },
        abc: [],
        abccope: [],
        add: [],
        busy: false,
      }
    },
    created() {
      this.heig = window.innerHeight;
      this.GetListData();
      this.groupMaker();
    },
    methods: {
      loadNodel(node, resolve) {
        console.log(node);
        if (node.level === 0) {
          return resolve(
            [
              {name: 'region'},
              {name: 'region'},
              {name: 'region'},
              {name: 'region'}
            ]
          );
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          const data =
            [
              {
                name: 'leaf',
                leaf: true
              },
              {
                name: 'zone',
                leaf: true
              }
            ];

          resolve(data);
        }, 500);
      },
      localMore() {
        this.isDataLoad++;
        console.log(this.isDataLoad);
        this.busy = true;
        Axios.post('http://127.0.0.1/production/GetPaixuListData').then((res) => {
          var data = res.data.arr;
          setTimeout(() => {
            for (let i in data) {
              this.abc.push(data[i])
            }
          }, 500)
        })
        this.busy = false
      },
      changWdthOrQie(values) {
        let data = values;
        let data2 = data.split('-')
        this.wid = parseInt(data2[0]);
        this.MinWid = parseInt(data2[0]);
        this.MaxWid = parseInt(data2[1]);
        console.log(data2);
        // this.wid = values.MinWidth;
        // this.MinWid = values.MinWidth;
        // this.MaxWid = values.MaxWidth;
      },
      changeWidth() {
        this.wid = parseInt(this.wid2);
        if (parseInt(this.wid2) > this.MaxWid) {
          alert("请输入" + this.MaxWid + "以内的数")
        }
        if (parseInt(this.wid2) < this.MinWid) {
          alert("请输入大于" + this.MinWid + "的数")
        }
        console.log(this.wid)
      },
      sendData() {
        var that = this;
        var json = that.abc
        var arr2 = [];
        var diff = [];
        for (var i in json) {
          var arr1 = []
          for (var j in json[i]) {
            var val1 = json[i][j].style.width
            var val2 = val1.indexOf('p')
            var wid = parseInt(val1.slice(0, val2))
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
        console.log(diff)
      },
      deel(val1, val2) {
        this.dele = false;
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
      GetListData() {
        this.PostLoding = true;
        Axios.post('http://127.0.0.1/production/GetPaixuListData').then((res) => {
          this.abc = res.data.arr;
          var arr2 = [];
          for (var i in res.data.arr) {
            var arr1 = []
            for (var j in res.data[i]) {
              var val1 = res.data[i][j].style.width
              var val2 = val1.indexOf('p')
              var wid = parseFloat(val1.slice(0, val2))
              arr1.push(wid)
            }
            arr2.push(arr1)
          }
          this.abccope = arr2
          console.log(this.abccope)
          // this.ListVal = res.data.data;
          // this.arrList = res.data.List;
          this.PostLoding = false;
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
      groupMaker() {
        Axios.post(this.HttpUrl + '/production/groupMaker').then((res) => {
          this.MakeGroup = res.data
          console.log(this.MakeGroup)
        })
      },
      onSave() {
        let data = {
          kw: this.wid,
          bj: this.QieVal,
          hfqs: this.blackVal,
          fqs: this.FenQieVal,
          remark: {
            kw: '宽度',
            bj: "切边距",
            hfqs: "行分切数",
            fqs: "分切数"
          }
        }
        console.log(this.FenQieLength)
        // "http://192.168.2.118/Spb/testsf?n="+this.enumVal+"&kw="+this.wid+'&bj='+this.QieVal+"&hfqs="+this.blackVal+"&fqs="+this.FenQieVal
        Axios.post("http://127.0.0.1:6604/home", {data}).then((ress) => {
          this.$nextTick(() => {
            this.abc = [];
            this.abccope = [];
            setTimeout(() => {
              this.abc = ress.data.arr
            }, 500);
            console.log(this.abc.arr)
            var arr2 = [];
            for (var i in ress.data.arr) {
              var arr1 = []
              for (var j in ress.data.arr[i]) {
                var val1 = ress.data.arr[i][j].style.width
                var val2 = val1.indexOf('p')
                var wid = parseInt(val1.slice(0, val2))
                arr1.push(wid)
              }
              arr2.push(arr1)
            }
            setTimeout(() => {
              this.abccope = arr2
              console.log(this.abccope)
            }, 500)
            // var code = JSON.stringfy(ress.data.arr)
            // this.abc.push();
            this.PostLoding = false
          })
          // if (ress) {
          //   Axios.post("http://192.168.2.118/Spb/testArr?n=" + this.enumVal).then((res) => {
          //     // this.abc = res.data
          //     // this.POSTDATA = ress.data,
          //     // this.centerDialogVisible = true
          //   })
          // }
        });
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
    width: 250px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #b3c0d1;
    position: fixed;
    z-index: 999;
    left: 220px;
    top: 100px;
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
