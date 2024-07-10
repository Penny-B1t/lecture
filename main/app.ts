import express, { Express, Request, Response } from 'express';
import lectureRouter from "./router/searchRouter";
import studentRouter from "./router/studentRouter"
import dotenv from 'dotenv'

dotenv.config();

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