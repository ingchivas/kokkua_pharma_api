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

// Top 3 providers by orders delivered on time (EntregaEsperada must be before today) and lowest lead time (EntregaEsperada - FechaOrden)
// The result must look like this:
// [
    // {
    //     provider: "Provider 1",
    //     ordersOnTime: 10% (percentage of orders delivered on time respect to total orders to that provider),
    //     leadTime: 10 (average lead time for that provider)
    // },

    router_orders.get('/topProviders', async (req, res) => {
        try {
            const providers = await prisma.proveedores.findMany({
                include: {
                    ordenes: true
                }
            });
    
            const providerStats = providers.map(provider => {
                const onTimeOrders = provider.ordenes.filter(order => 
                    order.EntregaEsperada <= new Date() && order.FechaOrden <= order.EntregaEsperada
                ).length;
                const totalOrders = provider.ordenes.length;
                const onTimePercentage = totalOrders > 0 ? (onTimeOrders / totalOrders * 100) : 0;
    
                const leadTimes = provider.ordenes.map(order => {
                    const deliveryDate = new Date(order.EntregaEsperada);
                    const orderDate = new Date(order.FechaOrden);
                    return (deliveryDate - orderDate) / (1000 * 3600 * 24);
                });
                const averageLeadTime = leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length : 0;
    
                return {
                    provider: provider.Nombre,
                    ordersOnTime: parseFloat(onTimePercentage.toFixed(2)),
                    leadTime: parseFloat(averageLeadTime.toFixed(2))
                };
            });
    
            const topProviders = providerStats.sort((a, b) => {
                return b.ordersOnTime - a.ordersOnTime || a.leadTime - b.leadTime;
            }).slice(0, 3);
    
            res.json(topProviders);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    // Get the 2 most ordered medicines and their total orders and names
    router_orders.get('/topMeds', async (req, res) => {
        try {
            const orders = await prisma.ordenes.findMany({
                select: {
                    IDMedicina: true
                }
            });
    
            const medicineCount = orders.reduce((acc, order) => {
                acc[order.IDMedicina] = (acc[order.IDMedicina] || 0) + 1;
                return acc;
            }, {});
    
            const topMedicineIDs = Object.entries(medicineCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(entry => parseInt(entry[0]));
    
            const topMedicines = await prisma.medicinas.findMany({
                where: {
                    IDMedicina: { in: topMedicineIDs }
                }
            });
    
            const result = topMedicines.map(medicine => ({
                id: medicine.IDMedicina,
                name: medicine.NombreMedicina,
                medDescription: medicine.Descripci_n,
                totalOrders: medicineCount[medicine.IDMedicina]
            }));

            result.sort((a, b) => b.totalOrders - a.totalOrders);

    
            res.json(result);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });




export default router_orders;