import { createPool, type Pool, type RowDataPacket } from "mysql2/promise";

const uri = process.env["DB_ENDPOINT"] ?? "mysql://username:password@localhost:3306/dbname";

class Client {
    private readonly pool: Pool;

    constructor() {
        this.pool = createPool({
            uri,
        });
    }

    private getConnection() {
        return this.pool.getConnection();
    }

    async select<T extends RowDataPacket>(sql: string): Promise<T[]> {
        const conn = await this.getConnection();
        try {
            const [rows] = await conn.query<T[]>(sql);
            return rows;
        } finally {
            conn.release();
        }
    }
}

export const database = new Client();
