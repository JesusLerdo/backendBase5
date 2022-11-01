const express = require('express')
const messagesRouter = require('./routes/messages')
const usuariosRouter = require('./routes/usuarios')
const cors = require('cors')

class server {
    constructor () {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            messages:"/api/v1/messages",
            usuarios:"/api/v1/usuarios"
        }
        this.middlewares()
        this.routes()
    }

    routes(){  
     // this.app.get('/', (req, res) => {
       //     res.send('Hola mundoo')`
        //})// End Ṕoint
        this.app.use(this.paths.messages, messagesRouter),
        this.app.use(this.paths.usuarios, usuariosRouter)
    }

    middlewares(){
        this.app.use(cors())//habilita origen cruzado
        this.app.use(express.json())
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto 4000', this.port)
        })
    }
}

module.exports = server