import httpMocks from "node-mocks-http";
import { Container } from "typedi";
import "reflect-metadata";

import { LectureController } from "../../main/controller/lectureController"
import MysqlRepository from "../../main/repository/MySQLrepository"
import { Student } from "../../main/model/student";
import { UserDaoImpl } from "../../main/dao/lectureDaoImpl"

jest.mock("../../main/repository/MySQLrepository")
jest.mock("../../main/dao/lectureDaoImpl")

describe(`lectureController getLectureList Test`, () => {

    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.getLectureList = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        lecture = new LectureController(lecturDao);
    })

    // 선언되었는지 확인하는 코드
    it(`lecturesController is class`, ()=>{
        expect(typeof lecture.getLectureList).toBe("function");
        expect(lecture).toBeInstanceOf(LectureController);
    })

    //getLectureList 메서드를 호출 여부
    it(`should call getLectureList`, async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/user',
            query: {
                instructor: 'test',
            },
          });
        // req.query.instructor = 'test';
        await lecture.getLectureList(req, res, next);
        expect(lecturDao.getLectureList).toHaveBeenCalled();
    })

    it('should return a list of lectures when valid parameters are provided', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/lectures',
            query: {
                instructor: 'John Doe',
                course: 'Math 101',
                student: '12345',
                category: '1',
                orderBy: '1',
                page: '1',
                limit: '10'
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        const repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        const lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>;
        lecturDao.getLectureList = jest.fn().mockResolvedValue([{
            id: 1,
            instructor_name: 'John Doe',
            course_name: 'Math 101',
            student_identifier: '12345',
            category: 1
        }]);

        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);

        const lectureController = new LectureController(lecturDao);

        await lectureController.getLectureList(req, res, next);

        expect(lecturDao.getLectureList).toHaveBeenCalledWith(
            'John Doe', 'Math 101', '12345', 1, 'latest', 'ASC', 0, 10
        );
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual([{
            id: 1,
            instructor_name: 'John Doe',
            course_name: 'Math 101',
            student_identifier: '12345',
            category: 1
        }]);
    });

    it('should return a 400 status code if no required parameters are provided', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/lectures',
            query: {}
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        const repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        const lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>;

        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);

        const lectureController = new LectureController(lecturDao);

        await lectureController.getLectureList(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe('Missing required parameter');
    });
})

describe(`lectureController getLectureDetail Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.getLectureDetails = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        lecture = new LectureController(lecturDao);
    })

    // 선언되었는지 확인하는 코드
    it(`getLectureDetail is class`, ()=>{
        expect(typeof lecture.getLectureDetail).toBe("function");
        expect(lecture).toBeInstanceOf(LectureController);
    })

    it(`should call getLectureDetails`, async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/user',
            query: {
                title: 'Python for Data Science'
            },
        });
        // req.query.instructor = 'test';
        await lecture.getLectureDetail(req, res, next);
        expect(lecturDao.getLectureDetails).toHaveBeenCalled();
    })

    it('should return a list of lectures when valid parameters are provided', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/lectures',
            query: {
                title: 'Python for Data Science'
            }
        });

        lecturDao.getLectureDetails = jest.fn().mockResolvedValue([{
            id: 1,
            instructor_name: 'John Doe',
            course_name: 'Math 101',
            student_identifier: '12345',
            category: 1
        }]);

        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);

        await lecture.getLectureDetail(req, res, next);

        expect(lecturDao.getLectureDetails).toHaveBeenCalledWith(
            'Python for Data Science'
        );
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual([{
            id: 1,
            instructor_name: 'John Doe',
            course_name: 'Math 101',
            student_identifier: '12345',
            category: 1
        }]);
    });

    it('should return a 400 status code if no required parameters are provided', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/lectures',
            query: {}
        });

        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);

        await lecture.getLectureList(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe('Missing required parameter');
    });
});

describe(`lectureController setLectureResister Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.setLectureRegister = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        // lecture = Container.get('lectureController'); //
        lecture = new LectureController(lecturDao);
    })

    it(`setLectureResister is class`, () => {
        expect(typeof lecture.setLectureResister).toBe("function");
    })

    it(`should call setLectureRegister`, async () => {
        const req = httpMocks.createRequest();
        req.body = {
            "category": 1,
            "title": "Introduction to Programming",
            "description": "This is a beginner level course on programming.",
            "lecturer_id": 101,
            "price": 50
        }
        await lecture.setLectureResister(req, res, next);
        expect(lecturDao.setLectureRegister).toHaveBeenCalled();
    })
});

