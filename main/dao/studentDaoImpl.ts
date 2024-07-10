import { Inject, Service} from "typedi";
import "reflect-metadata";

import MysqlRepository from "../repository/MySQLrepository"
import { Student, LectureRegist, LectureRegisterArray } from "../model/student"

@Service('studentDao')
export class StudentDaoImpl {
    constructor(@Inject('Repository') private repository: MysqlRepository) {
        this.repository = repository;
    }

    async validateStudent(studentId: number) {
        let connection = await this.repository.getConnetion();
        try {
            let query = `SELECT EXISTS (
                SELECT 1 FROM student WHERE student_id = ?
            ) AS student;`;
            let params = [Number(studentId)]

            const [result] : any = await connection.query(query, params);

            return result.length > 0 && result[0].student === 1;
        } catch (error) {
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async getLecturer(lecture_id: number) {
        let con = await this.repository.getConnetion ();
        try {
            // 서브쿼리를 사용하여 강의 정보 접근 가능 여부 확인
            let query = `
            SELECT EXISTS (
                SELECT 1
                FROM lecture
                WHERE lecture_id = ? AND access_modifier = 0
            ) AS access_allowed;
        `;
            let params = [Number(lecture_id)];

            const [rows]: any = await con.query(query, params);

            // 검색된 결과가 있는지 여부에 따라 true 또는 false 반환
            return rows.length > 0 && rows[0].access_allowed === 0;
        } catch (error) {
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (con) con.release();
        }
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

    async setLectureRegister(lectures: LectureRegisterArray){
        let con =  await this.repository.getConnetion ();
        try {
            await con.beginTransaction();

            let message: { message: string }[] =[];

            const lecturesInfo = lectures.lecturesInfo
            const lecturesResister = lecturesInfo.map(async lectureInfo=> {
                const access  = await this.getLecturer(lectureInfo.lecture_id);
                if (access){
                    let query = `insert into lecturer_register (student_id, lecture_id) VALUES ( ?, ? )`;
                    const params = [Number(lectures.studentId), Number(lectureInfo.lecture_id)];
                    let [result] = await con.query(query, params)
                    message.push({ message: `Student Registered successfully. ${lectureInfo.lecture_id}` })
                    return result
                } else {
                    message.push({ message: `A course you re already taking. ${lectureInfo.lecture_id}` })
                }
            })

            await Promise.all (lecturesResister)
            await con.commit()

            return message
        } catch(error) {
            await con.rollback();
            const e = error as Error;
            if (e.message.includes('Duplicate entry')) return { message: 'Student Duplicate Failed.' };
            throw new Error(e.message);
        } finally {
            if (con) con.release();
        }
    }
}