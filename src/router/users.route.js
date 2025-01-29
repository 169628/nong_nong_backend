//Users Route: File

const Router = require("koa-router");
const UsersController = require("../controller/users.controller");

const router = new Router();

router.post("/api/users/register", UsersController.register);
router.post("/api/users/login", UsersController.login);
router.get("/api/users/check", UsersController.check);

module.exports = router;
