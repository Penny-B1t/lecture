import express, { Express, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { StudentController } from "../controller/studentController"; // 경로를 적절히 조정하세요

const router = express.Router();
const studentController = Container.get(StudentController);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/register', (req: Request, res: Response, next: NextFunction) => { studentController.registerStudent(req, res, next)});
router.delete('/quit', (req: Request, res: Response, next: NextFunction) => { studentController.deleteStudent(req, res, next)});
router.post('/register', (req: Request, res: Response, next: NextFunction) => { studentController.lecturerRegister(req, res, next)})

export default router;