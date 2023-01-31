import { ethers, network } from "hardhat"
import { ReentrancyVulnerable } from "../typechain-types"

async function depositEthers() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const DEPOSIT_ETHERS = ethers.utils.parseEther("0.1")

    const reentrancyVulnerable: ReentrancyVulnerable = await ethers.getContract("ReentrancyVulnerable")
    // console.log("Vulenrable Contract Address", reentrancyVulnerable.address)
    const depositEthersTx = await reentrancyVulnerable.deposit({
        value: DEPOSIT_ETHERS,
    })
    await depositEthersTx.wait(1)
    // const depositEthersTx2 = await reentrancyVulnerable.deposit({
    //     value: DEPOSIT_ETHERS,
    // })
    // await depositEthersTx2.wait(1)
    // const depositEthersTx3 = await reentrancyVulnerable.deposit({
    //     value: DEPOSIT_ETHERS,
    // })
    // await depositEthersTx3.wait(1)

    const depositValue = await ethers.provider.getBalance(reentrancyVulnerable.address)
    console.log(`Contract Total Value: ${ethers.utils.formatUnits(depositValue)} ETH`)
}

depositEthers()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.error(error)
        process.exit(1)
    })
