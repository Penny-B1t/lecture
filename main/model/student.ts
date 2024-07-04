import {RowDataPacket} from "mysql2/promise";

// RowDataPacket 타입이 아닌 특정 타입의 배열로 받는 코드 테스트
export interface StudentRow extends RowDataPacket {
    studentId : number;
    email : string;
    nickname : string;
}

export class Student {
    studentId: number;
    email: string;
    nickname: string;

    constructor(studentId: number, email: string, nickname: string) {
        this.studentId = studentId;
        this.email = email;
        this.nickname = nickname;
    }
}