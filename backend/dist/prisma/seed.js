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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
dotenv.config({ path: path_1.default.join(__dirname, '..', '.env') });
const prisma = new client_1.PrismaClient();
faker_1.faker.seed(20260423);
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function chance(probability) {
    return Math.random() < probability;
}
function round2(value) {
    return Math.round(value * 100) / 100;
}
function randomPastDate(maxDaysAgo) {
    const now = Date.now();
    const offsetMs = random(0, maxDaysAgo) * 24 * 60 * 60 * 1000;
    return new Date(now - offsetMs);
}
const seedUsers = [
    { username: 'admin', email: 'admin@admin.com', password: 'admin123', role: 'ADMIN' },
    { username: 'alice', email: 'alice@gmail.com', password: 'alice123', role: 'USER' },
    { username: 'bob', email: 'bob@yahoo.com', password: 'bob123', role: 'USER' },
    { username: 'charlie', email: 'charlie@outlook.com', password: 'charlie123', role: 'USER' },
    { username: 'diana', email: 'diana@gmail.com', password: 'diana123', role: 'USER' },
];
const generatedUserCount = 20;
const categories = [
    'Elektronika',
    'Kiegeszitok',
    'Iroda',
    'Otthon',
    'Divat',
    'Sport',
    'Gaming',
    'Audio',
];
const productNameByCategory = {
    Elektronika: ['Laptop', 'Tablet', 'Smartphone', 'Okosora', 'Monitor'],
    Kiegeszitok: ['USB-C kabel', 'Tolto adapter', 'Power bank', 'Telefon tok', 'Hub'],
    Iroda: ['Irodai szek', 'Asztali lampa', 'Jegyzetfuzet', 'Iroasztal', 'Toll keszlet'],
    Otthon: ['Led izzo', 'Levegotisztito', 'Robotporszivo', 'Konyhai merleg', 'Parologtato'],
    Divat: ['Hatizsak', 'Sport polo', 'Sneaker', 'Kabát', 'Napszemuveg'],
    Sport: ['Joga matrac', 'Kezisulyzo', 'Kulacs', 'Futasora', 'Edzo kotel'],
    Gaming: ['Mechanikus billentyuzet', 'Gaming eger', 'Gamer szek', 'Headset', 'Egérpad'],
    Audio: ['Bluetooth hangszoro', 'Mikrofon', 'Studio fejhallgato', 'Soundbar', 'Fules'],
};
const brandByCategory = {
    Elektronika: ['Samsung', 'Apple', 'Xiaomi', 'Lenovo', 'ASUS', 'HP'],
    Kiegeszitok: ['Anker', 'UGREEN', 'Baseus', 'Belkin', 'Aukey'],
    Iroda: ['IKEA', 'Herman Miller', 'Fellowes', 'Leitz', 'Oxford'],
    Otthon: ['Philips', 'Bosch', 'Tefal', 'Xiaomi', 'Rowenta'],
    Divat: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'],
    Sport: ['Decathlon', 'Nike', 'Adidas', 'Puma', 'GymBeam'],
    Gaming: ['Logitech', 'Razer', 'ASUS', 'MSI', 'HyperX'],
    Audio: ['Sony', 'JBL', 'Marshall', 'Bose', 'Shure'],
};
const priceRanges = {
    Elektronika: { min: 35000, max: 650000 },
    Kiegeszitok: { min: 1490, max: 24990 },
    Iroda: { min: 2490, max: 189990 },
    Otthon: { min: 3990, max: 299990 },
    Divat: { min: 4990, max: 49990 },
    Sport: { min: 2990, max: 79990 },
    Gaming: { min: 4990, max: 249990 },
    Audio: { min: 4990, max: 109990 },
};
function smartPrice(category) {
    const range = priceRanges[category];
    const skewed = Math.pow(Math.random(), 0.55);
    return round2(range.min + (range.max - range.min) * skewed);
}
const stockRanges = {
    Elektronika: { min: 3, max: 85, lowStockChance: 0.18 },
    Kiegeszitok: { min: 20, max: 250, lowStockChance: 0.06 },
    Iroda: { min: 8, max: 160, lowStockChance: 0.1 },
    Otthon: { min: 6, max: 90, lowStockChance: 0.12 },
    Divat: { min: 10, max: 140, lowStockChance: 0.15 },
    Sport: { min: 8, max: 120, lowStockChance: 0.12 },
    Gaming: { min: 5, max: 70, lowStockChance: 0.2 },
    Audio: { min: 4, max: 75, lowStockChance: 0.16 },
};
const imagePalette = {
    Elektronika: '0f172a',
    Kiegeszitok: '1f2937',
    Iroda: '334155',
    Otthon: '14532d',
    Divat: '7c2d12',
    Sport: '1d4ed8',
    Gaming: '4c1d95',
    Audio: '111827',
};
function buildProductImageUrl(name, category) {
    const shortText = `${category} ${name}`.slice(0, 42);
    return `https://placehold.co/800x800/${imagePalette[category]}/f8fafc?text=${encodeURIComponent(shortText)}`;
}
function buildStock(category) {
    const range = stockRanges[category];
    if (chance(range.lowStockChance)) {
        return random(0, 5);
    }
    const skewed = Math.pow(Math.random(), 0.7);
    return Math.max(0, Math.round(range.min + (range.max - range.min) * skewed));
}
const reviewTitles = [
    'Kivalo termek',
    'Ar-ertek aranyban eros',
    'Nagyon elegedett vagyok',
    'Ajanlom masoknak is',
    'Minosegi kivitel',
    'Felulmulja az elvarast',
    'Napi hasznalatra tokeletes',
];
const reviewComments = [
    'Gyorsan megerkezett, es pont azt nyujtja, amit vartam.',
    'Minosegi anyagok, stabil mukodes es nagyon jo osszhatas.',
    'A mindennapi hasznalatban nagyon kenyelmes es megbizhato.',
    'Arban korrekt, teljesitmenyben pedig meglepoen eros.',
    'A beuzemeles egyszeru volt, es azota hibatlanul mukodik.',
    'A csomagolas rendben volt, a termek igenyes es tartos.',
    'Biztosan ujra vennek ettol a tipustol.',
];
const statuses = [
    client_1.OrderStatus.PENDING,
    client_1.OrderStatus.PROCESSING,
    client_1.OrderStatus.SHIPPED,
    client_1.OrderStatus.DELIVERED,
    client_1.OrderStatus.CANCELLED,
];
const couriers = [
    client_1.CourierService.UPS,
    client_1.CourierService.PACKETA,
    client_1.CourierService.DPD,
    client_1.CourierService.INPOST,
];
const languages = [
    client_1.SupportedLanguage.HU,
    client_1.SupportedLanguage.EN,
    client_1.SupportedLanguage.DE,
];
function weightedStatus() {
    const r = Math.random();
    if (r < 0.1)
        return client_1.OrderStatus.PENDING;
    if (r < 0.25)
        return client_1.OrderStatus.PROCESSING;
    if (r < 0.55)
        return client_1.OrderStatus.SHIPPED;
    if (r < 0.9)
        return client_1.OrderStatus.DELIVERED;
    return client_1.OrderStatus.CANCELLED;
}
function createGeneratedUsers() {
    const extraUsers = [];
    for (let i = 1; i <= generatedUserCount; i++) {
        const first = faker_1.faker.person.firstName().toLowerCase().replace(/[^a-z]/g, '');
        const last = faker_1.faker.person.lastName().toLowerCase().replace(/[^a-z]/g, '');
        const username = `${first}${last}${i}`;
        extraUsers.push({
            username,
            email: `${username}@example.com`,
            password: `user${100 + i}`,
            role: 'USER',
        });
    }
    return [...seedUsers, ...extraUsers];
}
function buildProductCatalog() {
    const products = [];
    for (const category of categories) {
        const names = productNameByCategory[category];
        const brands = brandByCategory[category];
        for (let i = 0; i < 12; i++) {
            const base = randomElement(names);
            const brand = randomElement(brands);
            const model = `${randomElement(['Pro', 'Plus', 'Max', 'Lite', 'Eco', 'Air'])} ${random(100, 999)}`;
            const rawName = `${brand} ${base} ${model}`;
            const name = rawName.slice(0, 95);
            const price = smartPrice(category);
            const stock = buildStock(category);
            const priceHint = category === 'Audio'
                ? 'A hangtechnikai termekek arai a belso szintu fulhallgatotol a komolyabb studio megoldasokig terjednek.'
                : category === 'Elektronika'
                    ? 'A kategoria arszintje a kozepkategorias es felso szegmens kozott mozog.'
                    : 'Az ar a termek valos piaci poziciojahoz igazodik.';
            const rawDescription = `${name} - ${category} kategoriaban, modern kivitelben es megbizhato minosegben. ${priceHint}`;
            const description = rawDescription.slice(0, 180);
            products.push({
                name,
                category,
                description,
                price,
                stock,
                image: buildProductImageUrl(name, category),
            });
        }
    }
    return products;
}
async function main() {
    console.log('🌱 Starting database seed...\n');
    console.log('🧹 Clearing old data...');
    await prisma.translation.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.reviews.deleteMany({});
    await prisma.orderItems.deleteMany({});
    await prisma.orders.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.compareItems.deleteMany({});
    await prisma.recentlyViewed.deleteMany({});
    await prisma.products.deleteMany({});
    await prisma.users.deleteMany({});
    console.log('✓ Old data cleared\n');
    const allUsers = createGeneratedUsers();
    const createdUsers = [];
    for (const userData of allUsers) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const name = userData.username.charAt(0).toUpperCase() + userData.username.slice(1);
        const user = await prisma.users.create({
            data: {
                username: userData.username,
                email: userData.email,
                password_hash: hashedPassword,
                name,
                role: userData.role,
            },
        });
        createdUsers.push(user);
    }
    console.log(`✓ Created ${createdUsers.length} users\n`);
    const cityByCountry = [
        { country: 'Hungary', city: 'Budapest' },
        { country: 'Hungary', city: 'Szeged' },
        { country: 'Hungary', city: 'Debrecen' },
        { country: 'Austria', city: 'Vienna' },
        { country: 'Germany', city: 'Berlin' },
    ];
    let addressCount = 0;
    const createdAddresses = [];
    for (const user of createdUsers) {
        const addressTotal = chance(0.35) ? 2 : 1;
        for (let i = 0; i < addressTotal; i++) {
            const location = randomElement(cityByCountry);
            const address = {
                userId: user.id,
                label: i === 0 ? 'Home' : 'Work',
                fullName: user.name || user.username,
                street: `${random(1, 140)} ${faker_1.faker.location.street()}`,
                city: location.city,
                state: faker_1.faker.location.state(),
                zipCode: faker_1.faker.location.zipCode(),
                country: location.country,
            };
            await prisma.address.create({
                data: { ...address, isDefault: i === 0 },
            });
            createdAddresses.push(address);
            addressCount++;
        }
    }
    console.log(`✓ Created ${addressCount} addresses\n`);
    const productCatalog = buildProductCatalog();
    const createdProducts = [];
    for (const productData of productCatalog) {
        const created = await prisma.products.create({
            data: {
                name: productData.name,
                description: productData.description,
                category: productData.category,
                price: productData.price,
                stock: productData.stock,
                image: productData.image,
            },
        });
        createdProducts.push(created);
    }
    console.log(`✓ Created ${createdProducts.length} products\n`);
    const orderCount = 90;
    for (let i = 0; i < orderCount; i++) {
        const user = createdUsers[random(0, createdUsers.length - 1)];
        const itemCount = random(1, 5);
        const orderItems = [];
        const usedProductIds = new Set();
        let total = 0;
        for (let j = 0; j < itemCount; j++) {
            let prod = randomElement(createdProducts);
            while (usedProductIds.has(prod.id)) {
                prod = randomElement(createdProducts);
            }
            usedProductIds.add(prod.id);
            const qty = random(1, 3);
            total += prod.price * qty;
            orderItems.push({ productId: prod.id, quantity: qty, price: prod.price });
        }
        const createdAt = randomPastDate(160);
        const userAddresses = createdAddresses.filter((address) => address.userId === user.id);
        const shippingAddress = userAddresses.length > 0 && chance(0.78)
            ? randomElement(userAddresses)
            : null;
        const courier = shippingAddress?.country === 'Hungary'
            ? randomElement([client_1.CourierService.UPS, client_1.CourierService.PACKETA, client_1.CourierService.DPD, client_1.CourierService.INPOST])
            : randomElement([client_1.CourierService.UPS, client_1.CourierService.DPD]);
        const trackingNumber = chance(0.2)
            ? null
            : `${randomElement(couriers)}-${random(100000, 999999)}-${String(i + 1).padStart(3, '0')}`;
        const shippingAddressText = shippingAddress
            ? `${shippingAddress.fullName}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}, ${shippingAddress.country}`
            : `${faker_1.faker.location.streetAddress()}, ${faker_1.faker.location.city()}, ${faker_1.faker.location.zipCode()}`;
        const trackingPrefix = courier === client_1.CourierService.UPS
            ? 'UPS'
            : courier === client_1.CourierService.DPD
                ? 'DPD'
                : courier === client_1.CourierService.INPOST
                    ? 'MPL'
                    : 'PKT';
        await prisma.orders.create({
            data: {
                userId: user.id,
                totalPrice: round2(total),
                createdAt,
                status: weightedStatus(),
                courier,
                shippingAddress: shippingAddressText,
                trackingNumber: trackingNumber ? `${trackingPrefix}-${trackingNumber.split('-').slice(1).join('-')}` : null,
                teljesitve: chance(0.55),
                orderItems: { create: orderItems },
            },
        });
    }
    console.log(`✓ Created ${orderCount} orders\n`);
    const reviewTarget = 170;
    const reviewPairs = new Set();
    while (reviewPairs.size < reviewTarget) {
        const user = randomElement(createdUsers);
        const product = randomElement(createdProducts);
        const pairKey = `${user.id}:${product.id}`;
        if (reviewPairs.has(pairKey))
            continue;
        reviewPairs.add(pairKey);
        await prisma.reviews.create({
            data: {
                userId: user.id,
                productId: product.id,
                rating: random(3, 5),
                title: randomElement(reviewTitles),
                comment: randomElement(reviewComments),
                createdAt: randomPastDate(140),
            },
        });
    }
    console.log(`✓ Created ${reviewPairs.size} reviews\n`);
    const wishlistTarget = 150;
    const wishlistPairs = new Set();
    while (wishlistPairs.size < wishlistTarget) {
        const user = randomElement(createdUsers);
        const product = randomElement(createdProducts);
        const pairKey = `${user.id}:${product.id}`;
        if (wishlistPairs.has(pairKey))
            continue;
        wishlistPairs.add(pairKey);
        await prisma.wishlist.create({
            data: {
                userId: user.id,
                productId: product.id,
                createdAt: randomPastDate(120),
            },
        });
    }
    console.log(`✓ Created ${wishlistPairs.size} wishlist items\n`);
    const compareTarget = 120;
    const comparePairs = new Set();
    while (comparePairs.size < compareTarget) {
        const user = randomElement(createdUsers);
        const product = randomElement(createdProducts);
        const pairKey = `${user.id}:${product.id}`;
        if (comparePairs.has(pairKey))
            continue;
        comparePairs.add(pairKey);
        await prisma.compareItems.create({
            data: {
                userId: user.id,
                productId: product.id,
                createdAt: randomPastDate(90),
            },
        });
    }
    console.log(`✓ Created ${comparePairs.size} compare items\n`);
    const viewedTarget = 260;
    const viewedPairs = new Set();
    while (viewedPairs.size < viewedTarget) {
        const user = randomElement(createdUsers);
        const product = randomElement(createdProducts);
        const pairKey = `${user.id}:${product.id}`;
        if (viewedPairs.has(pairKey))
            continue;
        viewedPairs.add(pairKey);
        await prisma.recentlyViewed.create({
            data: {
                userId: user.id,
                productId: product.id,
                viewedAt: randomPastDate(45),
            },
        });
    }
    console.log(`✓ Created ${viewedPairs.size} recently viewed items\n`);
    let translationCount = 0;
    for (const category of categories) {
        for (const language of languages) {
            const valuePrefix = language === client_1.SupportedLanguage.HU ? 'Kategoria' : language === client_1.SupportedLanguage.EN ? 'Category' : 'Kategorie';
            await prisma.translation.create({
                data: {
                    key: `category.${category}`,
                    language,
                    value: `${valuePrefix}: ${category}`,
                },
            });
            translationCount++;
        }
    }
    for (const product of createdProducts.slice(0, 60)) {
        for (const language of languages) {
            const valuePrefix = language === client_1.SupportedLanguage.HU ? 'Termek' : language === client_1.SupportedLanguage.EN ? 'Product' : 'Produkt';
            await prisma.translation.create({
                data: {
                    key: `products.${product.id}.name`,
                    language,
                    value: `${valuePrefix}: ${product.name}`,
                },
            });
            translationCount++;
        }
    }
    console.log(`✓ Created ${translationCount} translations\n`);
    console.log('✅ Database seeded successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('─────────────────────────────────────');
    for (const userData of seedUsers) {
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
//# sourceMappingURL=seed.js.map