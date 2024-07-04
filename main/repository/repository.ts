import {RowDataPacket} from "mysql2/promise";

export interface Repository {
    executeQuery<T extends RowDataPacket[]>( query:string, params:any[] ): Promise<T>;
}