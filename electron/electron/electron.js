"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
electron_1.app.on("ready", () => {
    mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"), // compiled preload
        },
    });
    mainWindow.loadURL("http://localhost:3000"); // Next.js dev server
});
//# sourceMappingURL=electron.js.map