const { ethers } = require('@nomiclabs/buidler')

async function main () {
    const xyzToken = await ethers.getContractFactory('XYZToken')
    const token = await xyzToken.deploy()
    await token.deployed()
    console.log('XYZToken deployed to:', token.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
