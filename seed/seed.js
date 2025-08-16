require('dotenv').config();
const connectDB = require('../src/config/db');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

const run = async () => {
  await connectDB();
  await Product.deleteMany({});
  await User.deleteMany({});

  await User.create({
    name: 'Admin',
    email: 'admin@ajaybangle.com',
    password: 'admin123',
    isAdmin: true
  });

  await Product.insertMany([
    {
      name: 'Gold Finish Bangle Set',
      slug: 'gold-finish-bangle-set',
      sku: 'BX-001',
      description: 'Classic gold-finish bangles for festive and wedding wear.',
      category: 'Bangles',
      tags: ['gold', 'wedding'],
      price: 799,
      stock: 24,
      images: [
        '/uploads/bangles/b1.jpg'
      ],
      variants: [{ name: 'size', value: '2.4' }, { name: 'material', value: 'Alloy' }],
      weight: 120,
      popularity: 50
    },
    {
      name: 'Meenakari Bangle Box',
      slug: 'meenakari-bangle-box',
      sku: 'BX-002',
      description: 'Handcrafted meenakari design with velvet lining.',
      category: 'Bangle Boxes',
      tags: ['meenakari', 'gift'],
      price: 1099,
      stock: 18,
      images: [
        '/uploads/bangles/b2.jpg'
      ],
      variants: [{ name: 'size', value: '2.6' }, { name: 'material', value: 'Wood' }],
      weight: 300,
      popularity: 36
    },
    {
      name: 'Stone-Studded Bangles',
      slug: 'stone-studded-bangles',
      sku: 'BX-003',
      description: 'Elegant stone-studded set for parties.',
      category: 'Bangles',
      tags: ['stone', 'party'],
      price: 899,
      stock: 12,
      images: [
        '/uploads/bangles/b3.jpg'
      ],
      variants: [{ name: 'size', value: '2.8' }, { name: 'material', value: 'Alloy' }],
      weight: 140,
      popularity: 42
    }
  ]);

  console.log('Seed complete ✓');
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
