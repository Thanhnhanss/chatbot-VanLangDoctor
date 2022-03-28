import express from "express";

import chatbotController from '../controllers/chatbotController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", chatbotController.getHomepage);

    //setup get started button whitelisted domain
    router.post('/setup-profile', chatbotController.setupProfile);

    //setup presistent menu
    router.post('/setup-presistent-menu', chatbotController.setupPresistentMenu);

    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);

    router.get("/book_table", chatbotController.handleBookTable);
    router.post("/reserve-table-ajax", chatbotController.handlePostBookTable);



    return app.use("/", router);
};

module.exports = initWebRoutes;