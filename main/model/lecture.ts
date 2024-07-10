import {IsString, IsEmail, Length, IsInt, IsDate} from 'class-validator';
import {Is} from "@sinclair/typebox/value/is";

// 강의 목록 조회용 DTO
export interface LectureResisterImpl {
    lecture_id: number;
    title: string;
    category: number;
    lectureRegisterDate : Date;
    lecturerName: string;
    price: number;
    registerCount: number;
}

export class LectureRegister implements LectureResisterImpl{
    @IsInt()
    lecture_id: number;

    @Length(5, 50)
    title: string;

    @IsInt()
    category: number;

    @IsDate()
    lectureRegisterDate : Date;

    @IsString()
    lecturerName: string;

    @IsInt()
    price: number;

    @IsInt()
    registerCount: number;

    constructor(
        lecture_id: number, title: string, category: number, lectureRegisterDate: Date, lecturerName: string,
        price: number, registerCount: number
    ){
        this.lecture_id = lecture_id;
        this.title = title;
        this.category = category;
        this.lectureRegisterDate = lectureRegisterDate;
        this.lecturerName = lecturerName;
        this.price = price;
        this.registerCount = registerCount;
    }
}

// 수강생 정보 조회용 DTO
export interface LectureRegisterDetailsImpl {
    nickname : string;
    register_date : Date;
}

export class LectureRegisterDetails implements LectureRegisterDetailsImpl{
    @IsString()
    nickname: string;

    @IsDate()
    register_date: Date;

    constructor(nickname: string, register_date: Date) {
        this.nickname = nickname;
        this.register_date = register_date;
    }
}

//강의 상세 조회용 DTO
export interface LectureDetailsImpl {
    lecturer_id : number;
    title: string;
    description: string;
    category: number;
    price: number;
    registerCount?: number;
    register_date: Date;
    modified_date: Date;
    student_list ?: LectureRegisterDetails[]
}

export class LectureDetails implements LectureDetailsImpl{
    lecturer_id : number;
    title: string;
    description: string;
    category: number;
    price: number;
    private _registerCount?: number;
    register_date: Date;
    modified_date: Date;
    private _student_list ?: LectureRegisterDetails[]


    constructor(lecturer_id: number,title: string, description: string, category: number, price: number,
                register_date: Date, modified_date: Date) {

        this.lecturer_id = lecturer_id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.price = price;
        this.register_date = register_date;
        this.modified_date = modified_date;
    }


    set registerCount(value: number) {
        this._registerCount = value;
    }

    set student_list(value: LectureRegisterDetails[]) {
        this._student_list = value;
    }
}