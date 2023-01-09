export default {
  findAll: async (ctx, next) => {
    try {
      const { page, pageSize } = ctx.query?.pagination || {
        pageSize: null,
        page: null,
      };
      const { name, cpf, id, active } = ctx.query;

      const start = page * pageSize - pageSize;
      const limit = pageSize;

      let users = [];
      let total = 1;

      if (name || cpf || id || active) {
        users = await strapi.entityService.findMany(
          'plugin::users-permissions.user',
          {
            start,
            limit,
            populate: '*',
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
        users = await strapi.entityService.findMany(
          'plugin::users-permissions.user',
          { start, limit, populate: '*' },
        );
        total = await strapi.db
          .query('plugin::users-permissions.user')
          .count({});
      }

      const pageCount = pageSize ? Math.ceil(total / pageSize) : 1;

      const data = [];
      await users.map((user, key) => {
        data[key] = {
          id: user.id,
          username: user.username,
          email: user.email,
          confirmed: user.confirmed,
          blocked: user.blocked,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          cpf: user.cpf,
          status: user.status,
          email_functional: user.email_functional,
          name: user.name,
          role: {
            id: user.role?.id,
            name: user.role?.name,
            description: user.role?.description,
            type: user.role?.type,
            createdAt: user.role?.createdAt,
            updatedAt: user.role?.updatedAt,
          },
          created_for: {
            id: user.created_for?.id,
            username: user.created_for?.username,
            email: user.created_for?.email,
            provider: user.created_for?.provider,
            confirmed: user.created_for?.confirmed,
            blocked: user.created_for?.blocked,
            createdAt: user.created_for?.createdAt,
            updatedAt: user.created_for?.updatedAt,
            cpf: user.created_for?.cpf,
            status: user.created_for?.status,
            email_functional: user.created_for?.email_functional,
            name: user.created_for?.name,
          },
          updated_for: {
            id: user.updated_for?.id,
            username: user.updated_for?.username,
            email: user.updated_for?.email,
            provider: user.updated_for?.provider,
            confirmed: user.updated_for?.confirmed,
            blocked: user.updated_for?.blocked,
            createdAt: user.updated_for?.createdAt,
            updatedAt: user.updated_for?.updatedAt,
            cpf: user.updated_for?.cpf,
            status: user.updated_for?.status,
            email_functional: user.updated_for?.email_functional,
            name: user.updated_for?.name,
          },
          createdBy: {
            id: user.createdBy?.id,
            firstname: user.createdBy?.firstname,
            lastname: user.createdBy?.lastname,
            username: user.createdBy?.username,
            email: user.createdBy?.email,
            isActive: user.createdBy?.isActive,
            blocked: user.createdBy?.blocked,
            preferedLanguage: user.createdBy?.preferedLanguage,
            createdAt: user.createdBy?.createdAt,
            updatedAt: user.createdBy?.updatedAt,
          },
          updatedBy: {
            id: user.updatedBy?.id,
            firstname: user.updatedBy?.firstname,
            lastname: user.updatedBy?.lastname,
            username: user.updatedBy?.username,
            email: user.updatedBy?.email,
            isActive: user.updatedBy?.isActive,
            blocked: user.updatedBy?.blocked,
            preferedLanguage: user.updatedBy?.preferedLanguage,
            createdAt: user.updatedBy?.createdAt,
            updatedAt: user.updatedBy?.updatedAt,
          },
        };
      });

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
