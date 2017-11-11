const mongoose=require("./db");

let goodsSchema=new mongoose.Schema({
    "productId" : String,
    "productName" : String,
    "salePrice" : Number,
    "productNum":Number,
    "checked":String,
    "productImage" : String,
});
module.exports=mongoose.model("Good",goodsSchema);