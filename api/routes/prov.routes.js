import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const prov_router = Router();
const prisma = new PrismaClient();

// model proveedores {
//     IDProveedor Int       @id @default(autoincrement())
//     Nombre      String    @db.VarChar(255)
//     Ubicaci_n   String?   @map("Ubicación") @db.VarChar(255)
//     NumContacto String?   @db.VarChar(255)
//     lote        lote[]
//     ordenes     ordenes[]
//   }


prov_router.get('/testProveedores', async (req, res) => {
    const proveedores = await prisma.proveedores.findMany();
    res.json(proveedores);
})

prov_router.get('/getProveedores', async (req, res) => {
    const proveedores = await prisma.proveedores.findMany({
    });
    res.json(proveedores);
}
)

prov_router.get('/getProveedores/names', async (req, res) => {
    const proveedoresNames = await prisma.proveedores.findMany({
        select: {
            Nombre: true
        }
    });
    res.json(proveedoresNames);
})

prov_router.post('/registerProveedor', async (req, res) => {
    const { Nombre, Ubicaci_n, NumContacto } = req.body;
    console.log(req.body);
    const newProveedor = await prisma.proveedores.create({
        data: {
            Nombre,
            Ubicaci_n,
            NumContacto
        }
    });
    res.json(newProveedor);
})

// Delete proveedor by ID
prov_router.delete('/deleteProveedor/:id', async (req, res) => {
    const { id } = req.params;
    const deleteProveedor = await prisma.proveedores.delete({
        where: {
            IDProveedor: parseInt(id)
        }
    });
    res.json(deleteProveedor);
})

// Update proveedor by ID
prov_router.put('/updateProveedor/:id', async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { Nombre, Ubicaci_n, NumContacto } = req.body;
    const updateProveedor = await prisma.proveedores.update({
        where: {
            IDProveedor: parseInt(id)
        },
        data: {
            Nombre,
            Ubicaci_n,
            NumContacto
        }
    });
    res.json(updateProveedor);
})





export default prov_router;