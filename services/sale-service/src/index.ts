import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import saleRoutes from './routes/sale.routes';

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/sales', saleRoutes);

const port = process.env.PORT || 4003;
app.listen(Number(port), () => console.log(`Sale service running on port ${port}`));

export default app;
