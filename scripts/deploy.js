async function main() {
  
    // Get the contract to deploy & deploy
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeACofee = await BuyMeACoffee.deploy();
    await buyMeACofee.deployed();
    console.log("BuyMeACoffee deployed to ", buyMeACofee.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  