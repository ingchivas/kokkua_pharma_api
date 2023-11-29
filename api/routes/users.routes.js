import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const usr_router = Router();
const prisma = new PrismaClient();

usr_router.get('/testUsers', async (req, res) => {
    const users = await prisma.usuarios.findMany();

    // Do not expose the password hash
    users.forEach(user => delete user.Password);

    res.json(users);
})

// Given a username, return the user's type of access 
usr_router.get('/getTipoAcceso/:username', async (req, res) => {
    const username = req.params.username;
    const user = await prisma.usuarios.findFirst({
        where: {
            Username: username
        }
    });
    if (user) {
        res.json({
            tipoAcceso: user.TipoAcceso
        });
    } else {
        res.json({
            error: "Usuario no encontrado"
        });
    }
})

// Given a username and a password, return if the user password is correct recieve in a JSON
usr_router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await prisma.usuarios.findFirst({
        where: {
            Username: username,
            Password: password
        }
    });
    if (user) {
        res.json(
            {
                result : true,
                TipoAcceso: user.TipoAcceso
            }
        );
    } else {
        res.json(
            {
                error : "Usuario o contraseña incorrectos",
            }
        );
    }
})




// model usuarios {
//   IDUsuario      Int                  @id @default(autoincrement())
//   Username         String               @db.VarChar(100)
//   Password       String?              @db.VarChar(100)
//   TipoAcceso     usuarios_TipoAcceso?
//   loginventarios loginventarios[]
//   ordenes        ordenes[]
// }




export default usr_router;


