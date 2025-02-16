// Main Server File

const Koa = require("koa");
require("dotenv").config();
const bodyParser = require("koa-parser");
const cors = require("@koa/cors");

// apis
const users = require("./src/router/users.route");
const products = require("./src/router/product.route");
const carts = require("./src/router/cart.route");

// Creating Koa Application Instance
const app = new Koa();
const PORT = process.env.NODE_ENV == "dev" ? 3000 : process.env.PORT;

// Parsing Body : middleware
app.use(bodyParser());
app.use(cors());

// Adding All Routes to App instance
app.use(users.routes());
app.use(products.routes());
app.use(carts.routes());

// Error Event Handler
app.on("error", (error) => {
  throw error;
});

// Listening Incoming Request on PORT
app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
