import mongoose from 'mongoose';

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Groceries',
  'Stationery',
  'Home & Kitchen',
  'Other',
];

export const LOW_STOCK_THRESHOLD = 10;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [80, 'Product name cannot exceed 80 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  }
);

productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

productSchema.virtual('stockValue').get(function () {
  return Number((this.price * this.quantity).toFixed(2));
});

productSchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) return 'out';
  if (this.quantity < LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
});

const Product = mongoose.model('Product', productSchema);

export default Product;
