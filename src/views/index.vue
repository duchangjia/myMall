<template>
	<div>
		<nav class="">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">myMall-product</a>
				</div>
				<div class="navbar-collapse collapse">
					<ul class="nav navbar-nav navbar-right">
						<li v-show="loginText"><a href="#" @click="openLogin" v-show="loginText">登入</a></li>
						<li v-show="!loginText"><a href="#">{{loginName}}</a></li>
						<li v-show="!loginText" @click="loginOut"><a href="#">退出</a></li>
						<li><a @click="linkCart"><i class="glyphicon glyphicon-shopping-cart"></i><span class="badge" v-if="!loginText">{{cartCount}}</span></a></a></li>
					</ul>
				</div>
			</div>
		</nav>
		<router-view></router-view>
		<!-- 登入 -->
		<div class="pupulBlack" v-if="loginFlag"></div>
		<div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" style="display:block" v-if="loginFlag">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" @click="closeLogin"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="exampleModalLabel">登入</h4>
					</div>
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="recipient-name" class="control-label">用户名:</label>
								<input type="text" v-model="username" class="form-control" id="recipient-name">
							</div>
							<div class="form-group">
								<label for="message-text" class="control-label">密码:</label>
								<input type="text" class="form-control" v-model="password" id="recipient-password">
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" @click="closeLogin">Close</button>
						<button type="button" class="btn btn-primary" @click="Login" >&nbsp&nbsp登入&nbsp&nbsp</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
  import axios from "axios";  
  export default {
  	data(){
  		return {
				currentPage:"商品",
				loginFlag:false,
				username:"",
				password:"",
				//loginName:"",
				loginText:true,
  		}
	},
	computed:{
		loginName(){
			return this.$store.state.nickName;
		},
		cartCount(){
			return this.$store.state.cartCount;
		}
	},
	methods:{
		linkCart(){
			if(this.loginText==false){
				this.$router.push({path:'/cart'})
			}
		},
		closeLogin(){
			this.loginFlag=false;
		},
		openLogin(){
			this.loginFlag=true;
		},
		Login(){
			if(this.username==""||this.password==""){
				alert("不能为空");
				return;
			}
			axios.post("/users/login",{
				username:this.username,
				password:this.password,
			}).then((result)=>{
				let res=result.data;
				if(res.status==0){
					this.loginFlag=false;
					this.loginText=false;
					//this.loginName=res.data.userName;
					this.$store.commit("updateUserInfo",res.data.userName);
					let cartCount=0;
					res.data.cartList.map((item)=>{
						cartCount+=parseInt(item.productNum);
					});
					console.log(cartCount)
					this.$store.commit("updateCartCount",cartCount)
				}else{
					alert("用户名不存在");
				}
			})
		},
		keepLogin(){
			axios.get("/users/keepLogin")
			.then((result)=>{
				let res=result.data;
				if(res.status==0){
					this.loginText=false;
					this.$store.commit("updateUserInfo",res.result);
					let cartCount=0;
					res.cartList.map((item)=>{
						cartCount+=parseInt(item.productNum);
					});
					this.$store.commit("updateCartCount",cartCount)
					//this.loginName=res.result
				}
			})
		},
		loginOut(){
			axios.get("/users/loginOut")
			.then((result)=>{
					this.loginText=true;
					this.$store.commit("disCartCount",0);
					this.$router.push("/GoodsList")
			})
		}
	},
	mounted(){
		this.keepLogin();
	}
  }	
</script>

<style scoped>
.pupulBlack {
	position: fixed;
	left: 0px;
	top:0px;
	width:100%;
	height: 100%;
	opacity:0.4;
	background-color:black; 
}
</style>