import knex from "knex";
import { ConnectionType } from "./Db";
import * as dotenv from "dotenv";

dotenv.config();

let con: ConnectionType = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
};

// let mysql = knex({
//     client: 'mysql',
//     connection: {...con}
// });

const dataTypes = {
  string: "string",
  increments: "increments",
  timestamp: "timestamp",
  integer: "integer",
};

const sqlDataTypes = {
  string: (size=null) => size?`VARCHAR(${size})`: 'VARCHAR'
}

const tables = [
  {
    name: "users",
    columns: {
      id: { type: dataTypes.increments },
      first_name: { type: dataTypes.string, nullable: false },
      last_name: { type: dataTypes.string, nullable: false },
      email: { type: dataTypes.string, nullable: false },
      password: { type: dataTypes.string, nullable: false },
    },
  },
];

async function migerate() {
  const mysql = knex({ client: "mysql", connection: con });

  tables.forEach((table, index) => {
    mysql.schema.hasTable(table.name).then(async (exists) => {
      console.log('current table:', table.name)
      if (exists) {
        for (const col in table.columns) {
          mysql.schema.hasColumn(table.name, col).then(async (colExists) => {
            if (!colExists) {
              const columnData = table.columns[col];
              await mysql.raw(`ALTER TABLE ${process.env.DB}.${table.name} ADD COLUMN ${col} ${sqlDataTypes[columnData.type](columnData.typeSize)}`)
              console.log('column added:', col)
            }
          })
        }
      }
      else {
        await mysql.schema.createTable(table.name, (t) => {
          for (const col in table.columns) {
            const columnData = table.columns[col];
            let columnCreated

            if(columnData.typeSize){
              columnCreated = t[columnData.type](col, columnData.typeSize);
            }
            else{
              columnCreated = t[columnData.type](col);
            }

            if (!columnData.nullable) columnCreated.notNullable();
            console.log('column created:', col)
          }
        });
      }
    });
  });
}

migerate();


