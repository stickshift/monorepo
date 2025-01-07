import express, { Request, Response } from 'express';
import { randomString } from 'package-a';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello world - ' + randomString() });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
