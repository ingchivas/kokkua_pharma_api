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

router_meds.post('/registerMed', async (req, res) => {
    const { NombreMedicina, Descripci_n, Precio_Unitario, Criticidad, NivelDeInventario } = req.body;

    let precio = parseFloat(Precio_Unitario);
    let nivel = parseInt(NivelDeInventario);

    console.log(req.body);
    try {
        const newMed = await prisma.medicinas.create({
            data: {
                NombreMedicina,
                Descripci_n,
                Precio_Unitario: precio,
                Criticidad,
                NivelDeInventario: nivel
            }
        });
        res.json(newMed);
    }

    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
);

router_meds.put('/updateMed/:id', async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { NombreMedicina, Descripci_n, Precio_Unitario, Criticidad, NivelDeInventario } = req.body;

    let precio = parseFloat(Precio_Unitario);
    let nivel = parseInt(NivelDeInventario);

    try {
        const updateMed = await prisma.medicinas.update({
            where: {
                IDMedicina: parseInt(id)
            },
            data: {
                NombreMedicina,
                Descripci_n,
                Precio_Unitario: precio,
                Criticidad,
                NivelDeInventario: nivel
            }
        });
        res.json(updateMed);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router_meds.delete('/deleteMed/:id', async (req, res) => {
    const { id } = req.params;
    const deleteMed = await prisma.medicinas.delete({
        where: {
            IDMedicina: parseInt(id)
        }
    });
    res.json(deleteMed);
}
);

// Get all medicines and concatenate their names with descriptions
// Return ID and concatenated string

router_meds.get('/medsNames', async (req, res) => {
    const meds = await prisma.medicinas.findMany({
        select: {
            IDMedicina: true,
            NombreMedicina: true,
            Descripci_n: true
        }
    });

    meds.forEach(med => {
        med.NombreMedicina += ` - ${med.Descripci_n}`;
        delete med.Descripci_n;
    });

    res.json(meds);
});













export default router_meds;