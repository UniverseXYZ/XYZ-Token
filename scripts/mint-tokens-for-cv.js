const { ethers } = require('@nomiclabs/buidler')
const BN = ethers.BigNumber

_cv = '0x3317cc09ce0da6751b4E0b7c56114bA833D3d232';
_xyz = '0x86dEddCFc3a7DBeE68cDADA65Eed3D3b70F4fe24'

const communityVaultTokens = BN.from(70000);
const tenPow18 = BN.from(10).pow(18)

async function main () {
    const xyz = await ethers.getContractAt('XYZToken', _xyz);
    await xyz.mint(_cv, communityVaultTokens.mul(tenPow18))
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
