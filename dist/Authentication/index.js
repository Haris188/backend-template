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
exports.authBoundary = void 0;
const passport = require("passport");
const passportJwt = require("passport-jwt");
const passportLocal = require("passport-local");
const bcrypt = require("bcrypt");
const model = require("./Model");
const jwt = require("jsonwebtoken");
const ExtractJwt = passportJwt.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
exports.default = (app) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, cb) => {
        return model.getUserWithEmail(email)
            .then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (!user)
                return cb(null, false, { message: "Incorrect email" });
            if (!(yield bcrypt.compare(password, user.password)))
                return cb(null, false, { message: "Incorrect password" });
            return cb(null, user, { message: 'Logged in successfully' });
        }))
            .catch(e => {
            return cb(e);
        });
    }));
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayload, cb) => {
        return model.getUserWithId(jwtPayload.id)
            .then(user => {
            return cb(null, user);
        })
            .catch(err => {
            return cb(err);
        });
    }));
    app.post('/login', (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user || user.error) {
                console.log(err);
                return res.status(400).json({
                    data: {
                        message: info ? info.message : "Login failed",
                        user
                    }
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err)
                    res.send(err);
                const userRes = user;
                delete userRes.password;
                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ data: { user, token } });
            });
        })(req, res, next);
    });
    app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body)
            res.status(400).send({ error: 'Provided user info is invalid' });
        const userData = req.body;
        userData.password = yield bcrypt.hash(userData.password, 10);
        const response = yield model.insertUser(userData);
        if (!response) {
            res.status(403).send({ message: 'User registeration failed' });
            return;
        }
        if (response.userExists) {
            res.status(403).send({ message: 'User Already exists' });
            return;
        }
        res.status(200).send({ data: response });
    }));
};
const authBoundary = (app) => {
    app.use(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        if (req.user) {
            next();
        }
        else {
            req.status(403).send({ error: 'You are not logged in' });
        }
    });
};
exports.authBoundary = authBoundary;
