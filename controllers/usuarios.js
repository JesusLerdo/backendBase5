const {request, reponse} = require("express")
const bcryptjs = require("bcryptjs")
const pool = require("../db/connection")
//http://localhost:4000/api/v1/usuarios
const getUsers = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection()//realizamos la conexion

        //Generamos las consultas
        const users = await pool.query("SELECT * FROM Usuarios", (error) => { if (error) throw error })

        if (!users.length === 0){// En caso de no haber registros lo informamos
            res.status(404).json({msg: "No existen usuarios registrados"})
            return
        }

        res.json({users})//se manda la lista de usuarios
    } 
    catch (error){
    console.log(error)
    res.status(500).json({msg: error})//Informamos el error

    }
    finally {
        if (conn) conn.end()//Termina la conexion

    }
}
    
  //console.log("Funcion getUsers")
  //res.json(msg: "Funcion getUsers"})
//}

const getUserByID = async (req = request, res = response) => {
    const {id} = req.params
    let conn;

    try {
        conn = await pool.getConnection()//realizamos la conexion

        //Generamos las consultas
        const [user] = await conn.query(`SELECT * FROM Usuarios WHERE ID = ${id}`, (error) => { if (error) throw error })


        if (!user){// En caso de no haber registros lo informamos
            res.status(404).json({msg: `No existen usuarios registrado con el ID ${id}`})
            return
        }

        res.json({user})//se manda la lista de usuarios
    } 
    catch (error){
        console.log(error)
        res.status(500).json({msg: error})//Informamos el error

    }finally {
        if (conn) conn.end()//Termina la conexion

    }
}

    const deleteUsersByID = async (req = request, res = response) => {
        const {id} = req.params
        let conn;
    
        try {
            conn = await pool.getConnection()//realizamos la conexion
    
            //Generamos la consulta
            const result = await conn.query(`UPDATE Usuarios SET Activo = 'N' WHERE ID = ${id}`, (error) => { if (error) throw error })
    
    
            if (result.affectedRows ===0){// En caso de no haber registros lo informamos
                res.status(404).json({msg: `No existen usuarios registrado con el ID ${id}`})
                return
            }
    
            res.json({msg: `Se elimino sactisfactoriamnete el ususario`})//se manda la lista de usuarios
        } 
        catch (error){
            console.log(error)
            res.status(500).json({msg: error})//Informamos el error
        } finally {
            if (conn) conn.end()//Termina la conexion
    
        }
    }
    const adduser = async (req = request, res = response) => {
        const {Nombre, 
            Apellidos, 
            Edad, 
            Genero, 
            Usuario, 
            Contrasena, 
            Fecha_Nacimiento, 
            Activo} = req.body 

        if (!Nombre||
            !Apellidos|| 
            !Edad|| 
            !Usuario|| 
            !Contrasena|| 
            !Activo) 
        {
            res.status(400).json({msg: "Faltan datos"})
            return

        }

        const salt = bryptjs.genSaltSync()
        const contrasenaCifrada = bryptjs.hashSync(Contrasena, salt)

        let conn;

        //Validar que no existe el usuario
        try {

            conn = await pool.getConnection()//realizamos la conexion

            const [userExist] = await con.query(`SELECT Usuario FROM Usuario WHERE Usuario = '${usuario}'`)

            if (!userExist){
                res.status(400).json({msg: `El usuario ${Usuario} ya se encuentra rregistrado.`})
                return
            }
    
            //Generamos la consulta
            const result = await conn.query(`
            INSERT INTO Usuarios(
            Nombre,
            Apellidos, 
            Edad, 
            Genero = 'M', 
            Usuario, 
            Contrasena, 
            Fecha_Nacimiento, 
            Activo) 
          VALUES(
            '${Nombre}',
            '${Apellidos}', 
            '${Edad}', 
            '${Genero}', 
            '${Usuario}', 
            '${contrasenaCifrada} 
            '${Fecha_Nacimiento}', 
            '${Activo}'
            )
            `, (error) => { if (error) throw error })

    
            if (result.affectedRows ===0){// En caso de no haber registros lo informamos
                res.status(400).json({msg: `No se pudo agregar un usuario`})
                return
            }
    
            res.json({msg: "Se agrego sactisfactoriamente el usuario"})//se manda la lista de usuarios
       } 
       catch (error){
           console.log(error)
           res.status(500).json({msg: error})//Informamos el error
        }

       finally {
         if (conn) conn.end()//Termina la conexion
    
        }
    }

    const updateUserByUsuario = async (req =request, res = response) =>{
        const {
            Nombre,
            Apellidos,
            Edad,
            Genero,
            Usuario,
            Contrasena,
            Fecha_Nacimiento = '1900-01-01'
        } = req.body //URI Params

        if (
            !Nombre||
            !Apellidos||
            !Edad||
            !Usuario
        ){

            res.status(400).json({msg: "Faltan datos"})
            return
        }

        let conn;

        //Validar que no existe el usuario
        
        try{
            conn = await pool.getConnection()//Realizamos la conexion

            //Generamos la consulta
            const result = await conn.query(`UPDATE Usuario SET 
                Nombre ='${Nombre}',
                Apellidos ='${Apellidos}',
                Edad =${Edad},
                ${Genero ? `Genero = '${Genero}',`:''}
                Fecha_Nacimiento ='${Fecha_Nacimiento}'
            WHERE
                Usuario = '${Usuario}'
                `,(error)=> { if (error) throw error})
                
                

        if (result.affectedRows ===0){ //En caso de no haber registro lo informamos
            res.status(400).json({msg: `No se pudo actualizar el usuario` })
            return    
        }
        res.json({msg: `Se actualizo satisfactoriamente el usuario`})//Se manda la ista de usuarios
        }
        catch(error){
            console.log(error)
            res.status(500).json({msg:error}) //Informamos el error
        }
        finally{
            if(conn) conn.end() //Termina la conexion 
        }
    }

    
module.exports = {getUsers, getUserByID, deleteUsersByID, adduser, updateUserByUsuario}