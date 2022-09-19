"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  deleteCode: async () => {
    await strapi
      .query("email-auth")
      .findOne({ code })
      .then(async (data) => {
        if (data.isAuth === false) {
          await strapi.query("email-auth").delete({ code });
          return;
        } else {
          await strapi.query("email-auth").update({ code: null });
        }
      });
  },
};
