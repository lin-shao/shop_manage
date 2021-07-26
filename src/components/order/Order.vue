<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-input v-model="queryInfo.query" placeholder="请输入内容" style="width:35%">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
            </el-input>
             <el-table
                :data="orderList"
                border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="addressDialog"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressVisible"></el-button>
                    </template>
                </el-table-column>
               
            </el-table>
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%">
            <el-form :model="addressForm" :rules="addressRules" ref="raddressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                    v-model="addressForm.address1"
                    :options="cityData"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="物流查询"
            :visible.sync="progressVisible"
            width="50%">
            
        </el-dialog>
    </div>
</template>

<script>
import cityData from "./citydata"
import {formatDate} from "../../untils"
export default {
    name:"Order",
    data(){
        return {
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            orderList:[],
            total:0,
            addressVisible:false,
            progressVisible:false,
            addressForm:{
                address1:'',
                address2:''
            },
            addressRules:{
                address1:[{ required: true, message: '请选择地址', trigger: 'blur' }],
                address2:[{ required: true, message: '请输入地址名称', trigger: 'blur' }]
            },
            cityData
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
        this.getOrderList();
    },
    methods:{
         async getOrderList(){
             const {data:res} = await this.$http.get("orders",{params:this.queryInfo})
             if(res.meta.status !== 200){
                 return this.$message.error("获取订单列表失败！")
             }
            //  console.log(res.data);
             this.orderList = res.data.goods;
            //  console.log(this.orderList);
             this.total = res.data.total;
         },
         handleSizeChange(newsize){
             this.queryInfo.pagesize = newsize;
             this.getOrderList();
         },
         handleCurrentChange(newpage){
             this.queryInfo.pagenum = newpage;
             this.getOrderList();
         },
         addressDialog(){
             this.addressVisible = true;
         },
         async showProgressVisible(){
             this.progressVisible = true;
             const {data:res} = await this.$http.get('/kuaidi')
             if(res.meta.status !== 200){
                 return this.$message.error("获取物流信息失败！")
             }
             console.log(res.data);
         }
    }
}
</script>
<style scoped>
     .el-table{
         margin-top: 15px;
     }
</style>