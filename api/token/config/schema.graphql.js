module.exports = {
  definition: ``,
  mutation: `
  fetchToken(userId:String, token: String):Token
  `,
  type: {},
  resolver: {
    Query: {},
    Mutation: {
      fetchToken: {
        resolverOf: "application::token.token.findOne",
        resolver: async (obj, options, { context }) => {
          let data = "";
          const { userId } = context.request.body;
          if (userId) {
            data = await strapi.services.token.findOne({
              userId: userId,
            });
          }
          if (data) {
            return data;
          } else {
            return new Error("서버에 문제가 발생했습니다.");
          }
        },
      },
    },
  },
};
