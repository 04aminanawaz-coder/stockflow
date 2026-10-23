import express from 'express';
import Product, { CATEGORIES, LOW_STOCK_THRESHOLD } from '../models/Product.js';

const router = express.Router();

const SORT_FIELDS = ['name', 'price', 'quantity', 'createdAt'];

const buildSort = (sort) => {
  if (!sort || !SORT_FIELDS.includes(String(sort).replace('-', ''))) {
    return { createdAt: -1 };
  }
  const value = String(sort);
  return value.startsWith('-') ? { [value.slice(1)]: -1 } : { [value]: 1 };
};

router.get('/', async (req, res, next) => {
  try {
    const { search, category, stock, sort } = req.query;
    const query = {};

    if (search) query.name = { $regex: search.trim(), $options: 'i' };
    if (category && CATEGORIES.includes(category)) query.category = category;
    if (stock === 'in') query.quantity = { $gt: 0 };
    if (stock === 'out') query.quantity = { $lte: 0 };

    const products = await Product.find(query).sort(buildSort(sort));
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const [summary] = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalUnits: { $sum: '$quantity' },
          inventoryValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          lowStockCount: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ['$quantity', 0] }, { $lt: ['$quantity', LOW_STOCK_THRESHOLD] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalUnits: 1,
          inventoryValue: { $round: ['$inventoryValue', 2] },
          lowStockCount: 1,
        },
      },
    ]);

    const byCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]);

    res.json({
      totalProducts: 0,
      totalUnits: 0,
      inventoryValue: 0,
      lowStockCount: 0,
      byCategory: [],
      ...summary,
      byCategory,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: product._id });
  } catch (err) {
    next(err);
  }
});

export default router;
