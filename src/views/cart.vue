<template>
    <div>
        <h1 class="container-fluid">我的购物车</h1>
        <div class="container-fluid">
            <div class="row bg-primary"style="padding:8px 0px;">
                <div class="col-sm-1">
                    <label>
                        <input type="checkbox" :checked="allCheckedFlag" value="" @click="allChecked">
                        全选
                    </label>
                </div>
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
                <div class="col-sm-2">
                    删除  
                </div>      
            </div>
            <div class="row" style="padding:8px 0px;" v-for="item in cart">
                <div class="col-sm-1" style="line-height:100px;">
                    <label>
                        <input type="checkbox" value="" :checked="item.checked=='0'?false:true" @click="editCart('',item)">
                    </label>
                </div>
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
                    <span class="input-number-decrement" @click="editCart('reduce',item)">–</span><input style="margin-top: 30px;" class="input-number" type="text" v-model="item.productNum" min="0"><span class="input-number-increment" @click="editCart('add',item)">+</span>
                </div>
                <div class="col-sm-2" style="line-height:100px;">
                    {{item.salePrice*item.productNum | current("2","￥")}}
                </div>
                <div class="col-sm-2" style="line-height:100px;">
                    <i class="glyphicon glyphicon-trash" @click="removeCart(item)"></i>   
                </div>      
            </div>
        </div>
        <div class="bg-info text-right container-fluid" style="padding:15px 0px;">
            总计：{{totle | current("2","￥")}}
            <button type="button" class="btn btn-danger btn-lg" :disabled="totle>0?false:true" @click="payMoney">&nbsp&nbsp&nbsp&nbsp&nbsp支付&nbsp&nbsp&nbsp&nbsp&nbsp</button>
        </div>
    </div>
</template>

<script>
  import axios from "axios";
  import current from "./../utill/current";
  export default {
      data(){
          return {
              cart:[],
              acount:"",
          }
      },
      filters:{
         current:current, 
      },
      methods:{
          payMoney(){
             if(this.totle>0){
                 this.$router.push({path:'address'})
             }
          },
          allChecked(){
              let num="";
              let flag=!this.allCheckedFlag;
              if(flag){
                  this.cart.forEach((item)=>{
                      item.checked=1;
                  })
                  num=1;
              }else{
                   this.cart.forEach((item)=>{
                      item.checked=0;
                  })
                  num=0;
              }
              axios.get("/users/changeChecked",{
                  params:{
                      "num":num
                  }
              })
              .then((result)=>{
                  if(result.data.status==0){
                      console.log("成功")
                  }
              })
          },
          
          cartGet(){
            axios.get("/users/cart",{})
            .then((result)=>{
                let res=result.data;
                if(res.status==0){
                    this.cart=res.data;
                }
            })
          }, 
          removeCart(item){
               axios.get("/users/removeCart",{
                   params:{
                       "productId":item.productId,
                   }
               })
               .then((result)=>{
                    let res=result.data;
                    if(res.status==0){
                       let productNu=0;
                       this.cart.forEach((itemCart,index)=>{
                           if(itemCart.productId==item.productId){
                                productNu=parseInt(item.productNum);
                                this.cart.splice(index,1)
                           }
                       })
                       this.$store.commit("updateCartCount",-productNu);  
                    }
               })
          },
          editCart(flag,item){
              if(flag=="add"){
                  item.productNum++; 
                  this.$store.commit("updateCartCount",1)     
              }else if(flag=="reduce"){
                  if(item.productNum<=1){
                      return;
                  }
                  item.productNum--; 
                  this.$store.commit("updateCartCount",-1)  
              }else{
                  item.checked=item.checked==1?0:1
              }
              axios.get("/users/editCart",{
                  params:{
                      "productId":item.productId,
                      "productNum":item.productNum,
                      "checked":item.checked,
                  }
              })
              .then((result)=>{
                let res=result.data;
                if(res.status==0){
                  
                }
              })
          },         
      },
      computed:{
          totle(){
              let money=0;
              this.cart.forEach((item)=>{
                  if(item.checked==1){
                      money+=item.productNum*item.salePrice
                  }                  
              })
              return money;
          },
          allCheckedFlag(){
              return this.checkedCount==this.cart.length;
          },
          checkedCount(){
              let i=0;
              this.cart.forEach((item)=>{
                  if(item.checked==1){i++};
              })
              return i;
          },
      },
      mounted(){
          this.cartGet(); 
      }

  }	
</script>

<style scoped>
.input-number {
  width: 80px;
  padding: 0 12px;
  vertical-align: top;
  text-align: center;
  outline: none;
}

.input-number,
.input-number-decrement,
.input-number-increment {
  border: 1px solid #cccccc;
  height: 40px;
  user-select: none;
}

.input-number-decrement,
.input-number-increment {
  display: inline-block;
  width: 30px;
  line-height: 38px;
  background: #f1f1f1;
  color: #444444;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
.input-number-decrement:active,
.input-number-increment:active {
  background: #dddddd;
}

.input-number-decrement {
  border-right: none;
  border-radius: 0px 0 0 0px;
}

.input-number-increment {
  border-left: none;
  border-radius: 0 0px 0px 0;
}
</style>