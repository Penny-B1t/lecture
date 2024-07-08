import {RowDataPacket} from "mysql2/promise";
import {LectureResisterImpl} from "./lecture";

// RowDataPacket 타입이 아닌 특정 타입의 배열로 받는 코드 테스트
export interface StudentImpl {
    nickname: string;
    email: string;
}

export class Student implements StudentImpl{
    nickname: string;
    email: string;

    constructor(nickname: string, email: string) {
        this.nickname = nickname;
        this.email = email;
    }
}

export interface LectureRegisterImpl {
    studentId: number;
    lecture_id : number;
}

export class LectureRegister implements LectureRegisterImpl{
    studentId: number;
    lecture_id : number;

    constructor(studentId: number, lecture_id: number) {
        this.studentId = studentId;
        this.lecture_id = lecture_id;
    }
}