import express from 'express';
import router from './router.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`App listening on port ${port}.`)
})
