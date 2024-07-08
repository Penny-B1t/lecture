import { Inject, Service} from "typedi";
import "reflect-metadata";

import MysqlRepository from "../repository/MySQLrepository"
import { RowDataPacket } from "mysql2";
import { Student, LectureRegister } from "../model/student"
import { PoolConnection } from "mysql2/promise";

@Service('studentDao')
export class StudentDaoImpl {
    constructor(@Inject('Repository') private repository: MysqlRepository) {
        this.repository = repository;
    }

    async setStudentRegister(studentInfo: Student){
        let con =  await this.repository.getConnetion ();
        try {
            await con.beginTransaction();
            let query = `INSERT INTO student(email, nickname) VALUES (?,?)`;
            let params = [studentInfo.nickname, studentInfo.nickname];

            const result = await con.execute(query, params)
            await con.commit()
            return (result) ? { message: 'Student Registered successfully.' } : null;
        } catch(error) {
            await con.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (con) con.release();
        }
    }

    async StudentDelete(StudentId: number){
        let con =  await this.repository.getConnetion ();
        try {
            await con.beginTransaction();
            let query = `DELETE FROM student WHERE student_id = ?`;
            let params = [StudentId];

            const result = await con.execute(query, params)
            await con.commit()
            return (result) ? { message: 'Student DELETE successfully.' } : null;
        } catch(error) {
            await con.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (con) con.release();
        }
    }

    async setLectureRegister(lecturesInfo: LectureRegister[]){
        let con =  await this.repository.getConnetion ();
        try {
            await con.beginTransaction();

            const lecturesResister = lecturesInfo.map(async lectureInfo=> {
                let query = `insert into lecturer_register (student_id, lecture_id) VALUES ( ?, ?)`;
                const params = [lectureInfo.studentId, lectureInfo.studentId];
                let [result] = await con.execute(query, params)
                return result
            })

            await Promise.all (lecturesResister)
            await con.commit()

            return { message: 'Lecture Registered successfully.' }
        } catch(error) {
            await con.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (con) con.release();
        }
    }
}