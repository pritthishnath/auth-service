/**
 * @route POST /login
 */

import { Router } from "express";
import { UserModel } from "../models/User";
import { comparePassword, generateToken } from "../utils";
import { TokenDataType } from "../types/types";

const router = Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: true, message: "Invalid credentials!" });
    }

    const pswMatch = comparePassword(password, user.password);

    if (!pswMatch) {
      return res
        .status(403)
        .json({ error: true, message: "Invalid credentials!" });
    }

    const tokenData: TokenDataType = {
      userId: user._id,
      username: user.username,
    };

    const [accessToken, refreshToken] = generateToken(tokenData);

    user.refreshToken.push(refreshToken);

    await user.save();

    res.status(200).json({ error: false, user, accessToken, refreshToken });
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
