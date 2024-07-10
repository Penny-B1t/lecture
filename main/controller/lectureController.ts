import { NextFunction, Request, Response } from "express";
import { Inject, Service} from "typedi";
import "reflect-metadata";
import { UserDaoImpl} from "../dao/lectureDaoImpl";
import { QueryParams, lectureRegisterInfo, lectureRegisterInfoArray, lectureEditParams } from "../model/lectureParam"
import { plainToClass, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";


@Service()
export class LectureController {
    constructor(
        @Inject('lectureDao') private lectureDao: UserDaoImpl
    ) {}

    formatValidationErrors = (errors: ValidationError[]): { property: string, messages: string[] }[] => {
        return errors.map(error => {
            const messages = error.constraints ? Object.values(error.constraints) : [];
            return {
                property: error.property,
                messages
            };
        });
    };

    validationLecturer = async (req: Request, res: Response, next: NextFunction) => {
        const lecturerIdParam = req.query.lecturer_Id;

        if (!lecturerIdParam && Number.isNaN(Number(lecturerIdParam))){
            return res.status(400).send('Lecture id must be a number');
        }

        try {
            const result = await this.lectureDao.getLecturer(Number(lecturerIdParam));

            if (result) {
                next()
            } else {
                return res.status(404).send('Lecture id not found');
            }
        } catch (err) {
            next(err)
        }


    }

    getLectureList = async (req: Request, res: Response, next: NextFunction) => {
        const lecturerParam = plainToClass(QueryParams,req.query)
        const errors = await validate(lecturerParam)

        if (errors.length > 0) {
            console.log(errors)
            return res.status(400).send(errors)
        }

        // OR 이중 하나만
        if (!lecturerParam.instructor && !lecturerParam.course && !lecturerParam.student ) {
            return res.status(400).send('Missing required parameter');
        }

        // OR 이중 하나만
        const instructor = lecturerParam.instructor ? String(lecturerParam.instructor) : null;
        const course = lecturerParam.course ? String(lecturerParam.course) : null;
        const student = lecturerParam.student ? String(lecturerParam.student) : null;

        // 필수 업다면 전체 검색
        const number = 0;
        const category = lecturerParam.category ? Number(lecturerParam.category) : number;

        // 모두 필수
        const orderBy = lecturerParam.orderBy ? (Number(lecturerParam.orderBy) == 1 ? 'ASC' : 'DESC') : 'ASC';
        const page =  lecturerParam.page ? Number(lecturerParam.page) - 1 : 0;
        const limit = lecturerParam.limit ? Number(lecturerParam.limit) : 10;

        try{
            const rows = await this.lectureDao
                .getLectureList(instructor, course, student, category, orderBy, page, limit);
            res.status(200).json(rows);
        } catch(err) {
            next(err)
        }
    }

    getLectureDetail = async (req: Request, res: Response, next: NextFunction) => {
        const  lectureTitlePram = req.query.title;

        // 필수 파라미터 검사
        if (!lectureTitlePram) {
            return res.status(400).send('Lecture Title must be a string');
        }

        try{
            const rows = await this.lectureDao.getLectureDetails(String(lectureTitlePram))
            res.status(200).json(rows);
        } catch(err) {
            next(err)
        }
    }

    setLectureResister = async (req: Request, res: Response, next: NextFunction) => {
        const lecture:lectureRegisterInfo  = plainToInstance(lectureRegisterInfo, req.body as Object)
        const errors :ValidationError[] = await validate(lecture)

        if (errors.length > 0) {
            const errorsMessage = this.formatValidationErrors(errors)
            return res.status(400).send(errorsMessage);
        }

        try {
            const result = await this.lectureDao.setLectureRegister(lecture)
            return res.status(200).json({ message: `Lecture registered: ${lecture.title}` });
        } catch(err) {
            next(err)
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    setLecturesRegister = async (req: Request, res: Response, next: NextFunction) => {
        const lectures = new lectureRegisterInfoArray(plainToInstance(lectureRegisterInfo, req.body));
        const errors = await validate(lectures);

        if (errors.length > 0) {
            const errorsMessage = this.formatValidationErrors(errors)
            return res.status(400).send(errorsMessage);
        }

        try {
            const result = await this.lectureDao.setLecturesRegister(lectures.lecturesInfo);
            return res.status(200).json(result);
        } catch(err) {
            next(err)
        }
    }

    // 강의 수정
    setLectureEdit = async (req: Request, res: Response, next: NextFunction) => {
        const updateParam = plainToInstance(lectureEditParams, req.body as Object);
        const errors = await validate(updateParam);

        if (errors.length > 0) {
            const errorsMessage = this.formatValidationErrors(errors)
            return res.status(400).send(errorsMessage);
        }

        try {
            const result = await this.lectureDao.lecturerUpdate(updateParam);
            return res.status(200).json(result);
        } catch(err) {
            next(err)
        }
    }

    // 강의 오픈
    setLectureOpen = async(req: Request, res: Response, next: NextFunction) => {
        const lectureIdParam = req.query.lecture_id;

        if (!lectureIdParam && Number.isNaN(Number(lectureIdParam))){
            return res.status(400).send('Lecture id must be a number');
        }

        try {
            const result = await this.lectureDao.setOpenLectures(Number(lectureIdParam));
            return res.status(200).json(result);
        } catch (err) {
            next(err)
        }
    }

    // 강의 삭제
    setLectureDelete = async(req: Request, res: Response, next: NextFunction) => {
        const lectureIdParam = req.query.lecture_id;

        if (!lectureIdParam && Number.isNaN(Number(lectureIdParam))){
            return res.status(400).send('Lecture id must be a number');
        }

        try {
            const result = await this.lectureDao.lecturerDelete(Number(lectureIdParam));
            return res.status(200).json(result);
        } catch (err) {
            next(err)
        }
    }
}