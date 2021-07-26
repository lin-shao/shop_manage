<template>
    <div class="contain_bgcolor">
       <div class="login_box">
           <div class="avater_box">
               <img src="../assets/login.png" alt="">
           </div>
           <div>
               <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormrules" ref="Loginform">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btus">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
               </el-form>
                
           </div>
       </div>
    </div>
</template>
<script>
export default {
    name:'Login',
    data(){
        return{
            loginForm:{
                username:"admin",
                password:"123456"
            },
            //表单验证
            loginFormrules:{
        username:[{ required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password:[{ required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
        }
        }
},
    methods:{
        resetLoginForm(){
            //表单重置
            this.$refs.Loginform.resetFields()
        },
        login(){
            this.$refs.Loginform.validate(async value =>{
                if(!value) return
                const {data:res} =await this.$http.post("login",this.loginForm)
                if(res.meta.status !== 200) return this.$message.error("登录失败")
                this.$message.success("登陆成功")

                window.sessionStorage.setItem("token",res.data.token);
                this.$router.push("/home");
            })
        }
    }
}
</script>

<style scope>
    .contain_bgcolor{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .avater_box{
        position: absolute;
        background-color: #2b4b6b;
        width: 110px;
        height: 110px;
        border-radius: 90%;
        border: 2px solid slategray;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
    }
    img{
        width: 80px;
        height: 80px;
    }
    .login_form{
        position: absolute;
        padding: 0 20px;
        width: 100%;
        box-sizing: border-box;
        bottom: 0px;
    }
    .btus{
        text-align: center;
    }
</style>