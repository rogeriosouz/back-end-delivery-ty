import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prismaClient/prismaClient';

class CategoryController {
  async read(req: Request, res: Response) {
    try {
      const category = await prisma.category.findMany({
        include: {
          product: true,
        },
      });

      return res.status(202).json(category);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    const { name } = req.body;

    try {
      if (!name) {
        return res.status(401).json({ Error: 'Error invalid data' });
      }

      const isCategory = await prisma.category.findMany({ where: { name } });

      if (isCategory) {
        return res.status(401).json({ Error: 'Error invalid data' });
      }

      const category = await prisma.category.create({ data: { name } });

      return res.status(202).json({ category });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;
    try {
      const schema = z.object({
        id: z.string(),
        name: z.string(),
      });

      if (!schema.parse({ name })) {
        return res.status(404).json({ error: 'Error invalid data' });
      }

      const category = await prisma.category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return res.status(200).json(category);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (!id) {
        return res.status(404).json({ error: 'Error invalid data' });
      }

      await prisma.category.delete({
        where: { id },
      });

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }
}

export default new CategoryController();
