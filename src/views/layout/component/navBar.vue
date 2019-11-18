<template>
  <div class="navbar">
    <div class="telescopic" @click="type = !type">
      <i :class="type ? 'left el-icon-s-fold' : 'right el-icon-s-fold'"></i>
    </div>
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="sideList.length && sideList[0].name === 'home'" :key="100" :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :key="5" v-if="breadList.name !== 'home'" :to="{ path: breadList.path }">{{breadList.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="me">
      <el-dropdown trigger="hover">
        <span>
          <el-avatar size='small' icon="el-icon-user-solid"></el-avatar>
          <span class="last">
            {{userName}}
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        value: Boolean
    },
    data() {
        return {
            type: this.value,
            userName: '',
            breadList: [],
            sideList: [],
            color: '#ccc'
        }
    },
    methods: {
        logout() {
            this.$confirm('确认退出吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$store.dispatch('delUserInfo')
                    this.$router.push('/login')
                })
                .catch(() => {})
        }
    },
    mounted() {
        let userInfo = this.$store.getters.userInfo

        this.userName = userInfo.userName
        this.breadList = this.$route
        this.sideList = this.$store.getters.userRoutes
    },
    watch: {
        type(newVal) {
            this.$emit('input', newVal)
        },
        $route() {
            this.breadList = this.$route
        }
    }
}
</script>

<style scoped lang="scss">
.navbar {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 6vh;
  vertical-align: middle;
  background-color: #fff;
  box-shadow: 0px 2px 2px #ccc;
  .telescopic {
    float: left;
    padding: 0 10px;
    line-height: 6vh;
    font-size: 24rem;
    cursor: pointer;
    > i {
      transition: transform 0.5s;
    }
  }
  .right {
    transform: rotateY(0);
  }
  .left {
    transform: rotateY(180deg);
  }
  .bread {
    float: left;
    line-height: 6vh;
    font-size: 20rem;
    > div {
      line-height: inherit;
    }
  }
  .me {
    cursor: pointer;
    float: right;
    padding-right: 40px;
    text-align: center;
    height: 100%;
    .el-avatar {
      width: 4vh;
      height: 4vh;
      line-height: 4vh;
      font-size: 16rem;
    }
    > div {
      line-height: 6vh;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .last {
        padding-left: 8px;
      }
    }
  }
}
</style>
