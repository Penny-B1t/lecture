import {
    ArrayMaxSize, ArrayMinSize,
    IsInt,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
    ValidateNested
} from "class-validator";
import { Type } from 'class-transformer';
import { format } from 'date-fns';

export class QueryParams {
    @IsString()
    @IsOptional()
    instructor?: string;

    @IsString()
    @IsOptional()
    course?: string;

    @IsString()
    @IsOptional()
    student?: string;

    @IsNumberString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    sortBy?: string;

    @IsNumberString()
    @IsOptional()
    orderBy?: string;

    @IsNumberString()
    @IsOptional()
    page?: string;

    @IsNumberString()
    @IsOptional()
    limit?: string;

    constructor(instructor: string, course: string, student: string, category: string, sortBy: string, orderBy: string, page: string, limit: string) {
        this.instructor = instructor;
        this.course = course;
        this.student = student;
        this.category = category;
        this.sortBy = sortBy;
        this.orderBy = orderBy;
        this.page = page;
        this.limit = limit;
    }
}

export class lectureRegisterInfo {
    @IsInt()
    @IsNotEmpty()
    category: number;

    @IsString()
    @Length(5, 50)
    @IsNotEmpty()
    title: string;

    @IsString()
    @Length(5, 100)
    @IsNotEmpty()
    description: string;

    @IsInt()
    @IsNotEmpty()
    lecturer_id : number;

    @IsInt()
    @IsNotEmpty()
    price: number;


    constructor(category: number, title: string, description: string, lecturer_id: number, price: number) {
        this.category = category;
        this.title = title;
        this.description = description;
        this.lecturer_id = lecturer_id;
        this.price = price;
    }
}

export class lectureRegisterInfoArray {
    @ValidateNested({ each: true })
    @Type(() => lectureRegisterInfo)
    @ArrayMinSize(1, { message: 'lecturesInfo must contain at least 1 item.' })
    @ArrayMaxSize(10, { message: 'lecturesInfo must contain no more than 10 items.' })
    lecturesInfo: lectureRegisterInfo[]

    constructor(lecturesInfo: lectureRegisterInfo[]) {
        this.lecturesInfo = lecturesInfo;
    }
}

export class lectureEditParams {
    @IsInt()
    @IsNotEmpty()
    lecturer_id : number;

    @IsString()
    @Length(5, 50)
    @IsOptional()
    title: string;

    @IsString()
    @Length(5, 100)
    @IsOptional()
    description: string;

    @IsInt()
    @IsOptional()
    price: number;


    constructor(lecturer_id: number, title: string, description: string, price: number) {
        this.lecturer_id = lecturer_id;
        this.title = title;
        this.description = description;
        this.price = price;
    }
}