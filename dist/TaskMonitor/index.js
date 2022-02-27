"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.get('/working', (req, res) => {
        res.status(200).send('yes');
    });
};
