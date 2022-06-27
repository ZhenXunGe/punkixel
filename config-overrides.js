const path = require("path");
const fs = require("fs");

module.exports = function override(config, env) {
  console.log(config);
  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.test && oneOf.test.toString().indexOf('tsx') >= 0) {
        oneOf.include = [oneOf.include, fs.realpathSync(path.resolve(__dirname, 'node_modules/web3subscriber/', 'src'))]
      }
    })
  })
  return config
}
