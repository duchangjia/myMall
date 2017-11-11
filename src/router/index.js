import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import cart from '@/views/cart'
import address from '@/views/address'
import order from '@/views/order'
import orderSuccess from '@/views/orderSuccess'
Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      redirect: '/GoodsList' 
    },
    {
      path: '/GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      component: cart
    },
    {
      path: '/address',
      component: address,
    },
    {
      path: '/order',
      component: order,
    },
    {
      path: '/orderSuccess',
      component: orderSuccess,
    },
  ]
})
