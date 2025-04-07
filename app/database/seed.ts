import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "./prisma";

async function main() {
  console.log("Database cleared. Starting to seed...");

  // Create Users (assuming you have a User model)
  const usersToCreate = 10;
  const users = [];

  for (let i = 0; i < usersToCreate; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        // Add other User model fields here
      },
    });
    users.push(user);
    console.log(`Created user: ${user.id}`);
  }

  // Create Categories
  const categoryNames = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Books",
    "Sports",
    "Toys",
    "Beauty",
    "Automotive",
    "Food",
    "Health",
  ];

  const categories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    categories.push(category);
    console.log(`Created category: ${category.name}`);
  }

  // Create Products with Categories
  const productsToCreate = 50;
  const products = [];

  for (let i = 0; i < productsToCreate; i++) {
    // Assign 1-3 random categories to each product
    const numCategories = faker.number.int({ min: 1, max: 3 });
    const productCategories = faker.helpers.arrayElements(
      categories,
      numCategories,
    );

    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        categories: {
          create: productCategories.map((category) => ({
            name: category.name,
          })),
        },
      },
    });

    products.push(product);
    console.log(`Created product: ${product.name}`);
  }

  // Create Orders
  const ordersToCreate = 100;
  const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  for (let i = 0; i < ordersToCreate; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const status = faker.helpers.arrayElement(orderStatuses);

    try {
      const order = await prisma.order.create({
        data: {
          status,
          createdById: user.id,
          productId: product.publicId,
        },
      });

      console.log(`Created order: ${order.id} for product: ${product.name}`);
    } catch (error) {
      // Skip if the unique constraint is violated (user already ordered this product)
      console.log(
        `Skipping duplicate order for user ${user.id} and product ${product.publicId}`,
      );
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
