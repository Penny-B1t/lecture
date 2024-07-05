import { Request, Response, NextFunction } from "express";
import {Container, Inject, Service} from "typedi";
import "reflect-metadata";

import { MysqlRepository } from "../repository/MySQLrepository"
import { Student } from "../model/student";
import { RowDataPacket } from "mysql2";

interface StudentRow extends RowDataPacket {

}

@Service('lecturDao')
export class UserDaoImpl{

    constructor(@Inject('Repository') private repository: MysqlRepository) {
        this.repository = repository;
    }

    //
    async getLectureList(instructor: string | null, course: string | null, student: string | null, category: number | null) {
        // return new Promise((resolve, reject) => {
            let connection = await this.repository.getConnetion();
            try{

                let query = "SELECT * FROM students WHERE 1=1";
                const params = [];

                if (instructor) {
                    query += " AND instructor_name LIKE ?";
                    params.push(`%${instructor}%`);
                }

                if (course) {
                    query += " AND course_name LIKE ?";
                    params.push(`%${course}%`);
                }

                if (student) {
                    query += ' AND student_identifier LIKE ?';
                    params.push(`%${student}%`);
                }

                if (category) {
                    query += ' AND category = ?';
                    params.push(category);
                }

                let [rows] = await connection.query<StudentRow[]>(query, params)
                return rows.map(row => {
                    
                })

            } catch (error){
                const e = error as Error;
                throw new Error(e.message);
            } finally {
                if (connection) connection.release();
            }
            const query = "INSERT INTO users (name, email) VALUES (?, ?)";
    }

    // async getLecture

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
