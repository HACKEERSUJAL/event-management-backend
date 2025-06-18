import express from 'express';
import { categoryController, getAllCategories } from '../controllers/category.controller';

export const categoryRouter = express.Router();


categoryRouter.post('/',categoryController);
categoryRouter.get('/',getAllCategories);

