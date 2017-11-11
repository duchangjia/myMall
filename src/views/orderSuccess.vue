<template>
<div class="container-fluid">
    <div class="jumbotron text-center">
        <h3>购买成功</h3>
        <p>订单号：{{orderId}},订单总金额：{{count}}</p>
        <p><a class="btn btn-primary btn-lg" href="/cart" role="button">回到购物车</a>&nbsp&nbsp<a class="btn btn-primary btn-lg" href="/GoodsList" role="button">回到首页</a></p>
    </div>
</div>
</template>

<script>
  import axios from "axios";
  export default {
      data(){
          return{
             orderId:"", 
             count:"",
          }
      },
      methods:{
          getSuccess(){
              this.orderId=this.$route.query.orderId;
              axios.get("/users/orderSuccess",{
                  params:{
                      "orderId":this.orderId,
                  }
              })
              .then((result)=>{
                  let res=result.data;
                  if(res.status==0){
                      this.count=res.data
                  }
              });
          },
      },
      mounted(){
        this.getSuccess();
      }
  }	
</script>

<style scoped>

</style>