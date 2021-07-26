<template>
    <div>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
             <el-row :gutter="20">
            <el-col :span="8"><el-input  placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @change="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button></el-input></el-col>
            <el-col :span="4"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
        </el-row>
        <el-table :data="userList" border stripe>
             <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column prop="mg_state" label="状态">
                <!-- 作用域插槽，获取当前一行的数据 -->
                <template slot-scope="scope">
                   <el-switch v-model="scope.row.mg_state" @change="userstatusChanced(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="190px">
                <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="Editdialog(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
       </el-pagination>
        </el-card>
        <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClose">
            <span>添加用户</span>
            <el-form :model="ruleForm" :rules="Formrules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改用户"
            :visible.sync="EditdialogVisible"
            width="30%" @close="editFormClosed">
            <el-form :model="editForm" :rules="Formrules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="分配角色"
            :visible.sync="roledialogVisible"
            width="30%" @close="setRoleDialogClosed">
            <div>
                <p>当前的用户:{{userInfo.username}}</p>
                <p>当前的角色:{{userInfo.role_name}}</p>
                <p>
                    <el-select v-model="rolevalue" placeholder="请选择">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.authName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'User',
    data(){
         var checkEmail = (regEmail, value, callback) => {
             regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的邮箱'));
        }
        let checkMobile = (regMobile, value, callback) => {
          regMobile = /^1[3|4|5|7|8][0-9]{9}$/
        if (regMobile.test(value)) {
          return callback()
        }
        callback(new Error('请输入正确的手机号'));
        }
        return{
         queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userList:[],
            total:0,
            addDialogVisible:false,
            EditdialogVisible:false,
            roledialogVisible:false,
            userInfo:{},
            roleList:[],
            rolevalue:'',
        ruleForm:{
            username:'',
            password:'',
            email:'',
            mobile:''
            
        },
        Formrules:{
            username:[
                { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 6, max: 15, message: '用户名长度在 6 到 15 个字符之间', trigger: 'blur' }
            ],
            password:[ { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度在 6 到 15 个字符之间', trigger: 'blur' }],
            email:[ { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator:checkEmail, trigger: 'blur' }],
            mobile:[ { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkMobile, trigger: 'blur' }]
        },
        editForm:{}
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
       async getUserList(){
        const {data:res} = await this.$http.get("users",{params:this.queryInfo})
        if(res.meta.status !== 200) return this.$message.error("获取数据失败")
        console.log(res);
        this.userList = res.data.users;
        this.total = res.data.total;
        },
        // 监听pagesize改变的事件，一页有多少条数据
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize
            this.getUserList()
        },
        //监听页面改变事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
        //当页面发生改变时，重新调用一下请求数据的函数
            this.getUserList()
        },
        //更新用户的状态
        async userstatusChanced(userinfo){
            console.log(userinfo);
        const {data:res} = await this.$http.put(`users/$(userinfo.id)/state/$(userinfo.mg_state)`)
        if(res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error("更新用户状态失败！")
        }
        this.$message.success("更新用户状态成功！")
        },
        //表单状态的重置
        addDialogClose(){
            this.$refs.ruleForm.resetFields()
        },
        addUser(){
            //表单验证，返回值为true或false
            this.$refs.ruleForm.validate(async valid =>{
                if(!valid) return
               const {data:res} = await this.$http.post("users",this.ruleForm)
               if(res.meta.status !==200) { this.$message.error("添加用户失败！")}
               this.$message.success("添加用户成功！");
               this.addDialogVisible = false;
               this.getUserList()
            })
        },
       async Editdialog(id){
           const {data:res} = await this.$http.get("users/"+id)
           if(res.meta.status !==200){
               return this.$message.error("查询用户信息失败！")
           }
            this.editForm = res.data;
            console.log(res.data)
            this.EditdialogVisible = true;
        },
        editFormClosed(){
            this.$refs.editFormRef.resetFields()
        },
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                console.log(valid)
                if(!valid) return;
               const {data:res} = await this.$http.put("users/"+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
               if(res !==200){
                   this.$message.error("更新用户信息失败！")
               }
                //关闭对话框
                this.EditdialogVisible = false;
                //刷新数据列表
                this.getUserList();
                //提示更改成功
                this.$message.success("更新用户信息成功！")
            })
        },
      async removeUserById(id){
          const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);          
        if(confirmresult !== "confirm"){
            return this.$message.info("已取消删除")
        }
        const {data:res} = await this.$http.delete("users/"+id)
        if(res.meta.status !== 200){
            this.$message.error("删除用户失败！")
        }
        this.$message.success("删除用户成功！")
        this.getUserList();
      },
      async setRole(userInfo){
          this.userInfo = userInfo;
          const {data:res} = await this.$http.get("roles/")
          if(res.meta.status !== 200){
              return this.$message.error("获取角色列表失败！")
          }
          this.roleList = res.data;
          this.roledialogVisible = true;
      },
      //保存要分配的新角色
       async saveRoleInfo(){
          if(!this.rolevalue){
             return this.$message.error("请选择要分配的角色！")
          }
        const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`)
        if(res.meta.status !== 200){
            return this.$message.error("更新角色失败！")
        }
        this.$message.success("更新角色成功！");
        this.getUserList();
      },
      //设置关闭对话框后重置
      setRoleDialogClosed(){
          this.rolevalue = '',
          this.userInfo = {}
      }
  }
}
</script>

<style scoped>
    
</style>