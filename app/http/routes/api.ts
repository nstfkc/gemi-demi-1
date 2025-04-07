import { ApiRouter } from "gemi/http";
import { OrderController } from "../controllers/OrderController";

class PrivateRouter extends ApiRouter {
  middlewares = ["auth", "cache:private"];
  routes = {
    "/order": this.get(OrderController, "list"),
    "/order/:orderId": this.get(OrderController, "show"),
  };
}

export default class extends ApiRouter {
  middlewares = ["cache:private"];

  routes = {
    "/": PrivateRouter,
  };
}
