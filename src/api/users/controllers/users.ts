export default {
  findAll: async (ctx, next) => {
    try {
      const { page, pageSize } = ctx.query?.pagination || {
        pageSize: null,
        offset: null,
        page: null,
      };
      const offset = page * pageSize - pageSize;
      const limit = pageSize;

      const data = await strapi.db
        .query('plugin::users-permissions.user')
        .findMany({ offset, limit });

      const total = await strapi.db
        .query('plugin::users-permissions.user')
        .count({});

      const pageCount = pageSize ? Math.ceil(total / pageSize) : 1;

      ctx.body = {
        data,
        meta: {
          pagination: {
            page: Number(page) || 1,
            pageSize: Number(pageSize) || total,
            pageCount,
            total,
          },
        },
      };
    } catch (err) {
      ctx.body = err;
    }
  },
};
