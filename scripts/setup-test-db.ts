import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL.includes('/test')) {
	console.error('ERROR: DATABASE_URL must point to test database');
	console.error('Current DATABASE_URL:', DATABASE_URL);
	process.exit(1);
}

async function setupTestDatabase() {
	console.log('Setting up test database schema...');

	const client = postgres(DATABASE_URL, { max: 1 });
	const db = drizzle(client);

	try {
		// Run migrations to set up schema
		await migrate(db, { migrationsFolder: './drizzle' });

		console.log('✓ Test database schema applied successfully');
	} catch (error) {
		console.error('Failed to set up test database:', error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

setupTestDatabase();
