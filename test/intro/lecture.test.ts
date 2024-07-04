import httpMocks from "node-mocks-http";
import { Container } from "typedi";
import "reflect-metadata";

import { LectureController } from "../../main/controller/lectureController"
import { MysqlRepository } from "../../main/repository/MySQLrepository"
import { Student } from "../../main/model/student";

jest.mock("../../main/repository/MySQLrepository")

let req: any, res : any, next : any
beforeEach(()=>{
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})


describe(`lectureController getLectureList Test`, () => {

    let repository : jest.Mocked<MysqlRepository>;
    let lecture: LectureController;

    beforeEach(() => {
        repository = new MysqlRepository() as jest.Mocked<MysqlRepository>;
        repository. executeQuery<Student> = jest.fn()
        Container.set('Repository', repository);
        lecture = Container.get('lectureController');
    })

    it(`lecturesController is class`, ()=>{
        expect(typeof lecture.getLectureList).toBe("function");
        expect(lecture).toBeInstanceOf(LectureController);
    })

    it(`should call getLectureList`, async () => {
        await lecture.getLectureList(req, res, next);
        expect(repository.executeQuery).toHaveBeenCalled();
    })

    it(`should call getLectureList with invalid Query`, async () => {

    })
})