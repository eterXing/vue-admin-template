<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<script>
export default {
    // 重置路由
    provide () {
        return {
            reload: this.reload
        }
    },
    data () {
        return {
            isRouterAlive: true
        }
    },
    methods: {
        reload () {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        }
    },
    beforeCreate () {
        function getHTML () {
            function setHTML () {
                // 基础值
                var baseVal = 1,
                    // 设计稿的宽度
                    pageWidth = 1920,
                    // 要适配的屏幕的宽度?
                    screenWidth = document.querySelector('html').offsetWidth,
                    // 要设置的fontsize
                    fontsize = screenWidth * baseVal / pageWidth

                // 设置到html标签的中
                document.querySelector('html').style.fontSize = fontsize + 'px'
            }
            setHTML()
            // 为了在pc端更好的去调试
            onresize = function () {
                setHTML()
            }
        }
        getHTML()
    }
}
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
