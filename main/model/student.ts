import {ArrayMinSize, IsInt, IsString, ValidateNested,} from "class-validator";
import {Type} from "class-transformer";
import {Is} from "@sinclair/typebox/value/is";
import {LectureRegister} from "./lecture";

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
    lecture_id : number;
}

export class LectureRegist implements LectureRegisterImpl {

    @IsInt ()
    lecture_id: number;

    constructor( lecture_id: number) {
        this.lecture_id = lecture_id;
    }
}

export class LectureRegisterArray {

    @IsString()
    studentId: string;

    @ValidateNested({ each: true })
    @Type(() => LectureRegist)
    @ArrayMinSize(1, { message: 'lecturesInfo must contain at least 1 item.' })
    lecturesInfo: LectureRegist[]


    constructor(studentId: string, lecturesInfo: LectureRegist[]) {
        this.studentId = studentId;
        this.lecturesInfo = lecturesInfo;
    }
}
