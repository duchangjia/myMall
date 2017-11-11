const express=require("express");
const router=express.Router();
const Good=require("../models/goods");
const common=require("../common/common");
var User=require('../models/users');

router.get("/goodslist",(req,res,next)=>{
    let currentPage=Number(req.query.currentPage);
    let allPage=Number(req.query.allPage);
    let skipNum=(currentPage-1)*allPage;
    let sortPrice=Number(req.query.sortPrice);
    let tjPage=req.query.tjPage;
    let param={}
    if(tjPage==0){
        param={
            "salePrice":{$gt:0,$lte:100}
        }
    }else if(tjPage==1){
        param={
            "salePrice":{$gt:100,$lte:500}
        }
    }else if(tjPage==2){
        param={
            "salePrice":{$gt:500,$lte:1000}
        }
    }else if(tjPage==3){
        param={
            "salePrice":{$gt:1000,$lte:2000}
        }
    }else{
        param={}
    }
    let doc=Good.find(param).skip(skipNum).limit(allPage).sort({"salePrice":sortPrice});
    doc.exec((err,result)=>{
        if(err){
            common.dberr(err,res);
            return;
        }
        common.dbsuccess(result,res,"");
    })
})

//加入购物车
router.post("/addCart",(req,res,next)=>{
    let productId=req.body.productId;
    let userId=req.cookies.userId;
    User.findOne({"userId":userId},(err,result)=>{
        if(err){
            common.dberr(err,res);
            return;
        }
        let goodslist="";
        result.cartList.forEach((item)=>{
            if(item.productId==productId){
                item.productNum++;
                goodslist=item;
            }
        });
        if(goodslist!=""){
            result.save((err,result)=>{
                if(err){
                    common.dberr(err,res);
                    return;
                }
                common.dbsuccess(goodslist,res,"加入成功")
            })
        }else{
            if(result.cartList.productId==productId){
                result.cartList.productId
            }
            Good.findOne({"productId":productId},(err,resultGoods)=>{
                if(err){
                    common.dberr(err,res);
                    return;
                }
                resultGoods.productNum=1;
                resultGoods.checked=1;
                result.cartList.push(resultGoods);
                // result.cartList[result.cartList.length-1].productNum=1;
                // result.cartList[result.cartList.length-1].checked=1;
                result.save((err,result)=>{
                    if(err){
                        common.dberr(err,res);
                        return;
                    }
                    common.dbsuccess(resultGoods,res,"加入成功");
                })                
            })
        }
        
    })
});

module.exports=router;

