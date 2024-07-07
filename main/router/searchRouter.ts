import express, { Express, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { LectureController } from "../controller/lectureController"; // 경로를 적절히 조정하세요

const router = express.Router();
const lectureController = Container.get(LectureController);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', (req: Request, res: Response, next: NextFunction) => lectureController.getLectureList(req, res, next));
router.get('/details', (req: Request, res: Response, next: NextFunction) => lectureController.getLectureDetail(req, res, next));
router.post('/register', (req: Request, res: Response, next: NextFunction) => lectureController.setLectureResister(req, res, next));
router.post('/registers', (req: Request, res: Response, next: NextFunction) => lectureController.setLecturesRegister(req, res, next))

export default router;