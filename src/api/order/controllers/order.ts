/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({strapi}) => ({
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const entity = await strapi.db.query('api::order.order').update({
        where: { id: id },
        data: {
          orderStatus: data.orderStatus
        }
      });

      if (!entity) {
        return ctx.notFound('Order not found');
      }

      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to update order status');
    }
  }
}));
