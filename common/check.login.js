const jwt = require("jsonwebtoken");

module.exports = {
  async check(context) {
    try {
      let token;
      if (
        context.request.headers.authorization &&
        context.request.headers.authorization.startsWith("Bearer")
      ) {
        token = context.request.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return false;
      }

      // 驗證 token 正確性
      const result = await jwt.verify(token, process.env.JWT_SECRET);
      const { id, name } = result;
      return { id, name };
    } catch (error) {
      console.log("check login error !", error);
      return error;
    }
  },
};
