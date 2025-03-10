/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      // Получаем продукт с фото
      const entity = await strapi.entityService.findOne('api::product.product', id, {
        populate: {
          Photo: true, // Важно: используем точное имя поля как в схеме
        },
      });

      if (!entity) {
        return ctx.notFound('Product not found');
      }

      // Трансформируем ответ в нужный формат
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      return ctx.badRequest('Failed to find product');
    }
  }
}));
