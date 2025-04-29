import { ethers } from "hardhat";

async function main() {
  const RechargeSystem = await ethers.getContractFactory("RechargeSystem");
  const rechargeSystem = await RechargeSystem.deploy();

  console.log(`RechargeSystem deployed to: ${rechargeSystem.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
