import {
    IsEmail,
    IsString,
} from "class-validator";

export class StudentParma {
    @IsString()
    nickname: string;

    @IsEmail()
    email: string;

    constructor(nickname: string, email: string) {
        this.nickname = nickname;
        this.email = email;
    }
}