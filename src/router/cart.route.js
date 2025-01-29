const Router = require("koa-router");
const CartsController = require("../controller/carts.controller");

const router = new Router();

router.put("/api/carts/:userId", CartsController.update);
router.get("/api/carts/:userId", CartsController.get);
router.post("/api/carts/pay/:userId", CartsController.pay);

module.exports = router;
