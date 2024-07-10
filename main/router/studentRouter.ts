import express, { Express, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { StudentController } from "../controller/studentController"; // 경로를 적절히 조정하세요


const router = express.Router();
const studentController = Container.get(StudentController);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/register/:id',studentController.validatorStudent);

router.post('/', (req: Request, res: Response, next: NextFunction) => { studentController.registerStudent(req, res, next)});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => { studentController.deleteStudent(req, res, next)});
router.post('/register/:id', (req: Request, res: Response, next: NextFunction) => { studentController.lecturerRegister(req, res, next)})

export default router;