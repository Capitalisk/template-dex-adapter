# Template for the DEX adapter

Use this template to create a dex entry inside blockchain.
Once you finished your adapter feel free to contact us on [Discord](https://discord.gg/W6SyJEZxkK) to list your crypto currency, or for any questions you might have.

## Options

```js
const moduleAdapter = new ArkAdapter({
  options: {
    // OPTIONAL
    alias: 'NameOfDexAdaptor', // Default: 'ark_dex_adapter'
    // OPTIONAL
    logger: console, // Default: console
    config: {
      // REQUIRED
      dexWalletAddress: 'DRFp1KVCuCMFLPFrHzbH8eYdPUoNwTXWzV',
      // OPTIONAL
      chainSymbol: '<template>', // Default: '<template>'
      // OPTIONAL
      address: '<address>', // Default: '<template>'
      // OPTIONAL
      // Interval to which the adapter polls the API to get new blocks
      pollingInterval: 2000, // Default: 10000
    },
  },
});
```

## How to edit

Inside the `test/dex-api-tests.js` are all the tests that need to pass to integrate. Note that these tests need to be edited to conform your chains transactions and specifications. Once all these tests do pass the adapter should be able to integrate in the [CDEX](http://ldex.trading). You will need to edit the `index.js` to communicate with your endpoint. If you want to see any working example take a look at two working examples:

- [Ark DEX adapter](https://github.com/Capitalisk/ark-dex-adapter)
- [Lisk v3 DEX adapter](https://github.com/Capitalisk/lisk-v3-dex-adapter)
