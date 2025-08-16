require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const connectDB = require('../src/config/db');
const Order = require('../src/models/Order');

(async () => {
  await connectDB();
  const orders = await Order.find().lean();

  const file = path.join(__dirname, '..', 'orders_export.csv');
  const csvWriter = createObjectCsvWriter({
    path: file,
    header: [
      {id: '_id', title: 'ORDER_ID'},
      {id: 'totalPrice', title: 'TOTAL'},
      {id: 'paymentMethod', title: 'PAYMENT'},
      {id: 'isPaid', title: 'PAID'},
      {id: 'status', title: 'STATUS'},
      {id: 'createdAt', title: 'CREATED_AT'}
    ]
  });

  await csvWriter.writeRecords(orders);
  console.log('Orders exported to', file);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
