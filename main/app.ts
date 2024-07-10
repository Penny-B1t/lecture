import express, { Express, Request, Response } from 'express';
import lectureRouter from "./router/searchRouter";
import studentRouter from "./router/studentRouter"
import path from "path";
require("dotenv").config({ path : path.join(__dirname, ".env") });

const app: Express = express();
const port = process.env.PORT;


app.get('/', (req: Request, res: Response) => {
  res.send('Typescript + Node.js + Express Server');
});

app.use('/lectures', lectureRouter)
app.use('/student', studentRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`);
});