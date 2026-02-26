import * as dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Test user data - password is the same as username for easy testing
const users = [
  { username: 'admin', email: 'admin@admin.com', password: 'admin123', role: 'ADMIN' },
  { username: 'alice', email: 'alice@gmail.com', password: 'alice123', role: 'USER' },
  { username: 'bob', email: 'bob@yahoo.com', password: 'bob123', role: 'USER' },
  { username: 'charlie', email: 'charlie@outlook.com', password: 'charlie123', role: 'USER' },
  { username: 'diana', email: 'diana@gmail.com', password: 'diana123', role: 'USER' },
];
const categories = ['Electronics', 'Accessories', 'Office', 'Home', 'Fashion', 'Sports'];
const productNames = [
  'Wireless Headphones', 'USB-C Cable', 'Laptop Stand', 'Mechanical Keyboard', 'Mouse Pad',
  '4K Webcam', 'USB Hub', 'Desk Lamp', 'Phone Case', 'Portable SSD',
  'Monitor Arm', 'Cable Organizer', 'Bluetooth Speaker', 'Screen Protector', 'Desk Organizer',
  'Desk Chair', 'Monitor Stand', 'Keyboard Wrist Rest', 'Cable Clip', 'Desk Pad',
];
const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;
const couriers = ['UPS', 'PACKETA', 'DPD', 'INPOST'] as const;

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create Users with properly hashed passwords
  const createdUsers: any[] = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const name = userData.username.charAt(0).toUpperCase() + userData.username.slice(1);
    const user = await prisma.users.upsert({
      where: { username: userData.username },
      create: {
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
        name,
        role: userData.role,
      },
      update: {
        email: userData.email,
        password_hash: hashedPassword,
        name,
        role: userData.role,
      },
    });
    createdUsers.push(user);
    console.log(`✓ User: ${user.username} (${user.email}) - Password: ${userData.password}`);
  }


  // Create Products with better data
  const createdProducts: any[] = [];
  const productDescriptions = [
    'Premium wireless headphones with active noise cancellation and 30-hour battery life',
    'High-speed USB-C cable for charging and data transfer',
    'Ergonomic laptop stand for improved posture and cooling',
    'Mechanical keyboard with RGB lighting and custom switches',
    'Large mouse pad with non-slip base',
    '4K Ultra HD webcam with auto-focus',
    'Multi-port USB Hub with power delivery',
    'LED desk lamp with adjustable brightness',
    'Protective phone case with drop protection',
    'Fast SSD with 1TB storage capacity',
    'Adjustable monitor arm mount',
    'Cable organizer clips for desk organization',
    'Portable Bluetooth speaker with waterproof design',
    'Tempered glass screen protector',
    'Wooden desk organizer with multiple compartments',
    'Gaming desk chair with lumbar support',
    'Adjustable monitor stand riser',
    'Wrist rest for keyboard ergonomics',
    'Cable clips and clips for wire management',
    'Large desk pad for mouse and keyboard',
  ];

  for (let i = 0; i < productNames.length; i++) {
    const existing = await prisma.products.findFirst({
      where: { name: productNames[i] },
    });

    if (existing) {
      const updated = await prisma.products.update({
        where: { id: existing.id },
        data: {
          description: productDescriptions[i],
          category: randomElement(categories),
          price: random(15, 500),
          stock: random(10, 200),
          image: null,
        },
      });
      createdProducts.push(updated);
    } else {
      const created = await prisma.products.create({
        data: {
          name: productNames[i],
          description: productDescriptions[i],
          category: randomElement(categories),
          price: random(15, 500),
          stock: random(10, 200),
          image: null,
        },
      });
      createdProducts.push(created);
    }
  }
  console.log(`✓ Created ${createdProducts.length} products\n`);

  // Create Orders with realistic data
  const addressExamples = [
    '123 Main Street, New York, NY 10001',
    '456 Oak Avenue, Los Angeles, CA 90001',
    '789 Pine Road, Chicago, IL 60601',
    '321 Elm Street, Houston, TX 77001',
    '654 Maple Drive, Phoenix, AZ 85001',
    '987 Birch Lane, Philadelphia, PA 19101',
    '147 Cedar Court, San Antonio, TX 78201',
    '258 Walnut Way, San Diego, CA 92101',
  ];

  for (let i = 0; i < 12; i++) {
    const user = createdUsers[random(0, createdUsers.length - 1)];
    const itemCount = random(1, 4);
    const orderItems: any[] = [];
    let total = 0;

    for (let j = 0; j < itemCount; j++) {
      const prod = randomElement(createdProducts);
      const qty = random(1, 3);
      total += prod.price * qty;
      orderItems.push({ productId: prod.id, quantity: qty, price: prod.price });
    }

    await prisma.orders.create({
      data: {
        userId: user.id,
        totalPrice: total,
        status: randomElement(statuses),
        courier: randomElement(couriers),
        shippingAddress: randomElement(addressExamples),
        trackingNumber: `TRK${Date.now()}${i}`,
        orderItems: { create: orderItems },
      },
    });
  }
  console.log('✓ Created 12 orders\n');

  // Create Reviews with realistic data
  const reviewTitles = [
    'Excellent quality!',
    'Great product for the price',
    'Highly recommended',
    'Good value',
    'Exceeded expectations',
    'Best purchase ever',
    'Worth every penny',
    'Amazing performance',
    'Solid build quality',
    'Perfect for my needs',
  ];

  const reviewComments = [
    'This product arrived quickly and works perfectly. The quality is excellent and I will definitely buy again.',
    'Very satisfied with this purchase. Great customer service and fast shipping.',
    'Better than expected. Highly recommend to anyone looking for quality products.',
    'Good value for money. Works as described and arrived in perfect condition.',
    'Amazing! Exceeded all my expectations. Will be ordering more.',
    'Love this! High quality and exactly what I needed.',
    'Great product! Fast shipping and excellent packaging.',
    'Perfect! Does exactly what it says it will do.',
    'Fantastic quality. Definitely recommend this to friends and family.',
    'Very impressed with the quality and performance of this product.',
  ];

  for (let i = 0; i < 15; i++) {
    try {
      await prisma.reviews.create({
        data: {
          userId: createdUsers[random(0, createdUsers.length - 1)].id,
          productId: randomElement(createdProducts).id,
          rating: random(4, 5),
          title: randomElement(reviewTitles),
          comment: randomElement(reviewComments),
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log('✓ Created 15 reviews\n');

  // Create Wishlist items
  for (let i = 0; i < 12; i++) {
    try {
      await prisma.wishlist.create({
        data: {
          userId: createdUsers[random(0, createdUsers.length - 1)].id,
          productId: randomElement(createdProducts).id,
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log('✓ Created 12 wishlist items\n');

  // Create Recently Viewed items
  for (let i = 0; i < 20; i++) {
    try {
      await prisma.recentlyViewed.create({
        data: {
          userId: createdUsers[random(0, createdUsers.length - 1)].id,
          productId: randomElement(createdProducts).id,
        },
      });
    } catch (e) {
      // Skip duplicates
    }
  }
  console.log('✓ Created 20 recently viewed items\n');

  console.log('✅ Database seeded successfully!\n');
  console.log('📝 Test Credentials:');
  console.log('─────────────────────────────────────');
  for (const userData of users) {
    console.log(`Username: ${userData.username} | Password: ${userData.password}`);
  }
  console.log('─────────────────────────────────────\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
