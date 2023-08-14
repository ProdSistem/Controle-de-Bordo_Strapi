
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::board-register.board-register', ({ strapi }) =>  ({
  // Method 1: Creating an entirely custom action
  async exampleAction(ctx) {
    try {
        strapi.query('api::board-register.board-register').count({where: ctx.query})
        ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  // Method 2: Wrapping a core action (leaves core logic in place)
  /*async find(ctx) {
    // some custom logic here
    ctx.query = { ...ctx.query, local: 'en' }

    // Calling the default core action
    const { data, meta } = await super.find(ctx);

    // some more custom logic
    meta.date = Date.now()

    return { data, meta };
  },

  // Method 3: Replacing a core action with proper sanitization
  async find(ctx) {
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    const { results, pagination } = await strapi.service('api::restaurant.restaurant').find(sanitizedQueryParams);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  }*/
}));