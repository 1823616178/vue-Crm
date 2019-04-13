
<template>
  <vueCropper height="562px"
              ref="cropper"
              :img="imgUrl"
              :outputSize="option.size"
              :outputType="option.outputType"
              :info="true"
              :guides="true"
              :high='option.high'
              :fixed="true"
              :full="option.full"
              :canMove="option.canMove"
              :canMoveBox="option.canMoveBox"
              :original="option.original"
              :autoCrop="option.autoCrop"
              :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight"
              :fixedBox="option.fixedBox"
              :fixedNumber="option.fixedNumber"
              :maxImgSize="option.maxImgSize"
              @realTime="realTime"
              :infoTrue="option.infoTrue"
              @imgLoad="imgLoad">
  </vueCropper>
</template>
<script>
// 引入组件
import { VueCropper } from "vue-cropper";
export default {
  components: {
    VueCropper
  },
  props: {
    imgUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      option: {
        img: "",
        size: 0.5,
        full: true,
        outputType: "png",
        canMove: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        high: true,
        autoCropWidth: 252,
        autoCropHeight: 140,
        fixedBox: false,
        infoTrue: false,
        downImg: "#",
        fixed: true,
        fixedNumber: [16, 9],
        maxImgSize: 3000 // 图片最大像素
      }
    };
  },
  methods: {
    changeScale (num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight () {
      this.$refs.cropper.rotateRight();
    },
    finish (type) {
      // 输出
      var test = window.open("about:blank");
      test.document.body.innerHTML = "图片生成中..";
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true;
          this.modelSrc = data;
        });
      }
    },
    realTime (data) {
      // 实时预览函数
      let imgAxis = this.$refs.cropper.getImgAxis();
      let cropAxis = this.$refs.cropper.getCropAxis();
      let cropImgX = cropAxis.x1 - imgAxis.x1;
      let cropImgY = cropAxis.y1 - imgAxis.y1;
      data.x = cropImgX;
      data.y = cropImgY;
      // 把数据返给父组件		
      this.$emit("getPreview", data);
    },
    down (type) {
      // event.preventDefault()
      var aLink = document.createElement("a");
      aLink.download = "author-img"; // 输出
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          console.log(data);
          this.downImg = window.URL.createObjectURL(data);
          // aLink.download = this.downImg;
          console.log(this.downImg);
          aLink.href = window.URL.createObjectURL(data);
          aLink.click();
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data;
          aLink.href = data;
          aLink.click();
        });
      }
    },
    uploadImg (e, num) {
      // 上传图片;
      // this.option.img;
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要;
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      }; // 转化为base64;
      reader.readAsDataURL(file); // 转化为blob reader.readAsArrayBuffer(file)
    },
    imgLoad (msg) {
      console.log(msg);
    }
  }
};
</script>
<style scoped>
</style>