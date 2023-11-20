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

// Get percentage of orders ontime by month and previous month EntregeEsperada must be before today

router_orders.get('/getOnTime', async (req, res) => {
    const onTimePercentage = await prisma.ordenes.count({
        where: {
            EntregaEsperada: {
                lte: new Date()
            }
        }
    });

    const onTimePercentagePrevMonth = await prisma.ordenes.count({
        where: {
            EntregaEsperada: {
                lte: new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
        }
    });

    const total = await prisma.ordenes.count();
    let percentage = (onTimePercentage / total * 100).toString()

    let onTimePercentagePrevMonthPercentage = (onTimePercentagePrevMonth / total * 100).toString()
    onTimePercentagePrevMonthPercentage = onTimePercentagePrevMonthPercentage.slice(0, (onTimePercentagePrevMonthPercentage.indexOf(".")) + 3);

    return res.json({
        "onTimePercentage": parseFloat(percentage),
        "onTimePercentagePrevMonth": parseFloat(onTimePercentagePrevMonthPercentage),
        "total": total,
        "delta": parseFloat((parseFloat(percentage) - parseFloat(onTimePercentagePrevMonthPercentage)).toString().slice(0, ((parseFloat(percentage) - parseFloat(onTimePercentagePrevMonthPercentage)).toString().indexOf(".")) + 3))
    });
}
)

// Get average lead time by month and previous month (EntregaEsperada - FechaOrden)

router_orders.get('/getLeadTime', async (req, res) => {
    // Fetch all orders with their expected delivery and order dates
    const orders = await prisma.ordenes.findMany({
        select: {
            EntregaEsperada: true,
            FechaOrden: true
        },
        where: {
            EntregaEsperada: {
                lte: new Date()
            }
        }


    });

    // Calculate the lead time for each order and take the average
    const leadTimes = orders.map(order => {
        const deliveryDate = new Date(order.EntregaEsperada);
        const orderDate = new Date(order.FechaOrden);
        const timeDiff = deliveryDate.getTime() - orderDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert time difference to days
        return daysDiff;
    });
    const avgLeadTime = leadTimes.reduce((acc, curr) => acc + curr, 0) / leadTimes.length;


    const prevMonthOrders = await prisma.ordenes.findMany({
        select: {
            EntregaEsperada: true,
            FechaOrden: true
        },
        where: {
            FechaOrden: {
                lte: new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
        }
    });

    // Calculate the lead time for each order and take the average
    const prevMonthLeadTimes = prevMonthOrders.map(order => {
        const deliveryDate = new Date(order.EntregaEsperada);
        const orderDate = new Date(order.FechaOrden);
        const timeDiff = deliveryDate.getTime() - orderDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert time difference to days
        return daysDiff;
    });

    const avgLeadTimePrevMonth = prevMonthLeadTimes.reduce((acc, curr) => acc + curr, 0) / prevMonthLeadTimes.length;

    let leadTimePrevMonthPercentage = (avgLeadTimePrevMonth / avgLeadTime * 100).toFixed(2);

    return res.json({
        "leadTime": parseFloat(avgLeadTime.toFixed(2)),
        "leadTimePrevMonth": parseFloat(leadTimePrevMonthPercentage),
        "delta": parseFloat((parseFloat(avgLeadTime.toFixed(2)) - parseFloat(leadTimePrevMonthPercentage)).toString().slice(0, ((parseFloat(avgLeadTime.toFixed(2)) - parseFloat(leadTimePrevMonthPercentage)).toString().indexOf(".")) + 3))
    });
});

router_orders.get('/graph', async (req, res) => {
    res.json(
        {
            "message": new Date().getUTCDate()
        }
    )
});










export default router_orders;