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
const model = require("./Model");
exports.default = (app) => {
    app.post('/add_task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        const taskData = req.body;
        taskData.user_id = req.user.id;
        const result = yield model.insertTask(taskData);
        if (!result) {
            res.status(400).send({ message: 'An error occured while inserting task' });
        }
        res.status(200).send({ data: result });
    }));
    app.post('/task_list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const queryData = { user_id: req.user.id };
        queryData.start_time = req.body.start_time || new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        queryData.end_time = req.body.end_time || new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
        const taskList = yield model.getAllPendingTasksForUser(queryData);
        if (!taskList) {
            res.status(400).send({ message: 'Error occured while retrieving tasks' });
        }
        res.status(200).send({ data: taskList });
    }));
    app.post('/add_interval', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        const result = yield model.insertInterval(req.body);
        if (!result) {
            res.status(400).send({ message: 'An error occured while inserting interval' });
        }
        res.status(200).send({ data: result });
    }));
    app.post('/add_last_interval', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        const result = yield model.insertInterval(req.body);
        if (!result) {
            res.status(400).send({ message: 'An error occured while inserting interval' });
        }
        yield model.completeTask();
        res.status(200).send({ data: result });
    }));
    app.get('/monthly_report', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const intervals = {
            start_time: new Date(new Date().setDate(1)).toISOString(),
            end_time: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
        };
        const timeReport = yield model.getTasksReportForInterval(intervals);
        res.status(200).send({ data: timeReport });
    }));
    app.post('/task_status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        const result = yield model.updateTask({ id: req.body.task_id }, { status: req.body.status });
        if (!result) {
            res.status(400).send({ message: 'An error occured while updating Task' });
        }
        res.status(200).send({ data: result });
    }));
    app.post('/pause_task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        yield model.updateTask({ id: req.body.task_id }, { status: 'paused' });
        const result = yield model.insertInterval({
            task_id: req.body.task_id,
            start_time: req.body.start_time,
            end_time: req.body.end_time
        });
        res.status(200).send({ data: result });
    }));
    app.post('/complete_task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        yield model.updateTask({ id: req.body.task_id }, { status: 'completed' });
        const result = yield model.insertInterval({
            task_id: req.body.task_id,
            start_time: req.body.start_time,
            end_time: req.body.end_time
        });
        res.status(200).send({ data: result });
    }));
    app.post('/delete_task/:task_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { task_id } = req.params;
        const data = yield model.updateTask({ id: task_id }, { status: 'deleted' });
        res.status(200).send({ data });
    }));
    app.post('/get_latest_interval', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send({ message: 'No data Provided' });
            return;
        }
        const result = yield model.getLatestInterval(req.body.task_id);
        res.status(200).send({ data: result });
    }));
};
