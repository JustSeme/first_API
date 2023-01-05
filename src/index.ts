import express, { Response } from 'express'
import { CourseViewModel } from './models/CourseViewModel'
import { CreateCourseModel } from './models/CreateCourseModel'
import { QueryCoursesModel } from './models/QueryCoursesModel'
import { UpdateCourseModel } from './models/UpdateCourseModel'
import { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'

export const app = express()
const port = 3000
const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
}

type CourseType = {
    id: number
    title: string
    studentsCount: number
}

const db: { courses: CourseType[] } = {
    courses: [
        { id: 1, title: 'front-end', studentsCount: 10},
        { id: 2, title: 'back-end', studentsCount: 20 },
        { id: 3, title: 'fullstack', studentsCount: 9 },
        { id: 4, title: 'dev-ops', studentsCount: 12 }
    ]
}

const getCourseViewModel = (dbCourse: CourseType) => ({
    id: dbCourse.id,
    title: dbCourse.title
})

app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>,
                    res: Response<CourseViewModel[]>) => {
    const foundCourses = req.query.title ? db.courses
        .filter(c => c.title.indexOf(req.query.title) > -1)
        : db.courses

    res.json(foundCourses.map(getCourseViewModel))
})

app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                        res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id)

    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(getCourseViewModel(foundCourse))
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>, 
                    res: Response<CourseViewModel>) => {
    if(req.body.title.length < 3) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    }
    db.courses.push(createdCourse)

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getCourseViewModel(createdCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    let dbLength = db.courses.length
    db.courses = db.courses.filter(course => course.id !== +req.params.id)

    if(dbLength === db.courses.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
                        res: Response<CourseViewModel>) => {
    if(req.body.title.length < 3) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    let foundCourse = db.courses.find(course => course.id === +req.params.id)

    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    foundCourse.title = req.body.title

    res.json(getCourseViewModel(foundCourse))
})

app.delete('/courses', (req, res) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})