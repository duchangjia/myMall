// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './views/index'
import router from './router'
import Vuex from 'vuex'
// register globally
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.use(Vuex)

Vue.config.productionTip = false


const store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0,
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName=nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount;
    },
    disCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
