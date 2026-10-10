"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const kakebo_1 = __importDefault(require("./routes/kakebo"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
console.log('Environment: ', process.env.ENVIRONMENT);
console.log(process.env.GREETING_MESSAGE);
//the encoding of the request (post) Contet-Type: application/json
// Middleware 
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Routes principali
app.use('/', kakebo_1.default);
/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
});
app.listen(port, () => console.log(`Server in ascolto: http://localhost:${port}/`));
