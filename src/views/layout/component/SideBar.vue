<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <div class="logo" v-if='type'>
      AM
    </div>
    <div class="logo" v-else>
      <span>asset</span>&nbsp;
      <span>Management</span>
    </div>
    <el-menu :default-active='$route.path' router unique-opened menu-trigger='click' :collapse="type" class="el-menu-vertical" background-color="rgb(113, 113, 198)" text-color="#fff">
      <div class="box" v-for="(item,index) in sideList" :key="index">
        <el-menu-item v-if="item.isOnce" :index="item.path + item.children[0].path">
          <i :class="item.icon"></i>
          <span slot="title">{{item.resourceName}}</span>
        </el-menu-item>
        <el-submenu :index="item.path" v-else>
          <template slot="title">
            <i :class="'iconfont '+ item.icon"></i>
            <span slot="title">{{item.resourceName}}</span>
          </template>
          <div class="subBox" v-for="(val,idx) in item.children" :key="idx">
            <el-menu-item v-if="!val.children.length" :index="item.path + '/' + val.path">
              <span>{{val.resourceName}}</span>
            </el-menu-item>
            <el-submenu v-else-if="val.children.length" :index="'/' + item.path + '/' + val.path">
              <template slot="title">{{val.resourceName}}</template>
              <el-menu-item v-for="(val2,idx2) in val.children" :key="idx2" :index="item.path + '/' + val.path + '/' + val2.path">{{val2.name}}</el-menu-item>
            </el-submenu>
          </div>
        </el-submenu>
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>
export default {
    props: {
        type: Boolean
    },
    data () {
        return {
            sideList: []
        }
    },
    mounted () {
    // 获取侧边栏列表
        this.sideList = this.$store.getters.userRoutes
        // 路由定向
        if (this.$router.history.current.path === '/') {
            this.$router.push(this.sideList[0].children[0].route)
        }
    }
}
</script>

<style scoped lang="scss">
.logo {
  position: relative;
  width: 100%;
  height: 6vh;
  line-height: 6vh;
  font-size: 20rem;
  text-align: center;
  color: #fff;
  background-color: $sideTitle;
  user-select: none;
  span:last-child {
    color: $color;
  }
}
.logo::after {
  content: "";
  display: block;
  position: absolute;
  z-index: 100;
  top: 100%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ccc;
}
</style>
