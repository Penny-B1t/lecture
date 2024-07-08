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
        expect(student).toBeInstanceOf(MysqlRepository);
        expect(studentDao).toBeInstanceOf(MysqlRepository);
        expect(typeof student.registerStudent).toBe("function");
        expect(student).toBeInstanceOf(StudentController);
    })

    it(``, async () => {
        // req.query.instructor = 'test';
        await student.registerStudent(req, res, next);
        expect(studentDao.setStudentRegister).toHaveBeenCalled();
    })
})