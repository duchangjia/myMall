<template>
	<div>	
		<broud :currentPage="currentInfo"></broud>
			<p class="container text-right" style="margin-right:15px">
	    	<span>排序方式：</span>
	    	<a>默认</a>
	    	<a @click="sortBtn">价格<i class="glyphicon" :class="{'glyphicon-arrow-up':sortPriceFlag,'glyphicon-arrow-down':!sortPriceFlag}"></i></a> 	
	    </p>
	    <div class="container-fluid">
	      <div class="row">
	        <div class="col-sm-3 col-md-2 sidebar">
	          <ul class="nav nav-sidebar">
	            <li :class="{active:allPrice=='all'}" @click="priceChoose('all')"><a href="#">全部</a></li>
	            <li v-for="(item,index) in priceArea" :class="{active:allPrice==index}"  @click="priceChoose(index)"><a href="#">{{item.minPrice}}-{{item.maxPrice}}</a></li>
	          </ul>
	        </div>
	        <div class="col-sm-9 col-md-10 main">
	          <div class="row placeholders">
	            <div class="col-xs-6 col-sm-3 placeholder" v-for="item in goodsList">
	              <img :src="'./../../static/'+item.productImage"  width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">
	              <h4>{{item.productName}}</h4>
	              <span class="text-muted">{{item.salePrice}}</span><br>
	              <button type="button" class="btn btn-primary" @click="addCart(item.productId)">加入购物车</button>
	            </div>
	          </div>
						<div v-show="loadFlag" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="text-center">
							<img src="../assets/loading-spin.svg" alt="">
						</div>
	        </div>
	      </div>
	    </div>
	</div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css';
	import broud from "./../components/broud.vue";
	import axios from "axios";
  export default {
  	components:{
  		broud,
  	},
  	data(){
  		return {
				currentInfo:"商品",
				goodsList:[],
				allPrice:"all",
				priceArea:[
					{minPrice:0,maxPrice:100},
					{minPrice:100,maxPrice:500},
					{minPrice:500,maxPrice:1000},
					{minPrice:1000,maxPrice:2000},
				],
				currentPage:1,
				allPage:8,
				busy:true,
				sortPriceFlag:false,
				loadFlag:false,
  		}
		},
		methods:{
			priceChoose(msg){
				if(msg=="all"){
					this.allPrice="all";
				}else{
					this.allPrice=msg;
				}
				this.currentPage=1;
				this.fenPage();
			},
			fenPage(flag){
				axios.get('/goods/goodslist',{
					params:{
							currentPage:this.currentPage,
							allPage:this.allPage,
							sortPrice:this.sortPriceFlag?-1:1,
							tjPage:this.allPrice,
					}				
				})
				.then((result)=>{
					var res=result.data;
					if(flag){
						if(res.data.length<this.allPage){
							this.busy=true;
						}else{
							this.busy=false;
						}
						this.goodsList=this.goodsList.concat(res.data);
					}else{
						this.goodsList=res.data;
						this.busy=false;
					}				
				})
				this.loadFlag=false;
			},
			loadMore: function() {
				this.busy = true;
				this.loadFlag=true;
				setTimeout(() => {
					this.currentPage++
					this.fenPage(true);
				}, 500);
			},
			addCart(productId){
				axios.post("/goods/addCart",{
					"productId":productId,
				}).then((result)=>{
					let res=result.data;
					if(res.status==0){
						this.$store.commit("updateCartCount",1)
						alert("加入成功");
					}else{
						alert(res.message)
					}
				})
			},
			sortBtn(){
				this.sortPriceFlag=!this.sortPriceFlag;
				this.currentPage=1;
				this.fenPage();
			}
		},
		created(){
			this.loadFlag=true;
			this.fenPage();
		},
  }	
</script>

<style scoped>
.nav-sidebar > .active > a, .nav-sidebar > .active > a:hover, .nav-sidebar > .active > a:focus {
    color: #fff;
    background-color: #428bca;
}
.placeholder {
    margin-bottom: 20px;
}
.placeholders {
    margin-bottom: 30px;
    text-align: center;
}
.placeholder img {
    display: inline-block;
   
}
</style>