import express from 'express';
import cors from 'cors';
import ejemploRoutes from './routes/ejemplo.routes.js' ;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', ejemploRoutes);

app.listen(6969);
console.log('Server port on: ', 6969);