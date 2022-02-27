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
}