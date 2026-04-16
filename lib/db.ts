import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Log pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const db = {
    query: async (text: string, params?: any[]) => {
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            if (process.env.NODE_ENV !== 'production') {
                console.log('Executed query', { text, duration, rows: res.rowCount });
            }
            return res;
        } catch (error: any) {
            console.error('DATABASE_QUERY_ERROR:', error.message, { text });
            throw error;
        }
    },
};
