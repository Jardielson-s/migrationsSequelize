const { Router } = require('express');
const controller = require('./controllers/Controllers');
const routes = Router();


routes.post("/create",controller.store);
routes.get("/loadAll",controller.load);
routes.get("/loadOne/:id",controller.loadOne);
routes.post("/update/:id",controller.update);
routes.get("/destroy/:id",controller.destroy);


module.exports = routes;