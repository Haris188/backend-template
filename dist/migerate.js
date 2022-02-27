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
const knex_1 = require("knex");
const dotenv = require("dotenv");
dotenv.config();
let con = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
};
let pg = (0, knex_1.default)({
    client: 'mysql',
    connection: Object.assign({}, con)
});
const dataTypes = {
    string: 'string',
    increments: 'increments',
    timestamp: 'timestamp',
    integer: 'integer'
};
const tables = [
    {
        name: 'users',
        columns: {
            id: { type: dataTypes.increments, },
            first_name: { type: dataTypes.string, nullable: false },
            last_name: { type: dataTypes.string, nullable: false },
            email: { type: dataTypes.string, nullable: false },
            password: { type: dataTypes.string, nullable: false }
        }
    }
];
function migerate() {
    return __awaiter(this, void 0, void 0, function* () {
        pg.destroy();
        con.database = process.env.DB;
        pg = (0, knex_1.default)({ client: 'pg', connection: con });
        tables.forEach(table => {
            pg.schema.hasTable(table.name).then((exists) => __awaiter(this, void 0, void 0, function* () {
                if (exists) {
                    console.log('table exists');
                }
                else {
                    yield pg.schema.createTable(table.name, (t) => {
                        for (const col in table.columns) {
                            const columnData = table.columns[col];
                            const columnCreated = t[columnData.type](col);
                            if (!columnData.nullable)
                                columnCreated.notNullable();
                        }
                    });
                }
            }));
        });
        // pg.schema.hasTable('users').then(async function(exists) {
        //     if (!exists) {
        //         const tableName = 'users'
        //         await pg.schema.createTable(tableName, function (table) {
        //             pg.schema.hasColumn(tableName,'id').then(colExists=>colExists && table.increments('id'))
        //             pg.schema.hasColumn(tableName,'first_name').then(colExists=>colExists && table.increments('first_name'))
        //             pg.schema.hasColumn(tableName,'last_name').then(colExists=>colExists && table.increments('last_name'))
        //             pg.schema.hasColumn(tableName,'email').then(colExists=>colExists && table.increments('email'))
        //             pg.schema.hasColumn(tableName,'password').then(colExists=>colExists && table.increments('password'))
        //             // table.increments('id')
        //             // table.string('first_name').notNullable()
        //             // table.string('last_name').notNullable()
        //             // table.string('email').notNullable()
        //             // table.string('password').notNullable()
        //         }).then((value)=>{
        //             console.log('-users created')
        //         })
        //     }
        //   });
        yield pg.destroy();
    });
}
migerate();
// pg.raw(`CREATE DATABASE ${process.env.DB}`).then(async function () {
//     pg.destroy();
//     con.database = process.env.DB;
//     pg = knex({ client: 'pg', connection: con });
//     tables.forEach(table=>{
//         pg.schema.hasTable(table.name).then (async (exists)=>{
//             if(exists){
//                 console.log('table exists')
//             }
//             else{
//                 await pg.schema.createTable(table.name, (t)=>{
//                     for(const col in table.columns){
//                         const columnData = table.columns[col]
//                         const columnCreated = t[columnData.type](col)
//                         if(!columnData.nullable) 
//                             columnCreated.notNullable()
//                     }
//                 })
//             }
//         })
//     })
//     // pg.schema.hasTable('users').then(async function(exists) {
//     //     if (!exists) {
//     //         const tableName = 'users'
//     //         await pg.schema.createTable(tableName, function (table) {
//     //             pg.schema.hasColumn(tableName,'id').then(colExists=>colExists && table.increments('id'))
//     //             pg.schema.hasColumn(tableName,'first_name').then(colExists=>colExists && table.increments('first_name'))
//     //             pg.schema.hasColumn(tableName,'last_name').then(colExists=>colExists && table.increments('last_name'))
//     //             pg.schema.hasColumn(tableName,'email').then(colExists=>colExists && table.increments('email'))
//     //             pg.schema.hasColumn(tableName,'password').then(colExists=>colExists && table.increments('password'))
//     //             // table.increments('id')
//     //             // table.string('first_name').notNullable()
//     //             // table.string('last_name').notNullable()
//     //             // table.string('email').notNullable()
//     //             // table.string('password').notNullable()
//     //         }).then((value)=>{
//     //             console.log('-users created')
//     //         })
//     //     }
//     //   });
//     await pg.destroy()
// });
