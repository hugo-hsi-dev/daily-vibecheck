import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL.includes('/test')) {
	console.error('ERROR: DATABASE_URL must point to test database');
	console.error('Current DATABASE_URL:', DATABASE_URL);
	process.exit(1);
}

async function resetTestDatabase() {
	console.log('Resetting test database...');

	const client = postgres(DATABASE_URL, { max: 1 });
	const db = drizzle(client);

	try {
		// Drop all schemas (cascade to handle foreign keys and migration history)
		await db.execute(sql`
			DROP SCHEMA IF EXISTS public CASCADE;
			DROP SCHEMA IF EXISTS drizzle CASCADE;
			CREATE SCHEMA public;
			GRANT ALL ON SCHEMA public TO root;
			GRANT ALL ON SCHEMA public TO public;
		`);

		console.log('✓ Test database reset successfully');
	} catch (error) {
		console.error('Failed to reset test database:', error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

resetTestDatabase();
