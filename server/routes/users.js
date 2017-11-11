var express = require('express');
var router = express.Router();
var User=require('../models/users');
const common=require("../common/common");
require("../utill/utill")

/* GET users listing. */
router.post('/login', function(req, res, next) {
  let username=req.body.username;
  let password=req.body.password;
  let params={
    "userName":username,
    "userPwd":password,
  }
  User.findOne(params,(err,result)=>{
    if(err){
      common.dberr(err,res)
      return
    }
    res.cookie('userId',result.userId,{maxAge:1000*60*60})
    res.cookie('userName',result.userName,{maxAge:1000*60*60})  
    common.dbsuccess(result,res,"")
  })
});

router.get('/keepLogin',(req,res,next)=>{
  if(req.cookies.userId){  
    let params={
      "userId":req.cookies.userId,
    }
    User.findOne(params,(err,result)=>{
      if(err){
        common.dberr(err,res)
        return
      }
      res.json({
        "status":0,
        "msg":"已经登入",
        "result":req.cookies.userName,
        "cartList":result.cartList
     });
    })  
  }else{
    res.json({
      "status":-1,
      "msg":"未登入"
    })
  }
})

router.get('/cart',(req,res,next)=>{
  let userId=req.cookies.userId;
  User.findOne({"userId":userId},(err,result)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    common.dbsuccess(result.cartList,res,"数据请求成功")   
  })
})
router.get('/editCart',(req,res,next)=>{
  let productId=req.query.productId;
  let userId=req.cookies.userId;
  let productNum=req.query.productNum;
  let checked=req.query.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },(err,doc)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    common.dbsuccess(doc,res,"成功");
  })
})
//移除购物车产品
router.get('/removeCart',(req,res,next)=>{
  let productId=req.query.productId;
  let userId=req.cookies.userId;
  User.update({"userId":userId},{$pull:{
    "cartList":{
      "productId":productId
    }
  }},(err,doc)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    common.dbsuccess(doc,res,"成功");
  })
})
//全选
router.get("/changeChecked",(req,res,next)=>{
  let userId=req.cookies.userId;
  let num=req.query.num;
  User.findOne({"userId":userId},(err,result)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    result.cartList.forEach((item)=>{
      item.checked=num;
    })
    result.save((err,doc)=>{
      if(err){
        common.dberr(err,res);
        return;
      }
      common.dbsuccess(doc,res,"成功");
    })
  })
})
//获取地址
router.get("/address",(req,res,next)=>{
  let userId=req.cookies.userId;
  User.findOne({"userId":userId},(err,result)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    common.dbsuccess(result,res,"成功");
  })
});
//设置默认地址
router.post("/setDefault",(req,res,next)=>{
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  User.findOne({"userId":userId},(err,result)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    //common.dbsuccess(result,res,"成功");
    result.addressList.forEach((item)=>{
      if(item.addressId==addressId){
        item.isDefault=true;
      }else{
        item.isDefault=false;
      }
    })
    result.save((err,doc)=>{
      if(err){
        common.dberr(err,res);
        return;
      }
      common.dbsuccess(doc,res,"成功");
    })
  })
})
//删除地址
router.post("/removeAddress",(req,res,next)=>{
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  User.update({"userId":userId},{
    $pull:{
      "addressId":addressId
    }
  },(err,doc)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    common.dbsuccess(doc,res,"成功");
  })
  // User.findOne({"userId":userId},(err,result)=>{
  //   if(err){
  //     common.dberr(err,res);
  //     return;
  //   }
   
  //   result.addressList.forEach((item,index)=>{
  //     if(item.addressId==addressId){
  //       result.addressList.splice(index,1)
  //     }
  //   })
  //   result.save((err,doc)=>{
  //     if(err){
  //       common.dberr(err,res);
  //       return;
  //     }
  //     common.dbsuccess(doc,res,"成功");
  //   })
  // })
})
//购买商品
router.post("/buyGoods",(req,res,next)=>{
  let userId=req.cookies.userId;
  let count=req.body.count;
  let addressId=req.body.addressId;
  let discount=req.body.discount;
  User.findOne({"userId":userId},(err,result)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    let address='';
    let goodsList=[];
    result.addressList.forEach((item)=>{
      if(item.addressId==addressId){
        address=item;
      }
    })
    result.cartList.filter((item)=>{
      if(item.checked==1){
        goodsList.push(item);
      }
    });
    var platform = '622';
    var r1 = Math.floor(Math.random()*10);
    var r2 = Math.floor(Math.random()*10);

    var sysDate = new Date().Format('yyyyMMddhhmmss');
    var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
    var orderId = platform+r1+sysDate+r2;

    let order={
      orderId:orderId,
      addressInfo:address,
      goodsList:goodsList,
      orderStatus:1,
      count:count,
      createDate:createDate,
    }
    result.orderList.push(order);
    result.save((err,doc)=>{
      if(err){
        common.dberr(err,res);
        return;
      }
      common.dbsuccess(orderId,res,"成功");
    })
  })
})
//购买成功
router.get("/orderSuccess",(req,res,next)=>{
  let orderId=req.query.orderId;
  console.log(orderId)
  let userId=req.cookies.userId;
  User.findOne({"userId":userId},(err,result)=>{
    if(err){
      common.dberr(err,res);
      return;
    }
    result.orderList.forEach((item)=>{
      if(item.orderId==orderId){
        common.dbsuccess(item.count,res,"成功");
      }
    })
  })
})
//退出
router.get('/loginOut',(req,res,next)=>{
  res.cookie('userId',"",{maxAge:-1})
  res.cookie('userName',"",{maxAge:-1}) 
  res.json({
    "status":0,
  })
})
module.exports = router;
