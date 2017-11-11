<template>
	<nav class="navbar navbar-default">
	  <div class="container-fluid">
	    <div class="navbar-header">
	        <ol class="breadcrumb" style="margin-bottom:0px;padding:0px 0px 0px 8px;line-height:50px;">
			  <li><a>主页</a></li>
			  <li class="active">{{currentPage}}</li>
			</ol>
	    </div>
	  </div>
	</nav>
</template>

<script>
  export default {
  	props:{
  		currentPage:{
  			type:String,
  			default:""
  		}
  	}
  }	
</script>

<style scoped>

</style>