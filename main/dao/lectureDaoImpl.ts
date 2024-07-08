import {Container, Inject, Service} from "typedi";
import "reflect-metadata";

import MysqlRepository from "../repository/MySQLrepository"
import {
    LectureResisterImpl, LectureRegister,
    LectureRegisterDetailsImpl, LectureRegisterDetails, LectureDetails, LectureDetailsImpl
} from "../model/lecture";
import { RowDataPacket } from "mysql2";

// 테이터 접근용 DTO
interface LectureResisterRow extends RowDataPacket, LectureResisterImpl {}
interface LectureRegisterDetailsRow extends RowDataPacket, LectureRegisterDetailsImpl {}
interface LectureDetailsRow extends RowDataPacket, LectureDetailsImpl {}
interface LectureRow extends RowDataPacket {
    register_count: number;
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

@Service('lectureDao')
export class UserDaoImpl{

    constructor(@Inject('Repository') private repository: MysqlRepository) {
        this.repository = repository;
    }

    async getLecturer(lecturerId: number) {
        let connection = await this.repository.getConnetion();
        try {
            let query = `SELECT lecturer_id, lecturer_name FROM lecturer WHERE lecturer_id = ?`
            let params = [lecturerId]

            let [rows] = await connection.query(query, params);
            return (rows) ? { message: "find lecturer" } : null;

        } catch(error) {
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async getStudentLectureList(student: string){
        let connection = await this.repository.getConnetion();
        try {
           let params: any[] = []
           let baseQuery = 'SELECT lecture_id FROM lecture_registration_details WHERE nickname = ?';
           params.push(`${student}`);

            let [rows] = await connection.query<RowDataPacket[]>(baseQuery, params);
            return rows.map(row => row.lecture_id);

        } catch(error) {
            const e = error as Error;
        throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    // 수강생 수를 가져오는 함수
    async getLectureRegisterCount(lectureId: Number){
        let connection = await this.repository.getConnetion();
        try{
            let query = `SELECT register_count FROM lecture_register_view_6nd WHERE lecture_id = ?`;
            const params = [];
            params.push(Number(lectureId));

            let [rows]= await connection.query<LectureRow[]>(query, params)

            return rows[0]?.register_count ?? 0

        } catch(error) {
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    // 수강생 리스트를 가져오는 함수
    async getLectureRegisterList(lectureId: Number){
        let connection = await this.repository.getConnetion();
        try{
            let query = `SELECT nickname, register_date  FROM lecture_registration_details WHERE lecture_id = ?`;
            const params = [];
            params.push(Number(lectureId));

            let [rows]= await connection.query<LectureRegisterDetailsRow[]>(query, params)
            return rows.map(row => new LectureRegisterDetails(row.nickname, row.register_date))

        } catch(error) {
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async getLectureList(
        instructor: string | null, course: string | null,
        student: string | null, category: number | null,
        orderBy: string | null, page: number,
        limit: number,
    )  {
        // return new Promise((resolve, reject) => {
            let connection = await this.repository.getConnetion();
            try{

                // let table = student ? "lecture_register_view_6nd" : "lecture"
                let query = `SELECT * FROM lecture_register_view_6nd WHERE access_modifier = 1`;
                const params = [];

                // 학생 파라미터가 있는 경우 등록한 강의 리스트를 가져와 검색 조건에 추가
                if (student) {
                   let lecture_id = await this.getStudentLectureList(student)

                    query += ` AND lecture_id IN (${lecture_id.map(()=>'?').join(', ')})`;
                    params.push(...lecture_id);
                }

                if (instructor) {
                    const instructorModify = instructor.replace(",", ' ');
                    console.log(instructorModify);
                    query += " AND lecturer_name LIKE ?";
                    params.push(`%${instructorModify}%`);
                }

                if (course) {
                    query += " AND title LIKE ?";
                    params.push(`%${course}%`);
                }

                // 0 default 값이 아니라면 카테고리 검색 진행
                if (category != 0) {
                    query += ' AND category = ?';
                    params.push(Number(category));
                }

                // 마지막으로 정렬 및
                query +=  ` ORDER BY register_date ${orderBy} LIMIT ${limit} OFFSET ${page * limit}`;

                let [rows] = await connection.query<LectureResisterRow[]>(query, params)
                console.log(rows)
                return rows.map(row =>
                    new LectureRegister(
                        row.lecture_id, row.title, row.category, row.lecture_register_date, row.lecturer_name,
                        row.price, row.register_count
                    )
                )

            } catch (error){
                const e = error as Error;
                throw new Error(e.message);
            } finally {
                if (connection) connection.release();
            }
    }

    async getLectureDetails(lectureTitle: string){
        let connection = await this.repository.getConnetion();
        try{
            // 강의 기본 정보를 가져옴
            let query = `SELECT * FROM lecture_register_view WHERE title LIKE ?`;
            const params = [];
            params.push(`${lectureTitle}`);

            let [rows] = await connection.query<RowDataPacket[]>(query, params)
            const lectureDetail: LectureDetails = new LectureDetails(
                rows[0].lecturer_id ,rows[0].title, rows[0].details, rows[0].category, rows[0].price, rows[0].register_date, rows[0].modified_date)

            const lectureId: number = rows[0].lecturer_id;

            //수강생 수 가져오기
            lectureDetail.registerCount = await this.getLectureRegisterCount(lectureId);

            //수강생 목록 배열로 받기
            lectureDetail.student_list = await this.getLectureRegisterList(lectureId);

            return lectureDetail
        } catch(error){
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async setLectureRegister(lectureInfo: lectureRegisterInfo ){
        let connection = await this.repository.getConnetion();
        try{
            // 트랜잭션 시작
            await connection.beginTransaction();

            // 강의 정보 추가
            let query = `insert into lecture (category, title, description, lecturer_id, price) VALUES ( ?, ?, ?, ?, ?)`;
            const params = [lectureInfo.category, lectureInfo.title, lectureInfo.description, lectureInfo.lecturer_id, lectureInfo.price];
            let [result] = await connection.query(query, params)

            await connection.commit();
            return result
        } catch(error){
            if (connection) await connection.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async setLecturesRegister(lecturesInfo: lectureRegisterInfo[] ){
        let connection = await this.repository.getConnetion();
        try{
            // 트랜잭션 시작
            await connection.beginTransaction();
            const insertPromise = lecturesInfo.map(async lectureInfo => {
                // 강의 정보 추가
                let query = `insert into lecture (category, title, description, lecturer_id, price) VALUES ( ?, ?, ?, ?, ?)`;
                const params = [lectureInfo.category, lectureInfo.title, lectureInfo.description, lectureInfo.lecturer_id, lectureInfo.price];
                let [result] = await connection.execute(query, params)
                return result
            })

            await Promise.all (insertPromise);
            await connection.commit();

            return { message: 'Lectures created successfully.'}
        } catch(error){
            if (connection) await connection.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async lecturerUpdate(lectureInfo: lectureEditParams){
        let connection = await this.repository.getConnetion();
        try{
            // 트랜잭션 시작
            await connection.beginTransaction();

            // 기존 정보를 가져옴
            let query = `SELECT * FROM lecture_register_view WHERE title LIKE ?`;
            const params = [];
            params.push(`${lectureInfo}`);

            let [rows] = await connection.query<RowDataPacket[]>(query, params)

            query = `UPDATE lecture SET `

            if(!lectureInfo.title){
                query += " title = ?,";
                params.push(lectureInfo.title);
            }

            if(!lectureInfo.description){
                query += " description = ?,";
                params.push(lectureInfo.description);
            }

            if(!lectureInfo.price){
                query += " price = ?,";
                params.push(lectureInfo.price);
            }

            // 강의 식별자를 통한 검색 필요
            query += `WHERE lecture_id =  ${lectureInfo.lecturer_id}`

            await connection.query(query, params)
            await connection.commit();
            return { message: 'Lecture Updated successfully.' }
        } catch(error){
            if (connection) await connection.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    // 강의 오픈
    async setOpenLectures(lectureId: number){
        let connection = await this.repository.getConnetion();
        try{
            // 트랜잭션 시작
            await connection.beginTransaction();

            // 강의 정보 추가
            let query = `UPDATE lecture SET access_modifier = 1 WHERE lecture_id = ?`;
            const params = [lectureId];
            let [result] = await connection.query(query, params)

            await connection.commit();
            return { message: 'Lecture Update Open successfully.' }
        } catch(error){
            if (connection) await connection.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    async lecturerDelete(lectureId: number){
        let connection = await this.repository.getConnetion();
        try{
            // 트랜잭션 시작
            await connection.beginTransaction();

            // 강의 정보 추가
            let query = `DELETE FROM lecture WHERE lecture_id = ?`;
            const params = [lectureId];
            let [result] = await connection.query(query, params)

            await connection.commit();
            return { message: 'Lecture DELETE successfully.' }
        } catch(error){
            if (connection) await connection.rollback();
            const e = error as Error;
            throw new Error(e.message);
        } finally {
            if (connection) connection.release();
        }
    }

    // deleteUser(id) {
    //     return new Promise((resolve, reject) => {
    //         const query = "DELETE FROM users WHERE id = ?";
    //         this.db.run(query, [id], function(err) {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(this.changes);
    //             }
    //         });
    //     });
    // }
}
