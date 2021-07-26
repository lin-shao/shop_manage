<template>
    <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    <el-card>
        <el-table
            :data="rolesList"
            border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bgbottom',i1 === 0 ? 'bgtop':'','vcenter']" v-for="(item,i1) in scope.row.children" :key="i1">
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row :class="[i2 === 0 ? '':'bgtop','vcenter']" v-for="(item1,i2) in item.children" :key="i2">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item2,i3) in item1.children" :key="i3" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
            <el-button size="mini" type="warning" @click="showRightDialog(scope.row)">分配权限</el-button>
            </template>
            </el-table-column>
            </el-table>
    </el-card>
    <el-dialog
        title="分配权限"
        :visible.sync="setRightdialogVisible"
        width="50%" @close="cleardefKeys">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    name:"Roles",
    data(){
        return{
            rolesList:[],
            setRightdialogVisible:false,
            rightsList:[],
            treeProps:{
                //嵌套的子元素
                children:'children',
                //要展示的标签名字
                label:'authName'
            },
            defKeys:[],
            roleId:0
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
   async getRolesList(){
        const {data:res}  = await this.$http.get("roles/")
        if(res.meta.status !== 200){
            this.$message.error("获取角色信息失败！")
        }
        this.rolesList = res.data;
        console.log(res.data);
        // this.$message.success("获取角色信息成功！")
    },
    //删除权限节点事件
    async removeRightById(role, rightId){
        const confirmresult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err=>err)
        console.log(confirmresult);
        if(confirmresult !== 'confirm'){
           return this.$message.info("取消了删除！")
        }
        const{data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200){
           return this.$message.error("删除权限失败！")
        }
        role.children = res.data;
    },
    //获取权限全部数据，并展示在弹出的对话框中
    async showRightDialog(role){
        this.roleId = role.id
      const {data:res} = await this.$http.get("rights/tree")
      if(res.meta.status !== 200){
          return this.$message.error("获取权限数据失败！")
      }
      //保存数据
      this.rightsList = res.data;
    //   console.log(res.data);
      this.getLeafKeys(role,this.defKeys)
      console.log(this.defKeys);
      this.setRightdialogVisible = true;
    },
    //把当前行的权限数据的id值添加到数组中，用default-checked-keys="defKeys"显示默认选中的值
    getLeafKeys(node,arr){
        if(!node.children){
           return arr.push(node.id)
        }
        //递归调用，遍历每个子节点
        node.children.forEach(item =>
            this.getLeafKeys(item,arr))
    },
    cleardefKeys(){
        this.defKeys = []
        // console.log(this.defKeys);
    },
    //分配权限的事件
   async allotRights(){
       const keys = [
           //可以得到选中权限的id值
           ...this.$refs.treeRef.getCheckedKeys(),
           //可以得到半选中权限的id值
           ...this.$refs.treeRef.getHalfCheckedKeys()
       ]
       //用，号拼接两个字符串时
       const idStr = keys.join(",")
       const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
       if(res.meta.status !== 200){
           return this.$message.error("分配权限失败！")
       }
       this.$message.success("分配权限成功！");
       this.getRolesList();
        this.setRightdialogVisible = false;
    }

    }
}
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }
    .bgtop{
        border-top: 1px solid #eee;
    }
    .bgbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>