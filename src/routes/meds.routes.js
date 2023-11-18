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

// enum medicinas_Criticidad {
//     Alto
//     Medio
//     Bajo
//   }

router_meds.get('/totalMeds', async (req, res) => {
    const meds = await prisma.medicinas.count();
    res.json(meds);
}
)

const criticidadMap = {
    'Alto': 3,
    'Medio': 2,
    'Bajo': 1
};

// Get the medicines with the most critical level and lowest inventory level
router_meds.get('/critical', async (req, res) => {
    // Fetch all medicines
    const meds = await prisma.medicinas.findMany();

    // Sort medicines
    meds.sort((a, b) => {
        // Compare Criticidad
        const criticidadA = criticidadMap[a.Criticidad];
        const criticidadB = criticidadMap[b.Criticidad];
        if (criticidadA > criticidadB) {
            return -1;
        }
        if (criticidadA < criticidadB) {
            return 1;
        }

        // If Criticidad is equal, compare NivelDeInventario
        return a.NivelDeInventario - b.NivelDeInventario;
    });

    // Return the first 3 medicines
    res.json(meds.slice(0, 3));
});







export default router_meds;