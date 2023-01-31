import { ethers, network } from "hardhat"
import { ReentrancyVulnerable } from "../typechain-types"

async function unpauseContract() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    const reentrancyVulnerable: ReentrancyVulnerable = await ethers.getContract("ReentrancyVulnerable")
    // const pauseTx = await reentrancyVulnerable.pause()
    // await pauseTx.wait(1)
    // console.log(`Contract Paused.`)

    const unpauseTx = await reentrancyVulnerable.unpause()
    await unpauseTx.wait(1)
    console.log(`Contract Unpaused.`)
}

unpauseContract()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error(error)
        process.exit(1)
    })
