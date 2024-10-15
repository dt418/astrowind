import { db } from './index';
import { products, categories, productsCategories, users, orders, orderItems } from './schema';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding users...');
  // Seed Users
  const userIds: number[] = [];
  for (let i = 0; i < 50; i++) {
    const [user] = await db
      .insert(users)
      .values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
      })
      .returning({ id: users.id });
    userIds.push(user.id);
  }

  console.log('Seeding categories...');
  // Seed Categories
  const categoryIds: number[] = [];
  const uniqueCategories = new Set<string>();
  while (uniqueCategories.size < 10) {
    uniqueCategories.add(faker.commerce.department());
  }

  for (const categoryName of uniqueCategories) {
    const [category] = await db
      .insert(categories)
      .values({
        name: categoryName,
        description: faker.lorem.sentence(),
      })
      .returning({ id: categories.id });
    categoryIds.push(category.id);
  }

  console.log('Seeding products...');
  // Seed Products
  const productIds: number[] = [];
  for (let i = 0; i < 100; i++) {
    const [product] = await db
      .insert(products)
      .values({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price({ min: 1000, max: 100000 })),
        inStock: faker.datatype.boolean(),
      })
      .returning({ id: products.id });
    productIds.push(product.id);

    // Assign 1-3 random categories to each product
    const numCategories = faker.number.int({ min: 1, max: 3 });
    const selectedCategoryIds = faker.helpers.arrayElements(categoryIds, numCategories);
    for (const categoryId of selectedCategoryIds) {
      await db.insert(productsCategories).values({
        productId: product.id,
        categoryId: categoryId,
      });
    }
  }

  console.log('Seeding orders...');
  // Seed Orders and Order Items
  for (let i = 0; i < 200; i++) {
    const [order] = await db
      .insert(orders)
      .values({
        userId: faker.helpers.arrayElement(userIds),
        total: 0, // We'll calculate this based on order items
        status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
      })
      .returning({ id: orders.id });

    let orderTotal = 0;
    const numItems = faker.number.int({ min: 1, max: 5 });
    const selectedProductIds = faker.helpers.arrayElements(productIds, numItems);

    for (const productId of selectedProductIds) {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const [product] = await db.select({ price: products.price }).from(products).where(eq(products.id, productId));
      const itemPrice = product.price * quantity;

      await db.insert(orderItems).values({
        orderId: order.id,
        productId: productId,
        quantity: quantity,
        price: itemPrice,
      });

      orderTotal += itemPrice;
    }

    // Update order total
    await db.update(orders).set({ total: orderTotal }).where(eq(orders.id, order.id));
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
