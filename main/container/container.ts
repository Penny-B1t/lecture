import { Container } from "typedi";
import "reflect-metadata";
import setting from "../config/config"; // 설정 파일의 경로를 적절히 조정하세요
import MySQLRepository from "../repository/MySQLrepository"; // 경로를 적절히 조정하세요

Container.set("setting", setting);
Container.set("Repository", new MySQLRepository());

export default Container;
