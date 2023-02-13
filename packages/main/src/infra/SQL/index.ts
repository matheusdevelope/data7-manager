// // import {
// //   ConnectionSqlServer,
// //   ConnectionSybase,
// //   Database,
// // } from "repository-data7";

// export interface DBConnectionOptions {
//   database: "MSSQL" | "SYBASE";
//   dbname: string;
//   host: string;
//   port: number;
//   user: string;
//   pass: string;
// }

// export interface RDBMS {
//   open: (options: DBConnectionOptions) => boolean;
//   close: () => boolean;
//   select: <T>(query: string) => T;
//   execute: <T>(query: string) => T;
// }

// //   const config = {
// //     user: "dba",
// //     password: "sql",
// //     dbname: "Turatti",
// //     host: "127.0.0.1",
// //     port: 2639,
// //   };

// //   const connectionSqlServer = new ConnectionSybase(config);
// //   const db = new Database(connectionSqlServer);

// //   const command = `
// //     INSERT INTO TESTE (ID, Descricao) VALUES (1, 'TESTE')

// //   `;

// //   db.query(command).then((result) => {
// //     console.log(result);
// //   });

// export default class SQL_DB {
//   private DB: RDBMS | null = null;
//   constructor(private options: DBConnectionOptions) {
//     if (!this.options.database) throw Error("The RDBMS is empty");
//     if (!this.options.dbname) throw Error("The database Name is empty");
//     if (!this.options.host) throw Error("The database Host is empty");
//     if (!this.options.port) throw Error("The database Port is empty");
//     if (!this.options.user) throw Error("The database User is empty");
//     if (!this.options.pass) throw Error("The database Pass is empty");

//     if (this.options.database === "MSSQL") {
//       // this.DB =
//     }
//   }

//   public open() {}
//   public close() {}
//   public select<T>(query: string): T {
//     const ret = [
//       {
//         data: "data",
//       },
//     ];
//     return ret as T;
//   }
//   public execute<T>(query: string): T {
//     const ret = {
//       data: "data",
//     };
//     return ret as T;
//   }
// }

export default {};
