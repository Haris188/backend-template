"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
exports.default = (app) => {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(cors({
        credentials: true,
        origin: true
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
};
