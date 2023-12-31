import express from 'express';
import cors from 'cors';
import prov_router from './routes/prov.routes.js' ;
import router_meds from './routes/meds.routes.js';
import router_orders from './routes/orders.routes.js';
import router_batch from './routes/batch.routes.js';
import misc_router from './routes/misc.routes.js';
import usr_router from './routes/users.routes.js';


const app = express();



app.use(cors());
app.use(express.json());

app.use('/api/prov', prov_router);
app.use('/api/meds', router_meds);
app.use('/api/orders', router_orders);
app.use('/api/batch', router_batch);
app.use('/api/users', usr_router);
app.use('/', misc_router);

app.listen(6969);
console.log('Server port on: ', 6969);