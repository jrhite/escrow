usePlugin("@nomiclabs/buidler-truffle5");

module.exports = {
  defaultNetwork: "buidlerevm",
  paths: {
    artifacts: "./app/artifacts",
  },
  solc: {
    version: "0.6.2",
  }
};
