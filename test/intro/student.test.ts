import httpMocks from "node-mocks-http";
import { Container } from "typedi";
import "reflect-metadata";

import { StudentController } from "../../main/controller/studentController"
import MysqlRepository from "../../main/repository/MySQLrepository"
import { StudentDaoImpl } from "../../main/dao/studentDaoImpl"
import {LectureController} from "../../main/controller/lectureController";

jest.mock("../../main/repository/MySQLrepository")
jest.mock("../../main/dao/lectureDaoImpl")

describe(`lectureController getLectureList Test`, () => {

    let repository: jest.Mocked<MysqlRepository>;
    let student: StudentController;
    let studentDao: StudentDaoImpl;

    let req: any, res: any, next: any
    beforeEach (() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse ();
        next = jest.fn ();
    })

    beforeEach (() => {
        repository = new MysqlRepository () as jest.Mocked<MysqlRepository>;
        studentDao = new StudentDaoImpl (repository) as jest.Mocked<StudentDaoImpl>
        studentDao.setStudentRegister = jest.fn ()
        Container.set ('Repository', repository);
        Container.set ('studentDao', studentDao);
        student = new StudentController (studentDao);
    })

    it(``, () => {
        expect(typeof student.registerStudent).toBe("function");
        expect(student).toBeInstanceOf(StudentController);
    })

    it(``, async () => {
        // req.query.instructor = 'test';
        
        req.query = {
            nickname: 'Python',
            email: 'king@gmail.com'
        }
        await student.registerStudent(req, res, next);
        
        
        expect(studentDao.setStudentRegister).toHaveBeenCalled();
    })
})

describe(`lectureController deleteStudent Test`, () => {

    let repository: jest.Mocked<MysqlRepository>;
    let student: StudentController;
    let studentDao: StudentDaoImpl;

    let req: any, res: any, next: any
    beforeEach (() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse ();
        next = jest.fn ();
    })

    beforeEach (() => {
        repository = new MysqlRepository () as jest.Mocked<MysqlRepository>;
        studentDao = new StudentDaoImpl (repository) as jest.Mocked<StudentDaoImpl>
        studentDao.StudentDelete = jest.fn ()
        Container.set ('Repository', repository);
        Container.set ('studentDao', studentDao);
        student = new StudentController (studentDao);
    })

    it(``, () => {
        expect(typeof student.deleteStudent).toBe("function");
        expect(student).toBeInstanceOf(StudentController);
    })

    it(``, async () => {
        // req.query.instructor = 'test';
        await student.deleteStudent(req, res, next);
        expect(studentDao.StudentDelete).toHaveBeenCalled();
    })
})

describe(`lectureController deleteStudent Test`, () => {

    let repository: jest.Mocked<MysqlRepository>;
    let student: StudentController;
    let studentDao: StudentDaoImpl;

    let req: any, res: any, next: any
    beforeEach (() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse ();
        next = jest.fn ();
    })

    beforeEach (() => {
        repository = new MysqlRepository () as jest.Mocked<MysqlRepository>;
        studentDao = new StudentDaoImpl (repository) as jest.Mocked<StudentDaoImpl>
        studentDao.setLectureRegister = jest.fn ()
        Container.set ('Repository', repository);
        Container.set ('studentDao', studentDao);
        student = new StudentController (studentDao);
    })

    it(``, () => {
        expect(typeof student.lecturerRegister).toBe("function");
        expect(student).toBeInstanceOf(StudentController);
    })

    it('should register a lecture when valid data is provided', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/student/register/1',
            params: { id: '1' },
            body: [{ lecture_id: 1 }]
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await student.lecturerRegister(req, res, next);
        expect(res.statusCode).toBe(200);
    });
})