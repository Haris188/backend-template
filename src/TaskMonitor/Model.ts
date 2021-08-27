import Db from '../Db'

export const insertTask = async (taskData)=>{
    const inserted = await Db('tasks').insert(taskData, ['id'])
        .catch(e=>{
            console.log(e)
            return null
        })
    return (inserted && inserted.length) > 0 ? inserted[0] : null
}

export const getAllTasksForUser = async (queryData)=>{
    const tasks = await Db.select('*')
    .from('tasks')
    .where('user_id', queryData.user_id)
    .andWhere('start_time', '>', queryData.start_time)
    .andWhere('end_time', '<', queryData.end_time)
    .orderBy('start_time', 'desc')
        .catch(e=>{
            console.log(e)
            return null
        })
    
    return tasks
}

export const insertInterval = async (intervalData)=>{
    const inserted = await Db('intervals').insert(intervalData, ['id'])
        .catch(e=>{
            console.log(e)
            return null
        })
    return (inserted && inserted.length) > 0 ? inserted[0] : null
}

export const completeTask = async ()=>{
    await Db('tasks')
    .update('completed', true)
}

export const getTasksReportForInterval = async (interval)=>{
    const result = await Db.raw(
        'SELECT SUM(t.end_time - t.start_time) as total_promised, SUM(i.end_time - i.start_time) as total_worked' +
        ' FROM tasks t' +
        ' JOIN intervals i on t.id = i.task_id' +
        " WHERE t.start_time > '" + interval.start_time + "' AND " + "t.end_time < '" + interval.end_time +"'"
        )
        .catch(e=>{
            console.log(e)
            return null
        })

    return result.rows && result.rows.length > 0 ? result.rows[0] : null
}