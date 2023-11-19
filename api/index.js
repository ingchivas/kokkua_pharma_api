import express from 'express';
import cors from 'cors';
import prov_router from './routes/prov.routes.js' ;
import router_meds from './routes/meds.routes.js';
import router_orders from './routes/orders.routes.js';


const app = express();



app.use(cors());
app.use(express.json());

app.use('/api', prov_router);
app.use('/api/meds', router_meds);
app.use('/api/orders', router_orders);

app.listen(6969);
console.log('Server port on: ', 6969);