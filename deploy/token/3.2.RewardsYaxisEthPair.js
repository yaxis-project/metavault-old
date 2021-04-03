module.exports = async ({ getChainId, getNamedAccounts, deployments }) => {
    const { deploy, execute } = deployments;
    let { deployer, YaxisEthUniswapV2Pair } = await getNamedAccounts();
    const chainId = await getChainId();
    const YAXIS = await deployments.get('YaxisToken');

    if (chainId != '1') {
        const WETH = await deployments.get('WETH');
        const Pair = await deploy('YaxisEthUniswapV2Pair', {
            contract: 'MockUniswapPair',
            from: deployer,
            log: true,
            args: [YAXIS.address, WETH.address]
        });
        YaxisEthUniswapV2Pair = Pair.address;
    }

    const Rewards = await deploy('RewardsYaxisEth', {
        contract: 'Rewards',
        from: deployer,
        log: true,
        args: [YAXIS.address, YaxisEthUniswapV2Pair, 7776000]
    });

    await execute('RewardsYaxisEth', { from: deployer }, 'setRewardDistribution', deployer);
    await execute(
        'YaxisToken',
        { from: deployer },
        'transfer',
        Rewards.address,
        ethers.utils.parseEther('200000')
    );
};

module.exports.tags = ['rewards'];
