import express, { Express, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { LectureController } from "../controller/lectureController"; // 경로를 적절히 조정하세요

const router = express.Router();
const lectureController = Container.get(LectureController);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));