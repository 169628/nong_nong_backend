const Router = require("koa-router");
const StoresController = require("../controller/sotres.controller");
const AdvertiseController = require("../controller/advertise.controller");
const StocksController = require("../controller/stocks.controller");

const router = new Router();

router.get("/api/service/create", StoresController.create);
router.post("/api/service/create", StocksController.create);
//router.get("/users/:id", UsersController.findOne);

module.exports = router;
