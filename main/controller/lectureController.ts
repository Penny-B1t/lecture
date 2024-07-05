import { Request, Response, NextFunction } from "express";
import {Container, Inject, Service} from "typedi";
import "reflect-metadata";

import { MysqlRepository } from "../repository/MySQLrepository"
import { Student } from "../model/student";
import { UserDaoImpl } from "../dao/lectureDaoImpl"

@Service('lectureController')
export class LectureController {
    constructor(
        @Inject('Repository') private repository: MysqlRepository,
        @Inject('lecturDao') private lecturDao: UserDaoImpl
    ){
        this.repository = repository;
        this.lecturDao = lecturDao;
    }


    getLectureList = async (req: Request, res: Response, next: NextFunction) => {
        console.log('getLectureList');

        // 파라미터 없는 경우 고려 필요
        const instructorParam = req.query.instructor;
        const courseParam = req.query.course;
        const studentParam = req.query.student;
        const categoryParam = req.query.category;

        // 필수 파라미터 누락 검사
        if (!instructorParam && !courseParam && !studentParam ) {
            return res.status(400).send('Missing required parameter');
        }

        // 파라미터 값이 숫자가 아닌 경우
        if (categoryParam && isNaN(Number(categoryParam))) {
            return res.status(400).send('category parameter must be a number');
        }

        const instructor = instructorParam ? String(instructorParam) : null;
        const course = courseParam ? String(courseParam) : null;
        const student = studentParam ? String(studentParam) : null;
        const category = categoryParam ? Number(categoryParam) : null;

        try{
            const [rows] = await this.lecturDao.getLectureList(instructor, course, student, category)
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
            // const [rows] = await this.lecturDao.getLectureList(instructor, course, student, category)
            // res.status(200).json(rows);
        } catch(err) {
            next(err)
        }
    }
}