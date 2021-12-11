const { sanitizeEntity } = require("strapi-utils");
const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async findMy(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.job.search(ctx.query);
    } else {
      entities = await strapi.services.job.find(ctx.query);
    }

    // Set entities based on current authenticated user.
    if (ctx.header?.authorization) {
      const authorization = ctx.header?.authorization ?? "";
      const jwtToken = authorization.split(" ")?.[1];
      const decoded = jwt.decode(jwtToken);

      entities = entities.filter((entity) => entity?.user?.id === decoded.id);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.job })
    );
  },
};
