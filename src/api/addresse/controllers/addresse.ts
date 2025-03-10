/**
 * addresse controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::addresse.addresse', ({ strapi }) => ({
  async find(ctx) {
    try {
      const { user } = ctx.state;
      
      // Изменяем запрос для получения уникальных адресов
      const addresses = await strapi.entityService.findMany('api::addresse.addresse', {
        filters: {
          user: {
            id: user.id
          }
        },
        populate: {
          user: {
            fields: ['id']
          }
        }
      });

      const sanitizedResults = await this.sanitizeOutput(addresses, ctx);
      return { data: sanitizedResults };
    } catch (error) {
      console.error('Find addresses error:', error);
      return ctx.badRequest('Failed to fetch addresses');
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;

      const entity = await strapi.db.query('api::addresse.addresse').findOne({
        where: { 
          id: id,
        },
        populate: ['user'],
      });

      if (!entity) {
        return ctx.notFound('Address not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return { data: sanitizedEntity };
    } catch (error) {
      return ctx.badRequest('Failed to find address');
    }
  },

  async findByUser(ctx) {
    try {
      const { user } = ctx.state;
      const { id } = user;

      // Проверяем существование адреса для пользователя
      const existingAddress = await strapi.db.query('api::addresse.addresse').findOne({
        where: { 
          user: id 
        },
        populate: ['user']
      });

      if (!existingAddress) {
        return { data: null, exists: false };
      }

      const sanitizedEntity = await this.sanitizeOutput(existingAddress, ctx);
      return { 
        data: sanitizedEntity, 
        exists: true 
      };
    } catch (error) {
      return ctx.badRequest('Failed to check address existence');
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const { user } = ctx.state;

      // Проверяем, существует ли уже адрес с таким documentId
      const existingAddress = await strapi.entityService.findMany('api::addresse.addresse', {
        filters: {
          documentId: data.documentId,
          user: {
            id: user.id
          }
        }
      });

      if (existingAddress.length > 0) {
        return ctx.badRequest('Address with this document ID already exists');
      }

      // Если это адрес по умолчанию, сбрасываем другие адреса
      if (data.isDefault) {
        await strapi.db.query('api::addresse.addresse').updateMany({
          where: { user: user.id },
          data: { isDefault: false }
        });
      }

      const entity = await strapi.entityService.create('api::addresse.addresse', {
        data: {
          ...data,
          user: user.id,
          publishedAt: new Date()
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return { data: sanitizedEntity };
    } catch (error) {
      console.error('Create address error:', error);
      return ctx.badRequest('Failed to create address');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      const { data } = ctx.request.body;

      // Проверяем, принадлежит ли адрес пользователю
      const address = await strapi.db.query('api::addresse.addresse').findOne({
        where: { 
          id: id,
          user: user.id 
        }
      });

      if (!address) {
        return ctx.notFound('Address not found or access denied');
      }

      const entity = await strapi.db.query('api::addresse.addresse').update({
        where: { id },
        data: data,
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return { data: sanitizedEntity };
    } catch (error) {
      return ctx.badRequest('Failed to update address');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;

      // Проверяем, принадлежит ли адрес пользователю
      const address = await strapi.db.query('api::addresse.addresse').findOne({
        where: { id, user: user.id }
      });

      if (!address) {
        return ctx.notFound('Address not found or access denied');
      }

      const entity = await strapi.entityService.delete('api::addresse.addresse', id);
      return { data: entity };
    } catch (error) {
      return ctx.badRequest('Failed to delete address');
    }
  }
}));
