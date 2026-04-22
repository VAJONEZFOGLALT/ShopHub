import { PrismaClient } from '../generated/prisma/client';
import type { Users, Products } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Seed Users
  const users: Users[] = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.users.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password_hash: faker.internet.password(),
        role: i === 0 ? 'ADMIN' : 'USER',
      },
    });
    users.push(user);
  }

  // Seed Products
  const products: Products[] = [];
  for (let i = 0; i < 10; i++) {
    const product = await prisma.products.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
        stock: faker.number.int({ min: 0, max: 100 }),
      },
    });
    products.push(product);
  }

  // Seed Orders and OrderItems
  for (let i = 0; i < 8; i++) {
    const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const order = await prisma.orders.create({
      data: {
        userId: user.id,
        totalPrice: 0, // will update after items
        status: faker.datatype.boolean(),
        orderItems: {
          create: [],
        },
      },
    });

    // Add 1-4 items to each order
    let total = 0;
    const numItems = faker.number.int({ min: 1, max: 4 });
    for (let j = 0; j < numItems; j++) {
      const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
      const quantity = faker.number.int({ min: 1, max: 5 });
      const price = product.price * quantity;
      await prisma.orderItems.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          price: product.price,
        },
      });
      total += price;
    }
    // Update order total price
    await prisma.orders.update({
      where: { id: order.id },
      data: { totalPrice: total },
    });
  }

  console.log('Seeding finished!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });