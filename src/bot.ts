//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the botkit test bot.

// Import Botkit's core features
import { Botkit, BotWorker } from "botkit";
import { BotkitCMSHelper } from "botkit-plugin-cms";
import { WebAdapter } from "botbuilder-adapter-web";

import express from "express";
import path from "path";

// Import a platform-specific adapter for botframework.

import { MongoDbStorage } from "botbuilder-storage-mongodb";

// Load process.env values from .env file
import { config } from 'dotenv';
config();

let storage,
    mongoStorage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url: process.env.MONGO_URI,
    });
}

const adapter = new WebAdapter();

const controller = new Botkit({
    webhook_uri: "/api/messages",

    adapter,

    storage,
});

if (process.env.CMS_URI) {
    controller.usePlugin(
        new BotkitCMSHelper({
            uri: process.env.CMS_URI,
            token: process.env.CMS_TOKEN || "",
        })
    );
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + "/features", [".ts"]);

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on(
            "message,direct_message",
            async (bot: BotWorker, message: any) => {
                let results = false;
                results = await controller.plugins.cms.testTrigger(
                    bot,
                    message
                );

                if (results !== false) {
                    // do not continue middleware!
                    return false;
                }
            }
        );
    }
});

controller.webserver.use(express.static(path.join(__dirname, "client")));
controller.webserver.set("view engine", "ejs");
