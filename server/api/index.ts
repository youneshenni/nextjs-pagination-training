import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const apiRouter = Router();
const prisma = new PrismaClient();

apiRouter.get("/", async (req, res) => {
  const { page, rpp } = req.query;
  const data = await prisma.user.findMany({
    take: parseInt(rpp as string, 10),
    skip: parseInt(page as string, 10) * parseInt(rpp as string, 10),
  });
  res.json(data);
});

export default apiRouter;
