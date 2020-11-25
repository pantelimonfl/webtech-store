const express = require('express')
const { Sequelize } = require('sequelize')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const app = express()
const port = 8000

const secret = "Mz6G9ARpHDvGejeKgsF4RBsDEvPuezDi"
const saltRounds = 2

app.use(require('body-parser').urlencoded({ extended: true }));

const db_name = 'webtech_store'
const db_user_name = 'admin'
const db_password = 'admin'

const database = new Sequelize(db_name, db_user_name, db_password, {
    host: '127.0.0.1',
    dialect: 'mysql'
});

let User = database.define('User', {
    UserId: {
        allowNull: false,
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },
    Email: {
        allowNull: false,
        type: sequelize.STRING
    },
    Name: {
        allowNull: false,
        type: sequelize.STRING
    },
    Password: {
        allowNull: false,
        type: sequelize.STRING
    },
    Age:{
        allowNull: true,
        type: sequelize.INTEGER
    }
},
    {
        freezeTableName: true
    })

let Product = database.define('Product', {
    ProductId: {
        allowNull: false,
        primaryKey: true,
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4
    },
    Name: {
        allowNull: false,
        type: sequelize.STRING
    },
    Color: {
        allowNull: true,
        type: sequelize.STRING
    },
    Price: {
        allowNull: false,
        type: sequelize.FLOAT
    }
},
    {
        freezeTableName: true
    })

let Order = database.define('Order', {
    OrderId: {
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize.UUIDV4,
        type: sequelize.UUID
    },
    UserId: {
        allowNull: false,
        type: sequelize.UUID,
        references: {
            model: User,
            key: 'UserId'
        }
    },
    Address: {
        allowNull: false,
        type: sequelize.STRING
    }
},
    {
        freezeTableName: true
    })
/*
let OrderXProduct = database.define('OrderXProduct', {
    OrderXProductId: {
        allowNull: false,
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },
    OrderId: {
        allowNull: false,
        type: sequelize.UUID,
        references: {
            model: Order,
            key: 'OrderId'
        }
    },
    ProductId: {
        allowNull: false,
        type: sequelize.UUID,
        references: {
            model: Product,
            key: 'ProductId'
        }
    }
},
    {
        freezeTableName: true
    })
*/

User.hasMany(Order);
Order.belongsTo(User);

Product.belongsToMany(Order, { through: 'OrderXProduct' })
Order.belongsToMany(Product, { through: 'OrderXProduct' })

app.use(express.json())

app.get("/", express.static("frontend"))

app.get("/sync", (req, res) => {
    database.query('SET FOREIGN_KEY_CHECKS = 0').then(() => {
        database.sync({
            force: true
        }).then(() => {
            database.query('SET FOREIGN_KEY_CHECKS = 1')
            res.status(201).send("Sincronizare reusita cu baza de date!")
        }).catch((error) => {
            console.log(error)
            res.status(500).send(`Sincronizare nereusita. ${0}`, error)
        })
    })
})

app.get("/api/users/all", (req, res) => {
    User.findAll({
        attributes: ['UserId', 'Name', 'Email']
    }).then((userAccounts) => {
        res.status(200).send(userAccounts);
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Eroare la extragerea utilizatorilor!")
    })
})

app.get("/api/users/get/:id", (req, res) => {
    User.findByPk(req.params.id, {
        attributes: ['UserId', 'Name', 'Email']
    }).then((userAccount) => {
        res.status(200).send(userAccount)
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Eroare la extragerea utilizatorului!")
    })
})

app.post("/api/users/add", (req, res) => {
    User.create(req.body).then(() => {
        res.status(201).send("Utilizatorul a fost creat")
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Eroare la crearea utilizatorului")
    })
})

app.put("/api/users/edit/:id", (req, res) => {
    User.findByPk(req.params.id).then((userAccount) => {
        userAccount.update(req.body)
    }).then(() => {
        res.status(200).send("utilizator modificat cu succes")
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Eroare la modificarea utilizatorului")
    })
})

app.delete("/api/users/delete/:id", (req, res) => {
    User.findByPk(req.params.id).then((user) => {
        user.destroy()
    }).then(() => {
        res.status(201).send("Utilizator sters cu succes!")
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Eroare la stergerea utilizatorului")
    })
})

app.post("/api/users/register", (req, res) => {
    bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
        let user = req.body
        user.Password = hash
        User.create(user).then(()=>{
            res.status(201).send("utilizatorul a fost creat")
        })
    });
})

app.get("/api/users/login", (req, res) => {
    User.findOne({
        where: {
            Email : req.query.Email
        },
        attributes: ['UserId', 'Name', 'Email','Password']
    }).then((userAccount) => {
        bcrypt.compare(req.query.Password, userAccount.Password , function(err, result) {
            if(result)
            {
                res.status(200).send(userAccount)
            }
        });
    }).catch((error) => {
        console.log(error)
        res.status(500).send("Eroare la extragerea utilizatorului!")
    })
})

app.get("/api/products/all", (req, res) => {
    Product.findAll({
        attributes: ['ProductId','Name','Color','Price','createdAt']
    }).then((products)=>{
        res.status(200).send(products)
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la extragerea produselor.")
    })
})

app.get("/api/products/:id", (req, res) => {
    Product.findByPk(req.params.id, {
        attributes: ['ProductId','Name','Color','Price']
    }).then((product)=>{
        res.status(200).send(product)
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la extragerea produsului.")
    })
})

app.post("/api/products/add", (req, res) => {
    Product.create(req.body).then(()=>{
        res.status(201).send("Produsul a fost creat.")
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la crearea produsului.")
    })
})

app.put("/api/products/edit/:id", (req, res) => {
    Product.findByPk(req.params.id).then((product)=>{
        product.update(req.body)
    }).then(()=>{
        res.status(200).send("Produsul a fost modificat cu succes.")
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la modificarea produsului.")
    })
})

app.delete("/api/products/delete/:id", (req, res) => {
    Product.findByPk(req.params.id).then((product)=>{
        product.destroy()
    }).then(()=>{
        res.status(200).send("Produs sters cu succes!") 
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la stergerea produsului.")
    })
})

app.get("/api/orders/all", (req, res) => {
    Order.findAll({
        attributes: ['OrderId','UserId','Address'],
        include : [{
            model: Product,
            attributes : ['ProductId','Name','Color','Price']
        }]
    }).then((orders)=>{
        res.status(200).send(orders)
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la extragerea comenzilor")
    })
})

app.get("/api/orders/:id", (req, res) => {
    Order.findByPk(req.params.id).then((order)=>{
        res.status(200).send(order);
    }).catch((error)=>{
        console.log(error)
        res.status(500).send("Eroare la extragerea comenzii.")
    })
})

app.get("/api/orders/:client", (req, res) => {
    res.status(200)
    res.send("/api/orders/:client works")
})

app.get("/api/orders/:product", (req, res) => {
    res.status(200)
    res.send("/api/orders/:product works")
})

app.post("/api/orders/add", (req, res) => {
    res.status(200)
    res.send("/api/orders/add works")
})

app.put("/api/orders/edit/:id", (req, res) => {
    res.status(200)
    res.send("api/orders/edit works")
})

app.delete("/api/orders/delete/:id", (req, res) => {
    res.status(200)
    res.send("/api/orders/delete works")
})

app.listen(port, () => {
    console.log(`Now listening on ${port}`)
})