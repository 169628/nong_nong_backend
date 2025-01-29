const Router = require("koa-router");
const ProductsController = require("../controller/products.controller");

const router = new Router();

//router.post("/api/products", ProductsController.create);
router.get("/api/products", ProductsController.get);
router.get("/api/products/one/:id", ProductsController.getOne);

module.exports = router;
