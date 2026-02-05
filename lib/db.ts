import { Pool } from 'pg';

const pool = new Pool({
    user: 'mihirrathod',
    host: 'localhost',
    database: 'scan-pan',
    password: '',
    port: 5432,
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
};
