<template>
    <div>
        <h1 class="container-fluid">订单确定</h1>
        <div class="container-fluid">
            <div class="row bg-primary"style="padding:8px 0px;">
                <div class="col-sm-3">
                    商品
                </div>
                <div class="col-sm-2">
                    价格
                </div>
                <div class="col-sm-2">
                    数量
                </div>
                <div class="col-sm-2">
                    总价
                </div>
            </div>
            <div class="row" style="padding:8px 0px;" v-for="item in cart">
                <div class="col-sm-3">
                    <div>
                        <img width="100" height="100" :src="`./../../static/${item.productImage}`">
                        {{item.productName}}
                    </div>                    
                </div>
                <div class="col-sm-2" style="line-height:100px;">
                    {{item.salePrice | current("2","￥")}}
                </div>
                <div class="col-sm-2" style="line-height:100px;">
                    {{item.productNum}}
                </div>
                <div class="col-sm-2" style="line-height:100px;">
                    {{item.salePrice*item.productNum | current("2","￥")}}
                </div>
            </div>
        </div>
        <div class="container-fluid text-right">
            <h2><small>运费：</small>{{freight  | current("2","￥")}}</h2>
            <h2><small>打折：</small>{{discount}}</h2>
            <h2><small>折后总计：</small>{{count*discount+freight | current("2","￥")}}</h2>
            <button type="button" class="btn btn-primary btn-lg" @click="buyGoods">&nbsp&nbsp&nbsp&nbsp购买&nbsp&nbsp&nbsp&nbsp</button>
        </div>
       
    </div>
</template>

<script>
import axios from "axios";
import current from "./../utill/current";
  export default {
      data(){
          return{
              cart:[],
              freight:100,
              discount:0.8,
          }
      },
      computed:{
          count(){
              let dcount=0;
              this.cart.forEach((item)=>{
                  dcount+=item.salePrice*item.productNum
              })
              return dcount;
          },
      },
      methods:{
          buyGoods(){
              let addressId=this.$route.query.addressId;
              axios.post("/users/buyGoods",{
                  "addressId":addressId,
                  "count":this.count*this.discount+this.freight,
                  "discount":this.discount,
              })
              .then((result)=>{
                  let res=result.data;
                  if(res.status==0){
                      this.$router.push({path:"/orderSuccess",query:{orderId:res.data}})
                  }
              })
          },
          cartGet(){
            axios.get("/users/cart",{})
            .then((result)=>{
                let res=result.data;
                if(res.status==0){
                    res.data.forEach((item)=>{
                        if(item.checked==1){
                            this.cart.push(item)
                        }
                    })
                }
            })
          }, 
      },
      filters:{
          current:current
      },
      mounted(){
          this.cartGet();
      }
  }	
</script>

<style scoped>

</style>