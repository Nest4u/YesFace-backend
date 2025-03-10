/**
 * cart controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const entity = await strapi.db.query('api::cart.cart').findOne({
        where: { id: id },
        populate: ['user']
      });

      if (!entity) {
        return ctx.notFound('Cart not found');
      }

      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to find cart');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const entity = await strapi.db.query('api::cart.cart').update({
        where: { id: id },
        data: data
      });

      if (!entity) {
        return ctx.notFound('Cart not found');
      }

      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to update cart');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      
      // Проверяем существование корзины
      const cartExists = await strapi.db.query('api::cart.cart').findOne({
        where: { id: id }
      });

      if (!cartExists) {
        return ctx.notFound('Cart not found');
      }

      // Удаляем корзину
      await strapi.db.query('api::cart.cart').delete({
        where: { id: id }
      });

      // Возвращаем 200 вместо 204 для подтверждения
      return ctx.send({
        message: 'Cart deleted successfully'
      }, 200);
    } catch (error) {
      console.error('Delete cart error:', error);
      return ctx.badRequest('Failed to delete cart');
    }
  }
}));
