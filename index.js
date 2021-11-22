const express=require('express')
const app=express()
require('dotenv').config()

const port=process.env.PORT || 5000
const { MongoClient } = require('mongodb');
const objectId=require('mongodb').ObjectId
const cors=require('cors')
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he9di.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('uri....',uri)
async function run(){
try{
await client.connect()
console.log('database connected')
const database=client.db('wood_Craft')
const userCollection=database.collection('user')
const productCollection=database.collection('products')
const orderCollection=database.collection('orders')
const reviewCollection=database.collection('reviews')

//POST api to add  user in database
app.post('/users',async(req,res)=>{
    const user=req.body
    const result=await userCollection.insertOne(user)
    res.json(result)
})
//PUT Api make Admin
app.put('/users/admin',async(req,res)=>{
    const user=req.body

    const filter={email : user.email}
    const updateDoc={
        $set:{
            role: 'admin'
        }
    }
    const result=await userCollection.updateOne(filter,updateDoc)
    res.json(result)
    console.log(result)
})
// GET API(verify admin)
app.get('/users/:email',async(req,res)=>{
    const email=req.params.email
    console.log(req.params.email)
    const filter={email : email}
    const result=await userCollection.findOne(filter)
    let isAdmin=false
    if(result?.role === 'admin'){
        isAdmin=true
    }
    res.json({admin: isAdmin})
})
//POST API (add Items in database )
app.post('/addItems',async(req,res)=>{
const products=req.body
const result=await productCollection.insertOne(products)
res.json(result)
})
//GET API (show products from database)
app.get('/showItems',async(req,res)=>{
    const items=req.body
    const result=await productCollection.find(items).toArray()
    res.json(result)

})
//DELETE API (delete product from database)
app.delete('/productDelete/:id',async(req,res)=>{
    const deleteItemsId=req.params.id
    const query={_id : objectId(deleteItemsId)}
    const result=await productCollection.deleteOne(query)
    res.json(result)
    
})

app.get('/orderDetail/:id',async(req,res)=>{
    console.log(req.params.id)
    const result=await productCollection.findOne({_id : objectId(req.params.id)})
        res.json(result)
        // console.log('orderdetail ....',result)


})
//POST API (send order to database)
app.post('/ordersend',async(req,res)=>{
    const sendOrder=req.body
    console.log(req.body)
    const result=await orderCollection.insertOne(sendOrder)
    console.log('order send.....',result)
    res.json(result)
})
//GET API (show all order in Admin page)
app.get('/allorders',async(req,res)=>{
    const allorder=req.body
    const result=await orderCollection.find(allorder).toArray()
    res.json(result)
    console.log(result)
})
//GET API (show customer orders which they have ordered)
app.get('/myOrders/:email',async(req,res)=>{
    const myOrders=req.params.email
    const filter={email : myOrders}
    const result=await orderCollection.find(filter).toArray()
    res.json(result)
})
//DELETE API (delete from myorder page)
app.delete('/deleteMyOrder/:id',async(req,res)=>{
    const id=req.params.id
    const query = {_id : objectId(id)}
    const result=await orderCollection.deleteOne(query)
    res.json(result)
})
//DELETE API (delete from Admin  page)
app.delete('/deleteManageOrder/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id : objectId(id)}
    const result=await orderCollection.deleteOne(query)
    res.json(result)
})
//POST API (Add review in database)
app.post('/addReview',async(req,res)=>{
    const sendReview=req.body
    console.log(req.body)
    const result=await reviewCollection.insertOne(sendReview)
    console.log(' Review.....',result)
    res.json(result)
})
//GET API (show review in homepage)
app.get('/getAllreviews',async(req,res)=>{
    const allreview=req.body
    const result=await reviewCollection.find(allreview).toArray()
    res.json(result)
    console.log(result)
})
}
finally{
    // await client.close()
}
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('wood art Website')
   
})
app.listen(port,()=>{
    console.log('listing to port with',port)
})