<template>
    <div>
           <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning" show-icon :closable="false">
            </el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="selectedKeys"
                        :options="CateList"
                        :props="cateProps" clearable change-on-select>
                    </el-cascader>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    name:"Params",
    data(){
        return{
            CateList:{},
            cateProps:{
                value:"cat_id",
                label:"cat_name",
                children:'children'
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get("categories")
            if(res.meta.status !== 200){
                return this.$message.error("获取商品分类失败！")
            }
            this.CateList = res.data
        }
    }
}
</script>

<style scoped>
    .cat_opt{
        margin: 15px 0;
    }
</style>