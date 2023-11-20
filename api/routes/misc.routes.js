import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const misc_router = Router();
const prisma = new PrismaClient();

misc_router.get('/', async (req, res) => {
    res.json({
        "message": `Kokua api online on ${new Date()}`, 
        "version": "1.0.0",
        "warning": "Restricted access, only for Kokua authorized users"
    });
}
)



export default misc_router;