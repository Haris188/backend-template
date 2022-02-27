"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestInterval = exports.updateTask = exports.getTasksReportForInterval = exports.completeTask = exports.insertInterval = exports.getAllPendingTasksForUser = exports.insertTask = void 0;
const Db_1 = require("../Db");
const insertTask = (taskData) => __awaiter(void 0, void 0, void 0, function* () {
    const inserted = yield (0, Db_1.default)('tasks').insert(taskData, ['id'])
        .catch(e => {
        console.log(e);
        return null;
    });
    return (inserted && inserted.length) > 0 ? inserted[0] : null;
});
exports.insertTask = insertTask;
const getAllPendingTasksForUser = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Db_1.default.select('*')
        .from('tasks')
        .where('user_id', queryData.user_id)
        // .andWhere('start_time', '>', queryData.start_time)
        // .andWhere('end_time', '<', queryData.end_time)
        .andWhere('status', '<>', 'completed')
        .andWhere('status', '<>', 'deleted')
        .orderBy('start_time', 'asc')
        .catch(e => {
        console.log(e);
        return null;
    });
    return tasks;
});
exports.getAllPendingTasksForUser = getAllPendingTasksForUser;
const insertInterval = (intervalData) => __awaiter(void 0, void 0, void 0, function* () {
    const inserted = yield (0, Db_1.default)('intervals').insert(intervalData, ['id'])
        .catch(e => {
        console.log(e);
        return null;
    });
    return (inserted && inserted.length) > 0 ? inserted[0] : null;
});
exports.insertInterval = insertInterval;
const completeTask = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Db_1.default)('tasks')
        .update('completed', true);
});
exports.completeTask = completeTask;
const getTasksReportForInterval = (interval) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Db_1.default.raw('SELECT SUM(t.end_time - t.start_time) as total_promised, SUM(i.end_time - i.start_time) as total_worked' +
        ' FROM tasks t' +
        ' JOIN intervals i on t.id = i.task_id' +
        " WHERE t.start_time > '" + interval.start_time + "' AND " + "t.end_time < '" + interval.end_time + "'")
        .catch(e => {
        console.log(e);
        return null;
    });
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
});
exports.getTasksReportForInterval = getTasksReportForInterval;
const updateTask = (where, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield (0, Db_1.default)('tasks').update(data, ['id']).where(where)
        .catch(e => {
        console.log(e);
        return null;
    });
    return updated;
});
exports.updateTask = updateTask;
const getLatestInterval = (task_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Db_1.default.select('*')
        .from('intervals')
        .where('task_id', task_id)
        .orderBy('id', 'desc')
        .limit(1)
        .catch(e => {
        console.log(e);
        return null;
    });
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
});
exports.getLatestInterval = getLatestInterval;
