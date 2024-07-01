import {createPool, Pool, QueryResult, RowDataPacket} from "mysql2/promise";

// MysqlRepository ConnectionPool Class
class MysqlRepository{
    // 커넥션 풀을 보관하는 변수
    private pool: Pool;
    constructor() {
        console.log(`MySQL has been initialized`)
        this.pool = createPool({
            host :`localhost`,
            user : `root`,
            password : `passowrd`,
            database : `dalong`
        })
    }

    /**
     *
     * @param query 컴파일 하고자 하는 SQL문
     * @param params 인자 바인딩을 하고자 하는 값들의 배열
     */
    async executeQuery<T extends RowDataPacket[]>( query:string, params:any[]=[]) {
        let connection = null;
        try{
            connection = await this.pool.getConnection();
            let [res] = await connection.query<T>(query, params)
            return res;
        } catch (error){
            console.error(error);
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = MysqlRepository;