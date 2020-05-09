module.exports = {
  path: "/bar",
  onOpen: () => ([1, 2, 3]),
  onMessage: (message) => {
    return [1, 2, 3];
  },
  messages: [
    {timeout:1000, message: {"test": 123}},
    {timeout:2000, message: [3, 4, 5]},
    {timeout:3000, message: [4, 5, 6]},
  ]
};
