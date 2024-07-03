import { Request, Response, NextFunction } from "express";


class LectureController {
    constructor() {
    }

    getLectureList =  async (req : Request, res : Response, next : NextFunction) => {
        try {
            const { instructor, lecture, student} = req.query;

            let query = `SELECT * FROM lecture WHERE student=${student}`;
            let params = [];

        }catch(err){

        }
    }
}