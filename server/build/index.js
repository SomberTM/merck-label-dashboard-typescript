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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const samples_1 = __importDefault(require("./routes/samples"));
const teams_1 = __importDefault(require("./routes/teams"));
const teams_fields_1 = __importDefault(require("./routes/teams_fields"));
const teams_labels_1 = __importDefault(require("./routes/teams_labels"));
const printers_1 = __importDefault(require("./routes/printers"));
const samples_2 = require("./controllers/samples");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = 7777;
        app.use(body_parser_1.default.json({ limit: '50mb' }));
        app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
        app.use((0, cors_1.default)());
        // ----------------------------------------------
        // NEW ROUTES :>)
        app.use('/samples', samples_1.default);
        app.get('/deleted_samples', samples_2.getDeletedSamples);
        app.use('/fields', teams_fields_1.default);
        app.use('/labels', teams_labels_1.default);
        app.use('/teams', teams_1.default);
        app.use('/printers', printers_1.default);
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        db_1.default.$disconnect();
    });
})();
