import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router_meds = Router();
const prisma = new PrismaClient();

// model medicinas {
//     IDMedicina        Int                   @id @default(autoincrement())
//     NombreMedicina    String                @db.VarChar(255)
//     Descripci_n       String?               @map("Descripción") @db.Text
//     Precio_Unitario   Float?
//     Criticidad        medicinas_Criticidad?
//     NivelDeInventario Int?
//     loginventarios    loginventarios[]
//     lote              lote[]
//     ordenes           ordenes[]
//     receta            receta[]
//   }

router_meds.get('/totalMeds', async (req, res) => {
    const meds = await prisma.medicinas.count();
    res.json(meds);
}
)




export default router_meds;