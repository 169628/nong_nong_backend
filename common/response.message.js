module.exports = {
  success(context, status, message, data) {
    context.status = status;
    context.body = {
      result: 1,
      message: `${message} success`,
      data,
    };
    return context;
  },
  failed(context, status, message, detail) {
    context.status = status;
    context.body = {
      result: 0,
      message: `${message} failed`,
      error: detail,
    };
    return context;
  },
};
