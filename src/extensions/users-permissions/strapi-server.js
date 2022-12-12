const utils = require('@strapi/utils');
const { getService } = require('../users-permissions/utils');
const _ = require('lodash');
const {
  validateCallbackBody,
} = require('../users-permissions/controllers/validation/auth');
const crypto = require('crypto');

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const generateRefreshToken = async (user, ctx) => {
  const refreshTokenData = {
    token: crypto.randomUUID(),
    description: 'Login Token',
    userAgent: ctx.headers['user-agent'],
    ip: ctx.request.ip,
    expiresAt: null,
    lastActivity: new Date(),
    user: user.id,
  };

  const refreshToken = await strapi
    .plugin('refreshing')
    .service('refresh-token')
    .createRefreshToken({
      data: refreshTokenData,
    });

  return refreshToken;
};

module.exports = (plugin) => {
  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const grantSettings = await store.get({ key: 'grant' });

    const grantProvider = provider === 'local' ? 'email' : provider;

    if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
      throw new ApplicationError('This provider is disabled');
    }

    if (provider === 'local') {
      await validateCallbackBody(params);

      const { identifier } = params;

      // Check if the user exists.
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            provider,
            $or: [
              { email: identifier.toLowerCase() },
              { username: identifier },
            ],
          },
        });

      if (!user) {
        throw new ValidationError('Invalid identifier or password');
      }

      if (!user.password) {
        throw new ValidationError('Invalid identifier or password');
      }

      const validPassword = await getService('user').validatePassword(
        params.password,
        user.password,
      );

      if (!validPassword) {
        throw new ValidationError('Invalid identifier or password');
      }

      const advancedSettings = await store.get({ key: 'advanced' });
      const requiresConfirmation = _.get(
        advancedSettings,
        'email_confirmation',
      );

      if (requiresConfirmation && user.confirmed !== true) {
        throw new ApplicationError('Your account email is not confirmed');
      }

      if (user.blocked === true) {
        throw new ApplicationError(
          'Your account has been blocked by an administrator',
        );
      }

      const refreshToken = await generateRefreshToken();

      return ctx.send({
        jwt: getService('jwt').issue({ id: user.id }),
        refreshToken: refreshToken.token,
        user: await sanitizeUser(user, ctx),
      });
    }
    // Connect the user with a third-party provider.
    try {
      const user = await getService('providers').connect(provider, ctx.query);

      const refreshToken = await generateRefreshToken();

      return ctx.send({
        jwt: getService('jwt').issue({ id: user.id }),
        refreshToken: refreshToken.token,
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  };
  return plugin;
};
