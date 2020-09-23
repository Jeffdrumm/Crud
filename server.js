const express = require('express')
const app = express()
const bodyparser = require('body-parser')
 
const ObjectId = require('mongodb').ObjectID
 
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb://admin:<senha>@cluster0-shard-00-00.2viwx.gcp.mongodb.net:27017,cluster0-shard-00-01.2viwx.gcp.mongodb.net:27017,cluster0-shard-00-02.2viwx.gcp.mongodb.net:27017/cadastroprofessor?ssl=true&replicaSet=atlas-zx9jzc-shard-0&authSource=admin&retryWrites=true&w=majority";
 
MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('cadastroprofessor') // coloque o nome do seu DB
 
  app.listen(3001, () => {
    console.log('Server running on port 3001')
  })
})
 
app.use(bodyparser.urlencoded({ extended: true}))
app.set('views', './view')
app.set('view engine', 'ejs')
 
app.get('/', function(req, res){
    res.render('index.ejs');
});
 
app.post('/show', (req, res)=>{
    //criar a coleção “data”, que irá armazenar nossos dados
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
      })
});
app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})
 
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('shows.ejs', { data: results })
 
    })
})
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var nome = req.body.nome
  var cpf = req.body.cpf
  var sexo = req.body.sexo
  var telefone = req.body.telefone
  var idade = req.body.idade
  var endereco = req.body.endereco
  var email = req.body.email
  var codigo = req.body.codigo
  var especialidade = req.body.especialidade
 
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      nome: nome,
      cpf: cpf,
      sexo: sexo,
      telefone: telefone,
      idade: idade,
      endereco: endereco,
      email: email,
      codigo: codigo,
      especialidade: especialidade
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})
