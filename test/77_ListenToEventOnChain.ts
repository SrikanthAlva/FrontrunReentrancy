import { ethers } from "hardhat"
import "dotenv/config"
import data from "../deployments/goerli/ReentrancyVulnerable.json"

async function listenToEventOnChain() {
    const vulnerableContractAddress = data.address
    const provider = new ethers.providers.WebSocketProvider(process.env.GOERLI_WSS || "")

    const vulnerableContract = new ethers.Contract(vulnerableContractAddress, data.abi, provider)

    console.log("Inside the function")
    vulnerableContract.on("Withdraw", (caller, amount, event) => {
        let info = {
            caller: caller,
            amount: ethers.utils.formatUnits(amount),
            data: event,
        }
        console.log(JSON.stringify(info, null, 4))
    })
}

listenToEventOnChain()
// .then(() => process.exit(0))
// .catch((error: any) => {
//     console.error(error)
//     process.exit(1)
// })
