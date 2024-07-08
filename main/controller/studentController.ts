import {NextFunction, Request, Response} from "express";
import {Inject, Service} from "typedi";
import "reflect-metadata";
import { StudentDaoImpl } from "../dao/studentDaoImpl";
import { Student, StudentImpl } from "../model/student"

interface StudentParma {
    nickname?: string;
    email?: string;
}

@Service()
export class StudentController {
    constructor(
        @Inject('studentDao') private studentDao: StudentDaoImpl
    ) {}

    hasAllProperties = (obj: any, propertyKey: string[]): boolean => {
        return propertyKey.every(prop => obj.hasOwnProperty(prop) && obj[prop] !== undefined && obj[prop] !== null);
    }

    registerStudent = async (req: Request, res: Response, next: NextFunction) => {
        const studentParma: StudentParma = req.query;

        if (!this.hasAllProperties(studentParma, Object.keys(studentParma))){
            return res.status(400).send('Missing required parameter');
        }
        try{
            const result = await this.studentDao.setStudentRegister(<Student>studentParma)
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }

    deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
        const studentIdParam = req.query.studentId;

        if (studentIdParam && Number.isNaN(Number(studentIdParam))){
            return res.status(400).send('Missing required parameter');
        }

        try {

        } catch (err) {
            next(err)
        }
    }

    
}