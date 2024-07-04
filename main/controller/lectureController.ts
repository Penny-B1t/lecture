import { Request, Response, NextFunction } from "express";
import {Container, Inject, Service} from "typedi";
import "reflect-metadata";

import { MysqlRepository } from "../repository/MySQLrepository"
import { Student } from "../model/student";

@Service('lectureController')
export class LectureController {
    constructor(@Inject('Repository') private repository: MysqlRepository) {
        this.repository = repository;
    }


    getLectureList = async (req: Request, res: Response, next: NextFunction) => {
        console.log('getLectureList');

        // 파라미터 없는 경우 고려 필요
        const instructor = req.query.instructor;
        const course = req.query.course;
        const student = req.query.student;
        const category = req.query.category;
        // const { instructor, course, student } = req.query;

        let query = 'SELECT * FROM students WHERE 1=1';
        const params = [];

        if (instructor) {
            query += ' AND instructor_name LIKE ?';
            params.push(`%${instructor}%`);
        }

        if (course) {
            query += ' AND course_name LIKE ?';
            params.push(`%${course}%`);
        }

        if (student) {
            query += ' AND student_identifier LIKE ?';
            params.push(`%${student}%`);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        try {
            // 저장 레이어 상속 받아 실행
            const [rows] = await this.repository.executeQuery<Student>(query, params, Student);
            res.status(200).json(rows);
        } catch(err) {
            next(err)
        }
    }

    getLectureDetail = async (req: Request, res: Response, next: NextFunction) => {
        const lectureId = req.query.lectureId;

        let query = 'SELECT * FROM students WHERE 1=1';
        const params = [lectureId];

        try{
            // const [rows] = await this.repository.execute<Student>(query, params);
            // res.status(200).json(rows);
        } catch(err) {
            next(err)
        }
    }
}