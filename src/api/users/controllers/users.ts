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
      const { name, cpf, id, active } = ctx.query;
      let data = '';
      let total = 1;

      if (name || cpf || id || active) {
        data = await strapi.entityService.findMany(
          'plugin::users-permissions.user',
          {
            filters: {
              name: {
                $containsi: name ? name : '',
              },
              cpf: {
                $containsi: cpf ? cpf : '',
              },
              id: {
                $containsi: id ? id : '',
              },
              status: {
                $containsi: active ? active : '',
              },
            },
            offset,
            limit,
            populate: '*',
          },
        );

        total = await strapi.db.query('plugin::users-permissions.user').count({
          filters: {
            name: {
              $containsi: name ? name : '',
            },
            cpf: {
              $containsi: cpf ? cpf : '',
            },
            id: {
              $containsi: id ? id : '',
            },
            status: {
              $containsi: active ? active : '',
            },
          },
        });
      } else {
        data = await strapi.entityService.findMany(
          'plugin::users-permissions.user',
          { offset, limit },
        );

        total = await strapi.db
          .query('plugin::users-permissions.user')
          .count({});
      }

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
