import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::addresse.addresse', ({ strapi }) => ({
  async findOneByUser(id, userId) {
    return await strapi.db.query('api::addresse.addresse').findOne({
      where: { 
        id,
        user: userId 
      },
      populate: ['user'],
    });
  },
}));
