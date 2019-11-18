<template>
  <div :class="type ? 'hideSidebar index' : 'index'">
    <side-bar class="sidebar-container" :type='type'></side-bar>
    <div class="main-container">
      <nav-bar v-model="type"></nav-bar>
      <div class="main">
        <el-main>
          <router-view></router-view>
        </el-main>
      </div>

    </div>
  </div>
</template>

<script>
import sideBar from './component/SideBar.vue'
import navBar from './component/navBar.vue'
export default {
    components: { sideBar, navBar },
    data () {
        return { type: false }
    }
}
</script>

<style scoped lang="scss">
.main {
  height: 94vh;
  overflow: scroll;
}
.el-main {
  padding-bottom: 0;
  height: 100%;
}
</style>
