"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleWare = express_1.default.json();
exports.app.use(jsonBodyMiddleWare);
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
};
const db = {
    courses: [
        { id: 1, title: 'front-end', studentsCount: 10 },
        { id: 2, title: 'back-end', studentsCount: 20 },
        { id: 3, title: 'fullstack', studentsCount: 9 },
        { id: 4, title: 'dev-ops', studentsCount: 12 }
    ]
};
const getCourseViewModel = (dbCourse) => ({
    id: dbCourse.id,
    title: dbCourse.title
});
exports.app.get('/', (req, res) => {
    res.send('Hello Samurai!');
});
exports.app.get('/courses', (req, res) => {
    const foundCourses = req.query.title ? db.courses
        .filter(c => c.title.indexOf(req.query.title) > -1)
        : db.courses;
    res.json(foundCourses.map(getCourseViewModel));
});
exports.app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(getCourseViewModel(foundCourse));
});
exports.app.post('/courses', (req, res) => {
    if (req.body.title.length < 3) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    };
    db.courses.push(createdCourse);
    res.status(exports.HTTP_STATUSES.CREATED_201)
        .json(getCourseViewModel(createdCourse));
});
exports.app.delete('/courses/:id', (req, res) => {
    let dbLength = db.courses.length;
    db.courses = db.courses.filter(course => course.id !== +req.params.id);
    if (dbLength === db.courses.length) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put('/courses/:id', (req, res) => {
    if (req.body.title.length < 3) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    let foundCourse = db.courses.find(course => course.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.json(getCourseViewModel(foundCourse));
});
exports.app.delete('/courses', (req, res) => {
    db.courses = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
