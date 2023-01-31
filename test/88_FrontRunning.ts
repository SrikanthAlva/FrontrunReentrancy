const express = require("express")
const http = require("http")
const Web3 = require("web3")
const ethers = require("ethers")
const app = express()
const PORT = process.env.PORT || 3888
const web3 = new Web3("wss://your-fastlynode-endpoint")
var wss = "wss://5489c137-cd4d-42dd-878d-d366b622cd6f.bscfullnode.com/5489c137-cd4d-42dd-878d-d366b622cd6f/ws"

var init = async function () {
    var customWsProvider = new ethers.providers.WebSocketProvider(wss)
    const iface = new ethers.utils.Interface([
        "function    swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)",
        "function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)",
        "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline)",
    ])
    customWsProvider.on("pending", (tx) => {
        customWsProvider.getTransaction(tx).then(async function (transaction) {
            // now we will only listen for pending transaction on pancakesswap factory
            if (transaction && transaction.to === "0x10ED43C718714eb63d5aA57B78B54704E256024E") {
                const value = web3.utils.fromWei(transaction.value.toString())
                const gasPrice = web3.utils.fromWei(transaction.gasPrice.toString())
                const gasLimit = web3.utils.fromWei(transaction.gasLimit.toString())
                // for example we will be only showing transaction that are higher than 30 bnb
                if (value > 10) {
                    console.log("value : ", value)
                    console.log("gasPrice : ", gasPrice)
                    console.log("gasLimit : ", gasLimit)
                    //we can print the sender of that transaction
                    console.log("from", transaction.from)
                    let result = []
                    //we will use try and catch to handle the error and decode the data of the function used to swap the token
                    try {
                        result = iface.decodeFunctionData("swapExactETHForTokens", transaction.data)
                    } catch (error) {
                        try {
                            result = iface.decodeFunctionData(
                                "swapExactETHForTokensSupportingFeeOnTransferTokens",
                                transaction.data
                            )
                        } catch (error) {
                            try {
                                result = iface.decodeFunctionData("swapETHForExactTokens", transaction.data)
                            } catch (error) {
                                console.log("final err : ", transaction)
                            }
                        }
                    }
                    if (result.length > 0) {
                        let tokenAddress = ""
                        if (result[1].length > 0) {
                            tokenAddress = result[1][1]
                        }
                        console.log("tokenAddress", tokenAddress)
                        console.log("result : ", result)
                    }
                }
            }
        })
    })
    customWsProvider._websocket.on("error", async (ep) => {
        console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`)
        setTimeout(init, 3000)
    })
    customWsProvider._websocket.on("close", async (code) => {
        console.log(`Connection lost with code ${code}! Attempting reconnect in 3s...`)
        customWsProvider._websocket.terminate()
        setTimeout(init, 3000)
    })
}

init()
