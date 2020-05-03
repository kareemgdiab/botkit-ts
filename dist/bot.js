"use strict";
//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This is the main file for the botkit test bot.
// Import Botkit's core features
var botkit_1 = require("botkit");
var botkit_plugin_cms_1 = require("botkit-plugin-cms");
var botbuilder_adapter_web_1 = require("botbuilder-adapter-web");
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
// Import a platform-specific adapter for botframework.
var botbuilder_storage_mongodb_1 = require("botbuilder-storage-mongodb");
// Load process.env values from .env file
var dotenv_1 = require("dotenv");
dotenv_1.config();
var storage, mongoStorage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new botbuilder_storage_mongodb_1.MongoDbStorage({
        url: process.env.MONGO_URI,
    });
}
var adapter = new botbuilder_adapter_web_1.WebAdapter();
var controller = new botkit_1.Botkit({
    webhook_uri: "/api/messages",
    adapter: adapter,
    storage: storage,
});
if (process.env.CMS_URI) {
    controller.usePlugin(new botkit_plugin_cms_1.BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN || "",
    }));
}
// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(function () {
    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + "/features", [".ts"]);
    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on("message,direct_message", function (bot, message) { return __awaiter(void 0, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = false;
                        return [4 /*yield*/, controller.plugins.cms.testTrigger(bot, message)];
                    case 1:
                        results = _a.sent();
                        if (results !== false) {
                            // do not continue middleware!
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
});
controller.webserver.use(express_1.default.static(path_1.default.join(__dirname, "client")));
controller.webserver.set("view engine", "ejs");
