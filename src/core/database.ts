// core/Database.ts
import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";

export class Database {
    private pool: Pool;
    private connection: PoolConnection | null = null;
    private inTransactionFlag: boolean = false;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    get inTransaction(): boolean {
        return this.inTransactionFlag;
    }

    async query<T extends RowDataPacket[] | ResultSetHeader>(
        sql: string,
        params: any[] = []
    ): Promise<[T, any]> {
        if (this.inTransactionFlag && this.connection) {
        return this.connection.query<T>(sql, params);
        }
        return this.pool.query<T>(sql, params);
    }

    async beginTransaction(): Promise<void> {
        if (this.inTransactionFlag) return; // ya hay una activa
        this.connection = await this.pool.getConnection();
        await this.connection.beginTransaction();
        this.inTransactionFlag = true;
    }

    async commit(): Promise<void> {
        if (!this.inTransactionFlag || !this.connection) return;
        await this.connection.commit();
        this.connection.release();
        this.connection = null;
        this.inTransactionFlag = false;
    }

    async rollback(): Promise<void> {
        if (!this.inTransactionFlag || !this.connection) return;
        await this.connection.rollback();
        this.connection.release();
        this.connection = null;
        this.inTransactionFlag = false;
    }
}
