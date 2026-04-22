"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const faker_1 = require("@faker-js/faker");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding...');
    const users = [];
    for (let i = 0; i < 5; i++) {
        const user = await prisma.users.create({
            data: {
                username: faker_1.faker.internet.username(),
                email: faker_1.faker.internet.email(),
                password_hash: faker_1.faker.internet.password(),
                role: i === 0 ? 'ADMIN' : 'USER',
            },
        });
        users.push(user);
    }
    const products = [];
    for (let i = 0; i < 10; i++) {
        const product = await prisma.products.create({
            data: {
                name: faker_1.faker.commerce.productName(),
                description: faker_1.faker.commerce.productDescription(),
                category: faker_1.faker.commerce.department(),
                price: parseFloat(faker_1.faker.commerce.price({ min: 5, max: 500 })),
                stock: faker_1.faker.number.int({ min: 0, max: 100 }),
            },
        });
        products.push(product);
    }
    for (let i = 0; i < 8; i++) {
        const user = users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })];
        const order = await prisma.orders.create({
            data: {
                userId: user.id,
                totalPrice: 0,
                status: faker_1.faker.datatype.boolean(),
                orderItems: {
                    create: [],
                },
            },
        });
        let total = 0;
        const numItems = faker_1.faker.number.int({ min: 1, max: 4 });
        for (let j = 0; j < numItems; j++) {
            const product = products[faker_1.faker.number.int({ min: 0, max: products.length - 1 })];
            const quantity = faker_1.faker.number.int({ min: 1, max: 5 });
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
//# sourceMappingURL=seed.js.map