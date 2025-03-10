/**
 * product service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::product.product', ({ strapi }) => ({
  async findOneWithDetails(id) {
    return await strapi.db.query('api::product.product').findOne({
      where: { id },
      populate: ['*']
    });
  }
}));
