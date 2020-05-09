module.exports = {
  path: /^\/bar\/(.+)\/(.+)\/$/,
  onOpen: function (siteId, placeId) {
    return [1, 2, 3];
  },
  onMessage: function (siteId, placeId, message) {
    return 1;
  }
};