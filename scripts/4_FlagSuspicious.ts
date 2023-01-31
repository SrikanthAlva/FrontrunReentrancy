import { ethers } from "hardhat"
import "dotenv/config"
import { ReentrancyVulnerable } from "../typechain-types"
import data from "../deployments/goerli/ReentrancyVulnerable.json"
import notification from "./3_Notification"

async function flagSuspicious() {
    const provider = new ethers.providers.WebSocketProvider(process.env.GOERLI_WSS || "")
    const vulnerableContractAddress = data.address
    const vulnerableContract: ReentrancyVulnerable = await ethers.getContract("ReentrancyVulnerable")
    const iface = new ethers.utils.Interface(["function deposit()", "function withdraw()"])
    // notification()

    provider.on("pending", async (tx) => {
        const txInfo = await provider.getTransaction(tx)
        let functionSignature = iface.encodeFunctionData("withdraw", [])
        if (txInfo && txInfo.to == vulnerableContractAddress && txInfo.data === functionSignature) {
            console.log(JSON.stringify(functionSignature))
            console.log(JSON.stringify(txInfo.data))
            console.log("Suspicious transaction detected")
            console.log("Pausing the Contract......")
            console.log(JSON.stringify(txInfo.gasPrice))
            try {
                await vulnerableContract.pause({
                    gasPrice: txInfo.gasPrice?.add(3),
                    gasLimit: txInfo.gasLimit,
                })
                await notification()
            } catch (error: any) {
                console.log("Error!!!!")
            }
        }
    })

    provider._websocket.on("error", async (ep: any) => {
        console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`)
        setTimeout(flagSuspicious, 3000)
    })
    provider._websocket.on("close", async (code: any) => {
        console.log(`Connection lost with code ${code}! Attempting reconnect in 3s...`)
        provider._websocket.terminate()
        setTimeout(flagSuspicious, 3000)
    })
}

flagSuspicious()
