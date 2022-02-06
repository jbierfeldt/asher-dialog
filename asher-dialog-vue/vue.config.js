module.exports = {
  publicPath: "/",
  devServer: {
    disableHostCheck: true,
  },
  pages: {
    index: {
      entry: "src/main.ts",
      title: "The Part",
    },
  },
};
