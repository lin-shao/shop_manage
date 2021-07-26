<template>
    <div>
          <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-button type="primary" @click="addCateDiglog">添加分类</el-button>
            </el-row>
            <el-row>
              <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border class="tree-table">
                  <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                  </template>
                  <template slot="order" slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                  </template>
                  <template slot="operate"> 
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </template>
            </tree-table>
            </el-row>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="添加分类"
            :visible.sync="addCatedialogVisible"
            width="50%" @close="addCateDialogClosed">
            <el-form :model="cateForm" :rules="caterules" ref="catrFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动名称">
                    <el-input v-model="cateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="catehandleChange" clearable change-on-select>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:"Cate",
    data(){
        return {
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            addCatedialogVisible:false,
            cateList:[],
            total:0,
            columns:[{
                label:"分类名称",
                prop:"cat_name"
            },{
                label:"是否有效",
                //表示将当前列定义为模板列
                type:"template",
                //表示当前这一列使用模板名称
                template:'isok'
            },
            {
                label:"排序",
                //表示将当前列定义为模板列
                type:"template",
                //表示当前这一列使用模板名称
                template:'order'
            },
            {
                label:"操作",
                //表示将当前列定义为模板列
                type:"template",
                //表示当前这一列使用模板名称
                template:'operate'
            }],
            //添加分类表单数据对象
            cateForm:{
                cat_name:'',
                cat_pid:'',
                cat_level:''
            },
            //添加分类表单的验证规则对象
            caterules: {
            name: [
                { required: true, message: '请输入分类名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ]},
            //父级分类的列表
            parentCateList:[],
            //指定级联选择器的配置对象
            cascaderProps:{
                value:"cat_id",
                label:"cat_name",
                children:"children"
            },
            //双向绑定选中的id值
            selectedKeys:[]
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
       async getCateList(){
            const {data:res} = await this.$http.get("categories",{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error("获取商品分类失败！")
            }
            this.cateList = res.data.result;
            this.total = res.data.total;
            console.log(res.data);
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        //触发添加分类按钮的事件
        addCateDiglog(){
            this.getParentCateList();
            this.addCatedialogVisible = true;
        },
        //获取父级分类数据
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error("获取父级分类失败！")
            }
            this.parentCateList = res.data;
            console.log(res.data);
        },
        //监听级联选择器发生变化的事件
        catehandleChange(){
            console.log(this.selectedKeys);
            if(this.selectedKeys.length >0){
                //父级分类的id
                this.cateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
                this.cateForm.cat_level = this.selectedKeys.length;
                return
            }else{
                this.cateForm.cat_pid = 0;
                this.cateForm.cat_level = 0;
            }
        },
        addCate(){
           this.$refs.catrFormRef.validate(async valid =>{
               if(!valid) return
                const{data:res} = await this.$http.post("categories",this.cateForm)
                if(res.meta.status !== 201){
                    return this.$message.error("添加分类失败！")
                }
                this.$message.success("添加分类成功！")
                this.getCateList()
                this.addCatedialogVisible = false;
           })
        },
        addCateDialogClosed(){
            this.$refs.catrFormRef.resetFields();
            this.selectedKeys = [];
            this.cateForm.cat_level = 0;
            this.cateForm.cat_pid = 0;
        }
    }
}
</script>
<style scoped>
    .tree-table{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>