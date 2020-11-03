const express = require('express')
const app = express()
const port = 8000

app.use(express.json())

app.get("/", express.static("frontend"))

app.get("/api/users/all", (req,res) => {
})

app.get("/api/users/:id", (req,res) => {
})

app.post("/api/users/add", (req,res)=>{
})

app.put("/api/users/edit/:id", (req,res)=>{
})

app.delete("/api/users/delete/:id", (req,res) => {
})



app.get("/api/products/all", (req,res) => {
})

app.get("/api/products/:id", (req,res) => {
})

app.post("/api/products/add", (req,res) => {
})

app.put("/api/products/edit/:id", (req,res) => {
})

app.delete("/api/products/delete/:id", (req,res) => {
})

app.use(require('body-parser').urlencoded({extended: true}));

app.get("/api/orders/all", (req,res)=>{
})

app.get("/api/orders/:id", (req,res)=>{
    res.status(200)
    res.send("/api/orders/:id works")
})

app.get("/api/orders/:client", (req,res)=>{
    res.status(200)
    res.send("/api/orders/:client works")
})

app.get("/api/orders/:product", (req,res)=>{
    res.status(200)
    res.send("/api/orders/:product works")
})

app.post("/api/orders/add",(req,res)=>{
    res.status(200)
    res.send("/api/orders/add works")
})

app.put("/api/orders/edit/:id",(req,res)=>{
    res.status(200)
    res.send("api/orders/edit works")
})

app.delete("/api/orders/delete/:id",(req,res)=>{
    res.status(200)
    res.send("/api/orders/delete works")
})

app.listen(port, () => {
    console.log(`Now listening on ${port}`)
})