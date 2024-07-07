import {createPool, Pool, RowDataPacket , PoolConnection} from "mysql2/promise";
import {Service} from "typedi";

type Constructor<T> = new (...args: any[]) => T;

@Service('Repository')
export default class MysqlRepository{
    // 커넥션 풀을 보관하는 변수
    public pool: Pool;
    constructor() {
        console.log(`MySQL has been initialized`)
        this.pool = createPool({
            host :`223.130.142.124`,
            user : `root`,
            password : `bnctech211`,
            database : `lecture`
        })
    }

    // /**
    //  *
    //  * @param query 컴파일 하고자 하는 SQL문
    //  * @param params 인자 바인딩을 하고자 하는 값들의 배열
    //  * @param entity
    //  */
    // async executeQuery<T>( query: string, params: any[]=[], entity: Constructor<T> ) {
    //     let connection = null;
    //     try{
    //         connection = await this.pool.getConnection();
    //         let [rows] = await connection.query<RowDataPacket[]>(query, params)

    //         return rows.map(row => {
    //             return new entity(...Object.values(row))
    //         })
    //     } catch (error){
    //         const e = error as Error;
    //         throw new Error(e.message);
    //     } finally {
    //         if (connection) connection.release();
    //     }
    // }
    // async executeQuery(query: string, params: any[]=[]){
    //     let connection = null;
    //     try{
    //         connection = await this.pool.getConnection();
    //         let [rows] = await connection.query<RowDataPacket[]>(query, params)
    //         return rows.map(row => { new Student(row.id, row,)})
    //     } catch (error){
    //         const e = error as Error;
    //         throw new Error(e.message);
    //     } finally {
    //         if (connection) connection.release();
    //     }
    // }

    async getConnetion(): Promise<PoolConnection>{
        return await this.pool.getConnection();
    }

    async disconnect(connection: PoolConnection | undefined): Promise<void>{
        if(connection) connection.release();
    }
}