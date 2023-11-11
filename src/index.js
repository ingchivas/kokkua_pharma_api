import express from 'express';

import ejemploRoutes from './routes/ejemplo.routes.js' ;

const app = express();

app.use(express.json());

app.use('/api', ejemploRoutes);

app.listen(6969);
console.log('Server port on: ', 6969);