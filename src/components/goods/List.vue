<template>
    <div>
          <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
                <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
            </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="add">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table
                :data="goodList"
                border
                style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column prop="upd_time" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.upd_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import {formatDate} from "../../untils"
export default {
    name:"List",
    data(){
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodList:[],
            total:0
        }
    },
     filters:{
        formatDate(time) {
        time = time * 1000
        let date = new Date(time)
        // console.log(new Date(time))
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created(){
        this.getGoodList();
    },
    methods:{
        async getGoodList(){
            const {data:res} = await this.$http.get("goods",{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error("获取商品数据失败！")
            }
            // this.$message.success("获取商品数据成功！")
            this.goodList = res.data.goods;
            this.total = res.data.total;
            console.log(res.data);
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize;
            this.getGoodList();
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage;
            this.getGoodList();
        },
        async removeById(id){
         const confirmresult = await this.$confirm('此操作将永久删除该商品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmresult !== "confirm"){
            return this.$message.info("已取消删除！")}
        const {data:res} =await this.$http.delete(`goods/${id}`) 
        if(res.meta.status !== 200){
            return this.$message.error("删除商品数据失败！")
        }
        this.$message.success("删除商品数据成功！")
        this.getGoodList()
        },
        add(){
            this.$router.push("goods/add")
        }
    }
}
</script>

<style scoped>
    .el-table{
        margin-top: 15px;
    }
</style>