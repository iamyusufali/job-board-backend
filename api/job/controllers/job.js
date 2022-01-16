const { sanitizeEntity, parseMultipartData } = require("strapi-utils");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */
  async create(ctx) {
    let entity;

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.owner = ctx.state.user.id;
      entity = await strapi.services.job.create(data, { files });
    } else {
      ctx.request.body.owner = ctx.state.user.id;
      entity = await strapi.services.job.create(ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.job });
  },

  /**
   * Find Owner record.
   *
   * @return {Array}
   */
  async findMy(ctx) {
    let entities;

    const query = {
      ...ctx.query,
      "owner.id": ctx.state.user.id,
    };

    if (ctx.query._q) {
      entities = await strapi.services.job.search(query);
    } else {
      entities = await strapi.services.job.find(query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.job })
    );
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [job] = await strapi.services.job.find({
      id,
      "owner.id": ctx.state.user.id,
    });

    if (!job) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.job.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.job.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.job });
  },

  /**
   * Delete a record.
   *
   * @return {Object}
   */

  async delete(ctx) {
    const { id } = ctx.params;

    const [job] = await strapi.services.job.find({
      id,
      "owner.id": ctx.state.user.id,
    });

    if (!job) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.job.delete({ id });

    return sanitizeEntity(entity, { model: strapi.models.job });
  },
};
