import { prisma } from "@/app/database/prisma";
import { Controller, type HttpRequest } from "gemi/http";

export class OrderController extends Controller {
  async list() {
    return await prisma.order.findMany();
  }

  async show(req: HttpRequest) {
    const { orderId } = req.params;

    return await prisma.order.findUnique({
      where: { publicId: orderId },
      include: {
        createdyBy: { omit: { password: true } },
        product: {
          include: {
            categories: true,
            images: { include: { image: true } },
          },
        },
      },
    });
  }
}
