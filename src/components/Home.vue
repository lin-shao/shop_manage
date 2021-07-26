<template>
<el-container class="main">
    <el-header class="el-header">
        <div>
            <img src="../assets/dian.png" alt="">
            <span style="font-size: 25px;margin-left: 15px;">电商后台管理系统</span>
        </div>
      <el-button type="info" @click="resetToken">退出</el-button>
    </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'" class="el-aside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="menuObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavstate(subItem.path)" :default-active="activePath">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
        </template>
          </el-menu-item>
        </el-submenu>
    </el-menu>
    </el-aside>
    <el-main class="el-main"><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
    name:"Home",
    data(){
        return{
            menulist:[],
            menuObj:{
                "125":"el-icon-s-custom",
                "103":"el-icon-s-tools",
                "101":"el-icon-s-goods",
                "102":"el-icon-s-order",
                "145":"el-icon-s-data"
            },
            isCollapse:false,
            activePath:''
        }
    },
    created(){
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem("activePath")
    },
    methods:{
        resetToken(){
            window.sessionStorage.clear()
            this.$router.push("/login")
        },
        //获取所有菜单
        async getMenuList(){
            const {data:res} = await this.$http.get("menus")
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            console.log(res);
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        saveNavstate(activePath){
            window.sessionStorage.setItem("activePath",activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style scope>
    .main{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        padding-left: 5px;
    }
    .el-header>div{
        display: flex;
        align-items: center;
    }
    .el-aside{
        background-color: #333744;
    }
    .el-main{
        background-color: #EAEDF1;
    }
    img{
        width: 50px;
        height: 50px;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>