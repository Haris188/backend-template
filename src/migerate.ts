import knex from 'knex'
import {ConnectionType} from './Db'
import * as dotenv from 'dotenv'

dotenv.config()

let con: ConnectionType = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
}

let pg = knex({
    client: 'mysql',
    connection: {...con}
});

const dataTypes = {
    string: 'string',
    increments: 'increments',
    timestamp:'timestamp',
    integer:'integer'
}

const tables = [
    {
        name: 'users',
        columns: {
            id: {type: dataTypes.increments,},
            first_name: {type: dataTypes.string, nullable: false},
            last_name: {type: dataTypes.string, nullable: false},
            email: {type: dataTypes.string, nullable: false},
            password: {type: dataTypes.string, nullable: false}
        }
    }
]

async function migerate(){
    pg.destroy();

    con.database = process.env.DB;
    
    pg = knex({ client: 'pg', connection: con });

    tables.forEach(table=>{
        pg.schema.hasTable(table.name).then (async (exists)=>{
            if(exists){
                console.log('table exists')
            }
            else{
                await pg.schema.createTable(table.name, (t)=>{
                    for(const col in table.columns){
                        const columnData = table.columns[col]
                        const columnCreated = t[columnData.type](col)
                        if(!columnData.nullable) 
                            columnCreated.notNullable()
                    }
                })
            }
        })
    })

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

    await pg.destroy()
}

migerate()

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