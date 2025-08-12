const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const runMigration = async (direction) => {
    try {
        const sqlPath = path.join(__dirname, `${direction}.sql`);
        const sql = await fs.readFile(sqlPath, 'utf8');

        // Create a temporary connection without a database to create the database if it doesn't exist
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
        });

        // Split the SQL into individual statements and execute them
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        for (const statement of statements) {
            await tempConnection.query(statement);
        }

        console.log(`Migration '${direction}' completed successfully.`);
        await tempConnection.end();

    } catch (error) {
        console.error(`Error running migration '${direction}':`, error);
        process.exit(1);
    }
};

const args = process.argv.slice(2);
const command = args[0];

if (command === 'up' || command === 'down') {
    runMigration(command);
} else {
    console.log('Usage: node run.js [up|down]');
    process.exit(1);
}
