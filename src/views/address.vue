<template>
  <div class="container-fluid">
    <h1>购物地址</h1>
    <div style="overflow:hidden">
      <div class="col-sm-3" v-for="(item,index) in addressList" style="border:1px #e5e5e5 solid" :class="{'chooseBorder':showStyleNum==index,}" @click="changeAddress(index,item.addressId)">
        <h4>{{item.userName}}</h4>
        <p>{{item.streetName}}</p>
        <span>电话：{{item.tel}}</span><br>
        <a href="#" @click="setDefault(item.addressId)">{{item.isDefault?"默认地址":"设为默认"}}</a><br>
        <button type="button" class="btn btn-primary" @click="removeAddress(item.addressId)">删除</button><br>&nbsp
      </div>
    </div>
    <p class="bg-info text-center" style="line-height:45px;margin-top:15px;" @click="showAddress">{{showAddressFlag?"展开":"收起"}}</p>
    <button type="button" @click="linkOrder" class="btn btn-primary">下一步</button>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    data(){
      return{
        limit:3,
        address:[],
        showAddressFlag:true,
        addressId:'',
        showStyleNum:0,
      }
    },
    computed:{
      addressList(){
        return this.address.slice(0,this.limit);
      }, 
    },
    methods:{
      changeAddress(index,addressId){
        this.addressId=addressId;
        this.showStyle(index);
      },
      showStyle(nuin){
        if(nuin!=undefined){
          this.showStyleNum=nuin
        }else{
          this.address.forEach((item,index)=>{
            if(item.isDefault==true){
              this.showStyleNum=index;
              this.addressId=item.addressId;
            }
          })
        }       
      },
      linkOrder(){
        this.$router.push({path:'order',query:{addressId:this.addressId}})
      },
      removeAddress(addressId){
        this.address.forEach((item,index)=>{
          if(item.addressId==addressId){
            this.address.splice(index,1)
          }
        })
        axios.post("/users/removeAddress",{
          addressId:addressId,
        })
      },
      getAddress(){
        axios.get("/users/address")
        .then((result)=>{
          let res=result.data;
          this.address=res.data.addressList;
          this.showStyle();
          //console.log(this.address);
        })
        
      },
      setDefault(addressId){
        console.log(this);
        this.address.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        });
        axios.post("/users/setDefault",{
          addressId:addressId,
        })
        .then((result)=>{
          let res=result.data;
          if(res.status==0){
            console.log("成功")
          }
        })
      },
      showAddress(){
        if(this.limit==3){
          this.limit=this.address.length;
          this.showAddressFlag=false;
        }else{
          this.limit=3;
          this.showAddressFlag=true;
        }
      },
    },
    mounted(){
      this.getAddress();
      
    },
  }	
</script>

<style scoped>
.chooseBorder{
  border: 1px solid #337ab7 !important;
}
</style>