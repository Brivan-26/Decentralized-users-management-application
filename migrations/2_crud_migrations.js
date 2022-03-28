const CrudContract = artifacts.require("CrudContract");

module.exports = function(deployer) {
  deployer.deploy(CrudContract);
};
