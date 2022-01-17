"use strict";

module.exports = {
  async logout(ctx) {
    ctx.cookies.set("AUTH_TOKEN", null);
    ctx.cookies.set("AUTH_TOKEN.sig", null);

    ctx.send({ success: true });
  },
};
