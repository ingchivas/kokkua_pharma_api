import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router_batch = Router();
const prisma = new PrismaClient();

// model lote {
//     IDLote           Int          @id @default(autoincrement())
//     IDMedicina       Int?
//     FechaManufactura DateTime     @db.Date
//     FechaExpiraci_n  DateTime     @map("FechaExpiración") @db.Date
//     IDProveedor      Int?
//     CantidadRecibida Float        @db.Float
//     CantidadRestante Float        @db.Float
//     UbicacionAlmacen String?      @db.VarChar(100)
//     proveedores      proveedores? @relation(fields: [IDProveedor], references: [IDProveedor], onDelete: NoAction, onUpdate: NoAction, map: "lote_ibfk_1")
//     medicinas        medicinas?   @relation(fields: [IDMedicina], references: [IDMedicina], onDelete: NoAction, onUpdate: NoAction, map: "lote_ibfk_2")
  
//     @@index([IDMedicina], map: "IDMedicina")
//     @@index([IDProveedor], map: "IDProveedor")
//   }
  


// Obtain percentage of expired meds in all batches
router_batch.get('/getExpiredPercentage', async (req, res) => {
    const expiredPercentage = await prisma.lote.count({
        where: {
            FechaExpiraci_n: {
                lte: new Date()
            }
        }
    });
    
    const expiredPercentagePrevMonth = await prisma.lote.count({
        where: {
            FechaExpiraci_n: {
                lte: new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
        }
    });

    const total = await prisma.lote.count();
    let percentage = (expiredPercentage / total * 100).toString()

    let expiredPercentagePrevMonthPercentage = (expiredPercentagePrevMonth / total * 100).toString()
    expiredPercentagePrevMonthPercentage = expiredPercentagePrevMonthPercentage.slice(0, (expiredPercentagePrevMonthPercentage.indexOf("."))+3);


    percentage = percentage.slice(0, (percentage.indexOf("."))+3);
    res.json({
        "expiredPercentage": parseFloat(percentage),
        "expiredPercentagePrevMonth": parseFloat(expiredPercentagePrevMonthPercentage),
        "total": total,
        "delta" : parseFloat((parseFloat(percentage) - parseFloat(expiredPercentagePrevMonthPercentage)).toString().slice(0, ((parseFloat(percentage) - parseFloat(expiredPercentagePrevMonthPercentage)).toString().indexOf("."))+3))
    });
    }
)



export default router_batch;
