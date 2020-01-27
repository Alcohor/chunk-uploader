<template>
  <div class="chunk-uploader-wraper">
    <input type="file" @change="handleFileChange" />
    <el-button @click="submitUpload" class="submit-btn" type="primary">上传</el-button>
  </div>
</template>

<script>
import ChunkUploader from '../script/chunkUploader'
export default {
  data() {
    return {
      uploadOption: {
        url: 'http://localhost:3000',
        method: 'post',
        headers: {}
      },
      chunkSize: 10 * 1024 * 1024,
      uploadFile: null
    }
  },
  methods: {
    handleFileChange(e) {
      const [ file ] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.uploadFile = file;
    },
    submitUpload() {
      const chunkUploader = new ChunkUploader(this.uploadOption, this.uploadFile, this.chunkSize)
      chunkUploader.handleUpload();
    }
  }
}
</script>

<style lang="scss" scope>
.chunk-uploader-wraper {
  width: 100%;
  display: flex;
  .submit-btn {
    margin-left: 10px;
  }
}
</style>