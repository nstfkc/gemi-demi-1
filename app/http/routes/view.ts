import { type HttpRequest, ViewRouter } from "gemi/http";
import { HomeController } from "../controllers/HomeController";
import { OrderController } from "../controllers/OrderController";

class AuthViewRouter extends ViewRouter {
  routes = {
    "/sign-in": this.view("auth/SignIn"),
    "/sign-up": this.view("auth/SignUp"),
    "/reset-password": this.view("auth/ResetPassword"),
    "/forgot-password": this.view("auth/ForgotPassword"),
  };
}

class AppRouter extends ViewRouter {
  middlewares = ["auth", "cache:private"];
  routes = {
    "/": this.layout("AppLayout", {
      "/dashboard": this.view("Dashboard"),
      "/orders": this.view("OrdersList", () => {
        
      }),
      "/products": this.view("Dashboard"),
      "/categories": this.view("Dashboard"),
    }),
  };
}

export default class extends ViewRouter {
  middlewares = ["cache:public,12840,must-revalidate"];

  override routes = {
    "/": this.layout("PublicLayout", {
      "/": this.view("Home"),
      "/about": this.view("About", () => {
        return { title: "About" };
      }),
      "/pricing": this.view("Pricing", (req: HttpRequest) => {
        const referralCode = req.search.get("referral-code");
        return { title: "Pricing" };
      }),
    }),
    "/auth": AuthViewRouter,
    "(app)/": AppRouter,
  };
}
