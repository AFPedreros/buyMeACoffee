// Returns the Ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances of a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get example accounts 
  const [owner, tipper1, tipper2, tipper3, withdrawAddress] = await ethers.getSigners();

  // Get the contract to deploy & deploy
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buyMeACofee = await BuyMeACoffee.deploy();
  await buyMeACofee.deployed();
  console.log("BuyMeACoffee deployed to ", buyMeACofee.address);
  
  // Check balances before the coffee purchase 
  const addresses = [owner.address, tipper1.address, buyMeACofee.address, withdrawAddress.address];
  console.log("=== start ===");
  await printBalances(addresses);
  console.log("\n");

  // Buy the owner a few coffees
  const tip ={value: ethers.utils.parseEther("1")};
  await buyMeACofee.connect(tipper1).buyCoffee("Lala", "Hey there", tip);
  await buyMeACofee.connect(tipper2).buyCoffee("Sofi", "Awesome", tip);
  await buyMeACofee.connect(tipper3).buyCoffee("Mariu", "Great!", tip);

  // Check balances after the coffee purchase
  console.log("=== bought coffee ===");
  await printBalances(addresses);
  console.log("\n");

  // Withdraw funds
  await buyMeACofee.connect(owner).withdrawTips();

  // Check balances after withdraw
  console.log("=== withdraw funds ===");
  await printBalances(addresses);
  console.log("\n");

  // Read all the memos left for the owner
  console.log("=== read memos ===");
  const memos = await buyMeACofee.connect(owner).getMemos();
  await printMemos(memos);
  console.log("\n");

  // Change the address to withdraw the tips
  console.log("=== change address ===");
  await buyMeACofee.connect(owner).setWithdrawAddress(withdrawAddress.address);
  console.log("Withdraw address change to ", withdrawAddress.address);
  console.log("\n");

   // Check balances before the coffee purchase 
   console.log("=== start ===");
   await printBalances(addresses);
   console.log("\n");
 
   // Buy the owner a few coffees
   await buyMeACofee.connect(tipper1).buyCoffee("Ambriw", "Hey there", tip);
   await buyMeACofee.connect(tipper2).buyCoffee("Gufy", "Awesome", tip);
   await buyMeACofee.connect(tipper3).buyCoffee("Cris", "Great!", tip);
 
   // Check balances after the coffee purchase
   console.log("=== bought coffee ===");
   await printBalances(addresses);
   console.log("\n");
 
   // Withdraw funds
   await buyMeACofee.connect(owner).withdrawTips();
 
   // Check balances after withdraw
   console.log("=== withdraw funds ===");
   await printBalances(addresses);
   console.log("\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
