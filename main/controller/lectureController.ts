import {NextFunction, Request, Response} from "express";
import {Inject, Service} from "typedi";
import "reflect-metadata";
import {UserDaoImpl} from "../dao/lectureDaoImpl";

interface QueryParams {
    instructor?: string;
    course?: string;
    student?: string;
    category?: string;
    orderBy?: string;
    page?: string;
    limit?: string;
}

interface lectureRegisterInfo {
    category: number;
    title: string;
    description: string;
    lecturer_id : number;
    price: number;
}

interface lectureEditParams {
    lecturer_id : number;
    title: string;
    description: string;
    price: number;
}


@Service()
export class LectureController {
    constructor(
        @Inject('lectureDao') private lectureDao: UserDaoImpl
    ) {}

    hasAllProperties = (obj: any, propertyKey: string[]): boolean => {
        return propertyKey.every(prop => obj.hasOwnProperty(prop) && obj[prop] !== undefined && obj[prop] !== null);
    }

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
        // 파라미터 없는 경우 고려 필요
        const {
            instructor: instructorParam,
            course: lectureParam,
            student: studentParam,
            category: categoryParam,
            orderBy: orderByParam,
            page: pageParam,
            limit: limitParam
        }: QueryParams = req.query;

        // OR 이중 하나만
        if (!instructorParam && !lectureParam && !studentParam ) {
            return res.status(400).send('Missing required parameter');
        }

        // 카테고리 파라미터의 숫자가 아닌 값이 들어왔는지 검사하는 식
        // if (categoryParam && isNaN (Number (categoryParam)) ||
        //     orderByParam && isNaN (Number (categoryParam)) ||
        //     pageParam && isNaN (Number (categoryParam)) ||
        //     limitParam && isNaN (Number (categoryParam))) {
        //     return res.status(400).send('category parameter must be a number');
        // }

        const paramsToCheck = [categoryParam, orderByParam, pageParam, limitParam];

        if (paramsToCheck.some(param => param && isNaN(Number(param)))) {
            return res.status(400).send('category parameter must be a number');
        }

        // OR 이중 하나만
        const instructor = instructorParam ? String(instructorParam) : null;
        const course = lectureParam ? String(lectureParam) : null;
        const student = studentParam ? String(studentParam) : null;

        // 필수 업다면 전체 검색
        const number = 0;
        const category = categoryParam ? Number(categoryParam) : number;

        // 모두 필수
        const orderBy = orderByParam ? (Number(orderByParam) == 1 ? 'ASC' : 'DESC') : 'ASC';
        const page =  pageParam ? Number(pageParam) - 1 : 0;
        const limit = limitParam ? Number(limitParam) : 10;

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
        console.log(lectureTitlePram)

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
        const lecture: lectureRegisterInfo = req.body
        console.log(lecture)

        // 필수 파라미터가 공백인지 검사하는 로직
        if (!this.hasAllProperties(lecture, Object.keys(lecture))){
            return res.status(400).send('Missing required parameter');
        }

        try {
            const result = await this.lectureDao.setLectureRegister(lecture)
            return res.status(200).json({ message: `Lecture registered: ${lecture.title}` });
        } catch(err) {
            next(err)
        }
    }

    setLecturesRegister = async (req: Request, res: Response, next: NextFunction) => {
        const lectures : lectureRegisterInfo[] = req.body

        // 배열인지 검증하고 배열이 10개 이하인지 검증하는 로직
        if(!Array.isArray(lectures) || lectures.length > 10){
            return res.status(400).send('Request body must be an array of 10 or fewer lessons.');
        }

        // 배열 내부 객체들에 값이 비어있는지 검증하는 식
        for (const lecture of lectures){
            if (!this.hasAllProperties(lecture, Object.keys(lecture))){
                return res.status(400).send('Missing required parameter');
            }
        }

        try {
            const result = await this.lectureDao.setLecturesRegister(lectures);
            return res.status(200).json(result);
        } catch(err) {
            next(err)
        }
    }

    // 강의 수정
    setLectureEdit = async (req: Request, res: Response, next: NextFunction) => {
        const lectureEditParams: lectureEditParams = req.body

        // 필수 파라미터 검사
        if (!this.hasAllProperties(lectureEditParams, Object.keys(lectureEditParams))){
            return res.status(400).send('Missing required parameter');
        }

        try {
            const result = await this.lectureDao.lecturerUpdate(lectureEditParams);
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