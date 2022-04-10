// deploy/01_deploy_foundation_contract.js

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Governance", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    args: [
      "0x0000000000000000000000000000000000000000",
      "https://ipfs.infura.io/ipfs/QmaPaiHbmoMv7iuM3AeaTVhxQQm39mBzphu9KXzNHy1geU",
      "0x0000000000000000000000000000000000000000",
    ],
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["Governance"];
