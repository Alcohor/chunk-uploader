class ChunkUploader {
  constructor(uploadOption, uploadData, chunkSize, timeoutTime = 30 * 1000) {
    this.uploadOption = uploadOption;
    this.uploadData = uploadData;
    this.chunkSize = chunkSize;
    this.timeoutTime = timeoutTime;
    this.chunkDataList = [];
    this.uploadChunkData = []
  }
  uploadRequest(chunkData) {
    const {
      headers,
      url,
      method
    } = this.uploadOption
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key])
      })
      xhr.send(chunkData);
      xhr.onload = e => {
        resolve(e.target.response);
      }
      xhr.onerror = error => reject(error);
    });
  }

  chunk(arr, chunkSize = 1) {
    let arrParamType = Object.prototype.toString.call(arr).slice(8, -1);
    let chunkSizeParamType = typeof chunkSize;
    if (arrParamType !== 'Array') {
      // let error = `TypeError: chunk expect an Array param at first, but got a/an ${arrParamType}`;
      // console.error(error);
      return [];
    } else if (chunkSizeParamType !== 'number') {
      // let error = `TypeError: chunk expect a Number param at last, but got a/an ${chunkSizeParamType}`;
      // console.error(error);
      return [];
    }
    let temp = arr.slice(0);
    let results = [];

    while (temp.length) {
      results.push(temp.splice(0, chunkSize));
    }
    return results;
  }

  createUploadFileChunk() {
    if (this.uploadData.size <= this.chunk) {
      return [this.uploadData]
    } else {
      let current = 0;
      let chunkList = []
      while (current < this.uploadData.size) {
        chunkList.push({
          file: this.uploadData.slice(current, current + this.chunkSize)
        });
        current += this.chunkSize;
      }
      return chunkList
    }
  }

  async uploadChunk() {
    const requestParamsList = this.uploadChunkData
      .map(({
        chunk,
        hash
      }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("filename", this.uploadData.name);
        return formData;
      })
    const httpConcurrencyCount = 6
    const requestParamsGroupList = this.chunk(requestParamsList, httpConcurrencyCount);
    for (const requestParamsGroup of requestParamsGroupList) {
      const requestList = requestParamsGroup.map(formData => this.uploadRequest(formData))
      window.console.log(requestParamsGroupList)
      window.console.log(requestList)
      // await Promise.all(requestList);
    }
  }

  async handleUpload() {
    const fileChunkList = this.createUploadFileChunk();
    window.console.log(fileChunkList)
    this.uploadChunkData = fileChunkList.map(({
      file
    }, index) => ({
      chunk: file,
      hash: `${this.uploadData.name}-${index}`
    }))
    window.console.log(this.uploadChunkData)
    await this.uploadChunk();
  }


}
export default ChunkUploader;