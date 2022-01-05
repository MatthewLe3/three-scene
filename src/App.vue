<template>
  <div id="app">
    <ThreeScene/>
  </div>
</template>

<script>
import ThreeScene from './views/ThreeScene.vue'
export default {
  components:{
    ThreeScene
  }
  
}
</script>

<style lang="less"> 
html,body{
  height: 100%;
  widows: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
