import express, { Express, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { LectureController } from "../controller/lectureController"; // 경로를 적절히 조정하세요

const router = express.Router();
const lectureController = Container.get(LectureController);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 강의 도메인 공통 로직
// router.use(lectureController.validationLecturer)

router.get('/', (req: Request, res: Response, next: NextFunction) => lectureController.getLectureList(req, res, next));
router.get('/details', (req: Request, res: Response, next: NextFunction) => lectureController.getLectureDetail(req, res, next));
router.post('/register', (req: Request, res: Response, next: NextFunction) => lectureController.setLectureResister(req, res, next));
router.post('/registers', (req: Request, res: Response, next: NextFunction) => lectureController.setLecturesRegister(req, res, next));
router.put('/update', (req: Request, res: Response, next: NextFunction) => {lectureController.setLectureEdit(req, res, next)});
router.put('/open', (req: Request, res: Response, next: NextFunction) => {lectureController.setLectureOpen(req, res, next)});
router.delete('/delete', (req: Request, res: Response, next: NextFunction) => {lectureController.setLectureDelete(req, res, next)});

export default router;