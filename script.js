const express = require('express');
const Path = require('path');
const userModel = require('./models/user.js');


const app = express();

app.set('view engine', 'ejs');
app.use(express.static(Path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('index')
});

app.get('/users', async (req,res)=>{
    let users = await userModel.find();
    res.render('users', {users: users})
})

app.post('/create', async (req, res)=>{
    let newUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image
    })
    // Redirect to the /users page. The browser will then make a new GET request
    // to /users, which will now fetch all users (including the new one) and render them.
    res.redirect('/users');
})

app.get('/delete/:id',async (req,res)=>{
    let deleteUser = await userModel.findOneAndDelete({_id: req.params.id})
    res.redirect('/users')
})

app.get('/edit/:id',async (req,res)=>{
    let userFind= await userModel.findOne({_id: req.params.id})
    res.render('edit',{userFind})
})

app.post('/update/:id', async (req,res)=>{
    let {name,email,image} = req.body;
    let updateUser = await userModel.findOneAndUpdate({_id:req.params.id},{name,email,image},{new: true})
    res.redirect('/users')
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});