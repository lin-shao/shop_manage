import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User'
import Rights from '@/components/power/Rights'
import Roles from '@/components/Roles/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import List from '@/components/goods/List'
import Add from '@/components/goods/Add'
import Order from '@/components/order/Order'
import Report from '@/components/report/Report'

Vue.use(Router)
const router =  new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path:'/home',
      component: Home,
      redirect:'/welcome',
      children: [{path:'/welcome',component: Welcome},{path:'/users',component: User},
    {path:"/rights",component:Rights},{path:"/roles",component:Roles},{path:"/categories",component:Cate},
    {path:"/params",component:Params},{path:"/goods",component:List},{path:"/goods/add",component:Add},
    {path:"/orders",component:Order},{path:"/reports",component:Report}]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem("token")
  if(!tokenStr) return next("/login")
  next()
})

export default router