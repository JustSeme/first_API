"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleWare = express_1.default.json();
app.use(jsonBodyMiddleWare);
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
};
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'fullstack' },
        { id: 4, title: 'dev-ops' }
    ]
};
app.get('/courses', (req, res) => {
    const foundCourses = req.query.title ? db.courses
        .filter(c => c.title.indexOf(req.query.title) > -1)
        : db.courses;
    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCourses = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourses) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourses);
});
app.post('/courses', (req, res) => {
    if (req.body.title.length < 3) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201)
        .json(createdCourse);
});
app.delete('/courses/:id', (req, res) => {
    let dbLength = db.courses.length;
    db.courses = db.courses.filter(course => course.id !== +req.params.id);
    if (dbLength === db.courses.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req, res) => {
    if (req.body.title.length < 3) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    let foundCourses = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourses) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourses.title = req.body.title;
    res.json(foundCourses);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
