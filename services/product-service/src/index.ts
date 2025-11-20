import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initDatabase } from './config/database';
import productRoutes from './routes/product.routes';

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/products', productRoutes);

const port = process.env.PORT || 4001;
app.listen(Number(port), () => console.log(`Product service running on port ${port}`));

export default app;
