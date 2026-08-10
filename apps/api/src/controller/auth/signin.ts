import type { Request, Response } from "express";

import type { SignInInput } from "@repo/schemas";
import { sendApiResponse } from "../../utils/apiResponse";
import { prismaSingleton } from "@repo/db/config";

export const siginController = async function (req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as SignInInput;

  const user = await prismaSingleton.user.findFirst({ where: { email } });

  if (user == null) {
    sendApiResponse(res, 400, "User not found");
    return;
  }
  if (user.password !== password) {
    sendApiResponse(res, 400, "Invalid password");
    return;
  }
  sendApiResponse(res, 201, "Login successfully", { email });
};
