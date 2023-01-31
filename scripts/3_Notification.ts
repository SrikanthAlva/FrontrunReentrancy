import { ethers } from "hardhat"
import "dotenv/config"
import data from "../deployments/goerli/ReentrancyVulnerable.json"
import nodemailer from "nodemailer"

export default async function notification() {
    await sendMail()
}

async function sendMail() {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "cale.stanton17@ethereal.email",
            pass: "nAMPJUCp6fMRaVe3g7",
        },
    })

    let message = {
        from: '"Cale Stanton" <cale.stanton17@ethereal.email>',
        to: "stone.dibbert@ethereal.email",
        subject: "Alert: Suspicious Tx Detected",
        text: "Suspicious Tx Detected in Mempool",
        html: "<b>Suspicious Tx Detected in Mempool</b>",
    }

    transporter.sendMail(message, (error: any, info: any) => {
        if (error) {
            console.error(error)
        } else {
            console.log(`-----------------------`)
            console.log(`Suspicious Tx Detected Email has been sent!`)
            console.log(`-----------------------`)
            console.log(`Notification email sent: ${info.response}`)
        }
    })
}

// const vulnerableContractAddress = data.address
// const provider = new ethers.providers.WebSocketProvider(process.env.GOERLI_WSS || "")

// const vulnerableContract = new ethers.Contract(vulnerableContractAddress, data.abi, provider)

// vulnerableContract.on("Withdraw", (caller, amount, event) => {
//     let info = {
//         caller: caller,
//         amount: ethers.utils.formatUnits(amount),
//         data: event,
//     }
//     if (event.event === "Withdraw") {
//         console.log(JSON.stringify(info.data.event, null, 4))
//         console.log("Sending Email...")
//         sendMail()
//     }
// })
