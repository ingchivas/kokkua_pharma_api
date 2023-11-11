import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const router = Router();
const prisma = new PrismaClient();

router.get('/example', async(req, res) => {
    const products = await prisma.proveedores.findMany();
    res.json(products);
})

export default router;