import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import "reflect-metadata";
import { StudentDaoImpl } from "../dao/studentDaoImpl";
import {Student, LectureRegisterArray, LectureRegist} from "../model/student"
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { StudentParma } from "../model/studentParam";

@Service()
export class StudentController {
    constructor(
        @Inject('studentDao') private studentDao: StudentDaoImpl
    ) {}

    validatorStudent = async (req: Request, res: Response, next: NextFunction) => {
            const idParma = req.params.id
            const result = await this.studentDao.validateStudent(Number(idParma));

            if (!result){
                return res.status(400).send('Student already exists');
            } else {
                next()
            }
    }

    registerStudent = async (req: Request, res: Response, next: NextFunction) => {
        const studentParma: StudentParma = plainToInstance(StudentParma,req.query);
        const errors = await validate(studentParma);

        if (errors.length > 0) {
            return res.status(400).send({ errors: errors });
        }

        try{
            const result = await this.studentDao.setStudentRegister(<Student>studentParma)
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
        const studentIdParam = req.params.id;

        if (studentIdParam && Number.isNaN(Number(studentIdParam))){
            return res.status(400).send('Missing required parameter');
        }

        try {
            const result = await this.studentDao.StudentDelete(Number(studentIdParam))
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    lecturerRegister = async (req: Request, res: Response, next: NextFunction) => {
        const lectureInfoParams = plainToInstance(LectureRegist,req.body);
        const studentIdParam = req.params.id;
        const lecturesInfo = new LectureRegisterArray(studentIdParam, lectureInfoParams)

        const errors = await validate(lecturesInfo);

        if (errors.length > 0) {
            return res.status(404).send('Lecturer Register not found');
        }

        try{
            const result = await this.studentDao.setLectureRegister(lecturesInfo)
            return res.status(200).send(result)
        } catch(err) {
            next(err)
        }
    }
}