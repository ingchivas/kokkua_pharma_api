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
        res.json(user.TipoAcceso);
    } else {
        res.json(null);
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


