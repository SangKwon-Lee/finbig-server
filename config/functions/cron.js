"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  "59 59 23 * * *": async () => {
    let daily = [7, 8, 10, 12, 13, 14, 16, 17];
    for (let i = 0; i < daily.length; i++) {
      await strapi
        .query("finbig")
        .update({ id: daily[i] }, { isUpdate: false });
    }
  },

  "59 59 23 * * 1": async () => {
    let notDaily = [
      1, 2, 3, 4, 5, 6, 9, 10, 11, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
      28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
    ];
    for (let i = 0; i < notDaily.length; i++) {
      await strapi
        .query("finbig")
        .update({ id: notDaily[i] }, { isUpdate: false });
    }
  },

  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }
};
