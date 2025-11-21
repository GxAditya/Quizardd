import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import questionRoutes from './routes/questions';

// Load environment variables from backend/.env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

// Simple CORS config
app.use(cors());

app.use(express.json());

app.use('/api/questions', questionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
