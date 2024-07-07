import express, { Express, Request, Response } from 'express';
import lectureRouter from "./router/searchRouter";
import container from './container/container';

const app: Express = express();
const port = 5000;


app.get('/', (req: Request, res: Response) => {
  res.send('Typescript + Node.js + Express Server');
});

app.use('/lectures', lectureRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`);
});