"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
dotenv_1.default.config();
const conn = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
conn.getConnection()
    .then((connection) => {
    console.log("Database connesso con successo!");
    connection.release();
})
    .catch((err) => {
    console.error("Errore di connessione al database:", err.message);
    console.log("Hai acceso MAMP?");
});
exports.default = conn;
