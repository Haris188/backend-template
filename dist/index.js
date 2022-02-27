"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const AppSetup_1 = require("./AppSetup");
const Authentication_1 = require("./Authentication");
const AuthedApi_1 = require("./Authentication/AuthedApi");
const Authentication_2 = require("./Authentication");
const TaskMonitor_1 = require("./TaskMonitor");
const AuthedApi_2 = require("./TaskMonitor/AuthedApi");
dotenv.config();
let count = 1;
const app = express();
app.use((req, res, next) => {
    console.log(`served ${count} requests`);
    count++;
    next();
});
(0, AppSetup_1.default)(app);
(0, Authentication_1.default)(app);
(0, TaskMonitor_1.default)(app);
(0, Authentication_2.authBoundary)(app);
(0, AuthedApi_2.default)(app);
(0, AuthedApi_1.default)(app);
app.listen((process.env.PORT || 4000), () => {
    console.log('SERVER: running at ' + (process.env.PORT || 4000));
});
