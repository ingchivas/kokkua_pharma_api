import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router_orders = Router();
const prisma = new PrismaClient();

// model ordenes {
//     IDOrden          Int              @id @default(autoincrement())
//     IDUsuario        Int?
//     FechaOrden       DateTime?        @db.Date
//     IDProveedor      Int?
//     IDMedicina       Int?
//     CantidadOrdenada DateTime?        @db.Date
//     EntregaEsperada  DateTime?        @db.Date
//     Costo            Float?
//     Estatus          ordenes_Estatus?
//     proveedores      proveedores?     @relation(fields: [IDProveedor], references: [IDProveedor], onDelete: NoAction, onUpdate: NoAction, map: "ordenes_ibfk_1")
//     medicinas        medicinas?       @relation(fields: [IDMedicina], references: [IDMedicina], onDelete: NoAction, onUpdate: NoAction, map: "ordenes_ibfk_2")
//     usuarios         usuarios?        @relation(fields: [IDUsuario], references: [IDUsuario], onDelete: NoAction, onUpdate: NoAction, map: "ordenes_ibfk_3")
  
//     @@index([IDMedicina], map: "IDMedicina")
//     @@index([IDProveedor], map: "IDProveedor")
//     @@index([IDUsuario], map: "IDUsuario")
//   }

// Latest orders
router_orders.get('/latest', async (req, res) => {
    const orders = await prisma.ordenes.findMany({
        take: 3,
        orderBy: {
            FechaOrden: 'desc'
        }
    });
    res.json(orders);
});

// Soon to be delivered orders
router_orders.get('/soon', async (req, res) => {
    const orders = await prisma.ordenes.findMany({
        take: 3,
        orderBy: {
            EntregaEsperada: 'asc'
        }
    });
    res.json(orders);
});

// All orders
router_orders.get('/getAll', async (req, res) => {
    const orders = await prisma.ordenes.findMany();
    res.json(orders);
});



export default router_orders;