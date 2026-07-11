import '@locker/env';
import { db } from '../client';
import { users } from '../schema';

async function main() {
  console.log('Seeding database...');
  
  // Add your seed data here
  // Example:
  // await db.insert(users).values({
  //   id: 'seed-user-1',
  //   email: 'seed@example.com',
  //   name: 'Seed User',
  // });
  
  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$client.end();
  });
