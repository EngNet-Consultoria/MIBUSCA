import { type Pool, createPool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";

class MySqlConnector {
  private readonly pool: Pool;

  constructor() {
    this.pool = createPool({
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 10,
    });
  }

  async query(query: string, values?: any): Promise<RowDataPacket[]> {
    if (!query.includes("SELECT")) throw new Error("Use execute() for non-SELECT queries");
    const [rows] = await this.pool.query<RowDataPacket[]>(query, values);
    return rows;
  }

  async execute(query: string, values?: any): Promise<ResultSetHeader> {
    if (query.includes("SELECT")) throw new Error("Use query() for SELECT queries");
    const [result] = await this.pool.query<ResultSetHeader>(query, values);
    return result;
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}

export const mysqlConn = new MySqlConnector();