describe(`lectureController setLecturesRegister Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.setLecturesRegister = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        lecture = new LectureController(lecturDao);
    })

    it(`setLecturesRegister is class`, () => {
        expect(typeof lecture.setLecturesRegister).toBe("function");
    })

    it(`should call setLecturesRegister`, async () => {
        const req = httpMocks.createRequest();
        req.body  = [
            {
                "category": 1,
                "title": "Introduction to Programming",
                "description": "This is a beginner level course on programming.",
                "lecturer_id": 101,
                "price": 50
            },
            {
                "category": 2,
                "title": "Advanced Data Structures",
                "description": "This course covers advanced data structures in depth.",
                "lecturer_id": 102,
                "price": 75
            },
            {
                "category": 3,
                "title": "Web Development Bootcamp",
                "description": "Learn full stack web development from scratch.",
                "lecturer_id": 103,
                "price": 100
            }
        ]

        await lecture.setLecturesRegister(req, res, next);
        expect(lecturDao.setLecturesRegister).toHaveBeenCalled();
    })
});

describe(`lectureController setLectureResister Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.lecturerUpdate = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        // lecture = Container.get('lectureController'); //
        lecture = new LectureController(lecturDao);
    })

    it(`setLectureResister is class`, () => {
        expect(typeof lecture.setLectureEdit).toBe("function");
    })

    it(`should call setLectureRegister`, async () => {
        const req = httpMocks.createRequest();
        req.body = {
            lecturer_id : 1,
            title: "HI Python",
            description: "Pyhon Stater",
            price: 500
        }
        await lecture.setLectureEdit(req, res, next);
        expect(lecturDao.lecturerUpdate).toHaveBeenCalled();
    })
});

describe(`lectureController setLectureEdit Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.lecturerUpdate = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        // lecture = Container.get('lectureController'); //
        lecture = new LectureController(lecturDao);
    })

    it(`setLectureEdit is class`, () => {
        expect(typeof lecture.setLectureEdit).toBe("function");
    })

    it(`should call lecturerUpdate`, async () => {
        const req = httpMocks.createRequest();
        req.body = {
            lecturer_id : 1,
            title: "HI Python",
            description: "Pyhon Stater",
            price: 500
        }
        await lecture.setLectureEdit(req, res, next);
        expect(lecturDao.lecturerUpdate).toHaveBeenCalled();
    })
});

describe(`lectureController setLectureOpen Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.setOpenLectures = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        // lecture = Container.get('lectureController'); //
        lecture = new LectureController(lecturDao);
    })

    it(`setLectureOpen is class`, () => {
        expect(typeof lecture.setLectureOpen).toBe("function");
    })

    it(`should call setOpenLectures`, async () => {
        const req = httpMocks.createRequest();
        req.query = {
            lecture_id : '1'
        }
        await lecture.setLectureOpen(req, res, next);
        expect(lecturDao.setOpenLectures).toHaveBeenCalled();
    })
});

describe(`lectureController setLectureDelete Test`, () => {
    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;
    let lecturDao: UserDaoImpl;

    let res : any, next : any
    beforeEach(()=>{
        // req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    })

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        lecturDao = new UserDaoImpl(repository) as jest.Mocked<UserDaoImpl>
        lecturDao.lecturerDelete = jest.fn()
        Container.set('Repository', repository);
        Container.set('lecturDao', lecturDao);
        // lecture = Container.get('lectureController'); //
        lecture = new LectureController(lecturDao);
    })

    it(`setLectureDelete is class`, () => {
        expect(typeof lecture.setLectureDelete).toBe("function");
    })

    it(`should call lecturerDelete`, async () => {
        const req = httpMocks.createRequest();
        req.query = {
            lecture_id : '1'
        }
        await lecture.setLectureDelete(req, res, next);
        expect(lecturDao.lecturerDelete).toHaveBeenCalled();
    })
});