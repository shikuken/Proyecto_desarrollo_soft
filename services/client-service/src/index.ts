import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import clientRoutes from './routes/client.routes';

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/clients', clientRoutes);

const port = process.env.PORT || 4002;
app.listen(Number(port), () => console.log(`Client service running on port ${port}`));

export default app;
