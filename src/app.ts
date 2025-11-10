import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import clientRoutes from './routes/client.routes';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';
initDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/clients', clientRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
const port = process.env.PORT || 4000;
app.listen(Number(port), () => console.log(`Server running on port ${port}`));

export default app;
