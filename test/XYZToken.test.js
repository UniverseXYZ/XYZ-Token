const { expect, use } = require('chai')
const { ethers } = require('@nomiclabs/buidler')
const { BigNumber } = require('bignumber.js')

use(require('chai-bignumber')())

describe('XYZToken', function () {
    let token

    let xyzDao
    let vestingRouter
    let communityVault

    const tokenName = 'XYZ Governance Token'
    const tokenSymbol = 'XYZ'
    const mintTokens = new BigNumber(1000000 * Math.pow(10, 18));
    const vestingTokens = new BigNumber(100000 * Math.pow(10, 18));
    const communityVaultTokens = new BigNumber(70000 * Math.pow(10, 18));

    beforeEach(async function () {
        const accounts = await ethers.getSigners()
        xyzDao = accounts[0]
        vestingRouter = accounts[1]
        communityVault = accounts [2]

        const Token = await ethers.getContractFactory('XYZToken')
        token = await Token.deploy(await xyzDao.getAddress(), await vestingRouter.getAddress())
        await token.deployed()
    })

    it('Deploys successfully', async function () {
        expect(token.address).to.not.equal(0)
    })

    it('Has correct name', async function () {
        expect(await token.name()).to.equal(tokenName)
    })

    it('Has correct symbol', async function () {
        expect(await token.symbol()).to.equal(tokenSymbol)
    })

    it('Mints 1MM tokens', async function () {
        const actual = new BigNumber((await token.totalSupply()).toString())

        expect(actual).to.be.bignumber.equal(mintTokens)
    })

    it('Sends the non vesting tokens to dao', async function () {
        const nonVestedTokens = mintTokens.minus(vestingTokens);
        expect(
            new BigNumber(
                (await token.balanceOf(await xyzDao.getAddress())).toString(),
            ),
        ).to.be.bignumber.equal(nonVestedTokens)
    })

    it('Sends the vesting tokens to vesting router', async function () {
        expect(
            new BigNumber(
                (await token.balanceOf(await vestingRouter.getAddress())).toString(),
            ),
        ).to.be.bignumber.equal(vestingTokens)
    })

    it('Sends the pool reward tokens to community vault', async function () {
        await token.mint(await communityVault.getAddress(), communityVaultTokens.toString(10))
        expect(
            new BigNumber(
                (await token.balanceOf(await communityVault.getAddress())).toString(),
            ),
        ).to.be.bignumber.equal(communityVaultTokens)
    })
})
