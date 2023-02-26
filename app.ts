import express, { Request, Response } from 'express';

const app = express();

app.use(express.static('client'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});