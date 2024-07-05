import httpMocks from "node-mocks-http";
import { Container } from "typedi";
import "reflect-metadata";

import { LectureController } from "../../main/controller/lectureController"
import { MysqlRepository } from "../../main/repository/MySQLrepository"
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
        lecture = Container.get('lectureController');
    })

    it(`lecturesController is class`, ()=>{
        expect(typeof lecture.getLectureList).toBe("function");
        expect(lecture).toBeInstanceOf(LectureController);
    })

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

    it(`should call getLectureList with invalid Query`, async () => {

    })
})