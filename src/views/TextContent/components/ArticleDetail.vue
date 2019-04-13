<template>
  <div class="createPost-container">
    <el-form ref="postForm"
             :model="postForm"
             :rules="rules"
             class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading"
                   style="margin-left: 10px;"
                   type="success"
                   @click="submitForm">
          发布
        </el-button>
        <el-button v-loading="loading"
                   type="warning"
                   @click="draftForm">草稿</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;"
                          prop="title">
              <MDinput v-model="postForm.title"
                       :maxlength="100"
                       name="name"
                       required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="45px"
                                label="作者:"
                                class="postInfo-container-item">
                    <el-select v-model="postForm.author"
                               :remote-method="getRemoteUserList"
                               filterable
                               remote
                               placeholder="搜索用户">
                      <el-option v-for="(item,index) in userListOptions"
                                 :key="item+index"
                                 :label="item"
                                 :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="80px"
                                label="发布时间:"
                                class="postInfo-container-item">
                    <el-date-picker v-model="date"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="60px"
                                label="重要性:"
                                class="postInfo-container-item">
                    <el-rate v-model="postForm.importance"
                             :max="3"
                             :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                             :low-threshold="1"
                             :high-threshold="3"
                             style="margin-top:8px;" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;"
                      label-width="45px"
                      label="摘要:">
          <el-input v-model="postForm.content_short"
                    :rows="1"
                    type="textarea"
                    class="article-textarea"
                    autosize
                    placeholder="请输入内容" />
          <span v-show="contentShortLength"
                class="word-counter">{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item prop="content"
                      style="margin-bottom: 30px;">
          <Tinymce ref="editor"
                   v-model="postForm.content"
                   :height="400" />
        </el-form-item>
        <el-form-item prop="image_uri"
                      style="margin-bottom: 30px;">
          <el-row type="flex"
                  justify="start">
            <el-col span="10">
              <el-upload class="upload-demo"
                         drag
                         :action="uploadUrl"
                         multiple
                         :http-request="fnUploadRequest"
                         :data="data_extra">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip"
                     slot="tip">图片尽量缩小的上传，流量就是钱</div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { BosClient } from '@baiducloud/sdk';
import MarkdownEditor from "@/components/MarkdownEditor"
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle, gaveContent } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import oss from "ali-oss"
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { async } from 'q';
import fs, { constants } from 'fs'
import { connect } from 'net';
import { gzip } from 'zlib';
const content = null;

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0,
  date: undefined
}

export default {
  name: 'ArticleDetail',
  components: { MarkdownEditor, Tinymce, MDinput, Upload, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      date: undefined,
      uploadUrl: '',
      data_extra: {
        type: Object,
        required: true
      },
      content: content,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength () {
      return this.postForm.content_short.length
    },
    lang () {
      return this.$store.getters.language
    }
  },
  created () {
    // console.log(id)
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    MouseMV (site, event) {
      console.log(site)
      console.log(event)
    },
    fnUploadRequest (value) {
      let client = new oss({
        region: "oss-cn-beijing",
        accessKeyId: "LTAI9lK7KFOIOaJv",
        accessKeySecret: "gjnmHLlujSyIEe4gbPGx9dVgliVyr0",
        bucket: "nanzhu1"
      })
      // var name = value.name
      console.log()
      try {
        var file = value.file
        var name = value.file.name
        let result = client.put("chicken/" + name, file).then((result) => {
          console.log(result)
          if (result.res.status == 200) {
            this.$message({
              message: "上传成功",
              type: "success"
            })
          }
        })
        // if(result.[[PromiseValue]])
      } catch (err) {
        console.log(err)
      }
    },


    GetMarkDownData () {
      window.console.log(this.postForm.content)
    },
    fetchData (id) {
      console.log(id)
      gaveContent({ id }).then((res) => {
        console.log(res)
      })
      // fetchArticle(id).then(response => {
      //   this.postForm = response.data
      //   // Just for test
      //   this.postForm.title += `   Article Id: ${this.postForm.id} `
      //   this.postForm.content_short += `   Article Id: ${this.postForm.id} `

      //   // Set tagsview title
      //   this.setTagsViewTitle()
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    setTagsViewTitle () {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title} -${this.postForm.id} ` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm () {
      this.postForm.date = parseInt(this.date / 1000)
      // this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm.date)
      // console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          let title = this.postForm.title
          gaveContent(this.postForm, this.date).then((res) => {
            if (res) {
              console.log(res)
              this.loading = true,
                this.$notify({
                  title: '成功',
                  message: '发布文章成功',
                  type: 'success',
                  duration: 2000
                })
              this.postForm.status = 'published'
              this.loading = false
              console.log(this.postForm)
            }
            else {
              console.log('error submit!!')
              return false
            }
          })
        }
      })
    },
    draftForm () {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList (query) {
      userSearch(query).then(response => {
        console.log(response)
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.editor-container {
  margin-bottom: 20px;
  display: inline;
  display: flex
}
.drupView {
  background-color: rebeccapurple;
  width: 200px;
}
.iconView {
  float: right;
}
</style>
