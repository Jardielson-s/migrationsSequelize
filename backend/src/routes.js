require('dotenv').config();
const { Router } = require('express');
const controller = require('./controllers/Controllers');
const Authorization = require('./controllers/Authorization');
const routes = Router();


routes.post("/create",controller.store);
routes.get("/loadAll",Authorization.authenticate,controller.load);
routes.get("/loadOne/:id",Authorization.authenticate,controller.loadOne);
routes.post("/update/:id",Authorization.authenticate,controller.update);
routes.get("/destroy/:id",Authorization.authenticate,controller.destroy);
routes.get("/sarch",Authorization.authenticate,controller.sarch);
routes.post("/createPeople",controller.storePeople);


module.exports = routes;