<template>
  <div id="app">
    
    <ChunkUploader/>
  </div>
</template>

<script>
import ChunkUploader from './components/ChunkUploader.vue'

export default {
  name: 'app',
  components: {
    ChunkUploader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
