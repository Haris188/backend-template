import * as model from './Model'

interface TaskType {
    id?: number
    start_time?: string
    end_time?: string
    name?: string
    description?: string
    user_id?: string
}

export default (app) => {
    app.post('/add_task', async (req, res) => {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' })
            return
        }

        const taskData = req.body
        taskData.user_id = req.user.id

        const result = await model.insertTask(taskData)

        if (!result) {
            res.status(400).send({ message: 'An error occured while inserting task' })
        }
        res.status(200).send({ data: result })
    })

    app.post('/task_list', async (req, res) => {
        const queryData: TaskType = { user_id: req.user.id }

        queryData.start_time = req.body.start_time || new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
        queryData.end_time = req.body.end_time || new Date(new Date().setHours(23, 59, 59, 999)).toISOString()

        const taskList = await model.getAllTasksForUser(queryData)

        if (!taskList) {
            res.status(400).send({ message: 'Error occured while retrieving tasks' })
        }
        res.status(200).send({ data: taskList })
    })

    app.post('/add_interval', async (req, res) => {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' })
            return
        }

        const result = await model.insertInterval(req.body)

        if (!result) {
            res.status(400).send({ message: 'An error occured while inserting interval' })
        }
        res.status(200).send({ data: result })
    })

    app.post('/add_last_interval', async (req, res) => {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' })
            return
        }

        const result = await model.insertInterval(req.body)

        if (!result) {
            res.status(400).send({ message: 'An error occured while inserting interval' })
        }

        await model.completeTask()
        res.status(200).send({ data: result })
    })

    app.get('/monthly_report', async (req, res) => {
        const intervals = {
            start_time: new Date(new Date().setDate(1)).toISOString(),
            end_time: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
        }

        const timeReport = await model.getTasksReportForInterval(intervals)

        res.status(200).send({data: timeReport})
    })
}