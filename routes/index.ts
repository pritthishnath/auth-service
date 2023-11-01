import { Router } from "express";
import registerController from "./register";
import loginController from "./login";
import refreshController from "./refresh";

const router = Router();

router.use("/register", registerController);
router.use("/login", loginController);
router.use("/refresh", refreshController);

router.get("/test", (req, res) => {
  res.send("Auth Service Running");
});

export default router;
