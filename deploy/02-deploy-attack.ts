import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../helper-hardhat-config"
import verify from "../utils/verify"
import { ethers } from "hardhat"

const deployStorage: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, network, getNamedAccounts } = hre
    const { attacker } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId || 31337

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS

    // if (developmentChains.includes(network.name)) {
    //     // Write code Specific to Local Network Testing
    // }

    const ReentrancyVulnerableContract = await ethers.getContract("ReentrancyVulnerable")
    const args: any[] = [ReentrancyVulnerableContract.address]

    const storage = await deploy("Attack", {
        from: attacker,
        log: true,
        args: args,
        waitConfirmations: waitBlockConfirmations,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(storage.address, args)
    }
}

export default deployStorage
deployStorage.tags = ["all", "attack"]
