import {ArrayMinSize, IsInt, IsString, ValidateNested,} from "class-validator";
import {Type} from "class-transformer";

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

export class LectureRegister implements LectureRegisterImpl {
    @IsString ()
    studentId: number;

    @IsInt ()
    lecture_id: number;

    constructor(studentId: number, lecture_id: number) {
        this.studentId = studentId;
        this.lecture_id = lecture_id;
    }
}

export class LectureRegisterArray {
    @ValidateNested({ each: true })
    @Type(() => LectureRegister)
    @ArrayMinSize(1, { message: 'lecturesInfo must contain at least 1 item.' })
    lecturesInfo: LectureRegister[]


    constructor(lecturesInfo: LectureRegister[]) {
        this.lecturesInfo = lecturesInfo;
    }
}
