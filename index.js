// 'use strict';

const crypto = require('crypto');

const packageJSON = require('./package.json');

// Change to toke name
const DEFAULT_MODULE_ALIAS = '<template>_dex_adapter';
const DEFAULT_CHAIN_SYMBOL = '<template>';
const DEX_TRANSACTION_ID_LENGTH = 44;

const MODULE_BOOTSTRAP_EVENT = 'bootstrap';
const MODULE_CHAIN_STATE_CHANGES_EVENT = 'chainChanges';

const notFound = (err) => err && err.response && err.response.status === 404;

class InvalidActionError extends Error {
  constructor(name, message, cause) {
    super(message);
    this.type = 'InvalidActionError';
    this.name = name;
    this.cause = cause;
  }

  toString() {
    return JSON.stringify({
      name: this.name,
      type: this.type,
      message: this.message,
      cause: this.cause,
    });
  }
}

const multisigAccountDidNotExistError = 'MultisigAccountDidNotExistError';
const accountDidNotExistError = 'AccountDidNotExistError';
const accountWasNotMultisigError = 'AccountWasNotMultisigError';
const blockDidNotExistError = 'BlockDidNotExistError';
const transactionDidNotExistError = 'TransactionDidNotExistError';
const transactionBroadcastError = 'TransactionBroadcastError';

class TemplateAdapter {
  constructor(options) {
    this.options = options || { alias, config: {}, logger: console };
    this.alias = options.alias || DEFAULT_MODULE_ALIAS;
    this.logger = options.logger || console;
    this.dexWalletAddress = options.config.dexWalletAddress;
    this.chainSymbol = options.config.chainSymbol || DEFAULT_CHAIN_SYMBOL;
    this.address = options.config.address || DEFAULT_ADDRESS;
    this.chainPollingInterval = null;
    this.pollingInterval = options.config.pollingInterval || 10000;

    this.getRequiredDexWalletInformation();

    this.MODULE_BOOTSTRAP_EVENT = MODULE_BOOTSTRAP_EVENT;
    this.MODULE_CHAIN_STATE_CHANGES_EVENT = MODULE_CHAIN_STATE_CHANGES_EVENT;
    this.MODULE_ark_WS_CLOSE_EVENT = MODULE_ark_WS_CLOSE_EVENT;

    this.transactionMapper = (transaction) => {
      // this.dexMultisigPublicKeys needs to await it's Promise, if it isn't available yet, recall the function until it is available.
      if (!this.dexMultisigPublicKeys)
        setTimeout(() => this.transactionMapper(transaction), 200);

      let sanitizedTransaction = {
        ...transaction,
        signatures: this.dexMultisigPublicKeys
          .map((publicKey, index) => {
            const signerAddress = Identities.Address.fromPublicKey(publicKey);

            return {
              signerAddress,
              publicKey,
              signature:
                transaction.signatures?.[index] || transaction.signature,
            };
          })
          .filter((signaturePacket) => signaturePacket.signature),
      };

      return this.sanitizeTransaction(sanitizedTransaction);
    };
  }

  get dependencies() {
    return ['app'];
  }

  get info() {
    return {
      author: packageJSON.author,
      version: packageJSON.version,
      name: packageJSON.name,
    };
  }

  get events() {
    return [MODULE_BOOTSTRAP_EVENT, MODULE_CHAIN_STATE_CHANGES_EVENT];
  }

  get actions() {
    return {
      getStatus: { handler: () => ({ version: packageJSON.version }) },
      getMultisigWalletMembers: {
        handler: (action) => this.getMultisigWalletMembers(action),
      },
      getMinMultisigRequiredSignatures: {
        handler: (action) => this.getMinMultisigRequiredSignatures(action),
      },
      getOutboundTransactions: {
        handler: (action) => this.getOutboundTransactions(action),
      },
      getInboundTransactions: {
        handler: (action) => this.getInboundTransactions(action),
      },
      getInboundTransactionsFromBlock: {
        handler: (action) => this.getInboundTransactionsFromBlock(action),
      },
      getOutboundTransactionsFromBlock: {
        handler: (action) => this.getOutboundTransactionsFromBlock(action),
      },
      getMaxBlockHeight: {
        handler: (action) => this.getMaxBlockHeight(action),
      },
      getBlocksBetweenHeights: {
        handler: (action) => this.getBlocksBetweenHeights(action),
      },
      getBlockAtHeight: { handler: (action) => this.getBlockAtHeight(action) },
      postTransaction: { handler: (action) => this.postTransaction(action) },
    };
  }

  isMultisigAccount(account) {
    return !!account.attributes.multiSignature;
  }

  async getMultisigWalletMembers({ params: { walletAddress } }) {
    try {
      const account = 'change to request';

      if (account) {
        if (!this.isMultisigAccount(account)) {
          throw new InvalidActionError(
            accountWasNotMultisigError,
            `Account with address ${walletAddress} is not a multisig account`,
          );
        }

        // Return account object
        return account;
      }

      throw new InvalidActionError(
        multisigAccountDidNotExistError,
        `Error getting multisig account with address ${walletAddress}`,
      );
    } catch (err) {
      if (err instanceof InvalidActionError) {
        throw err;
      }
      throw new InvalidActionError(
        multisigAccountDidNotExistError,
        `Error getting multisig account with address ${walletAddress}`,
        err,
      );
    }
  }

  async getMinMultisigRequiredSignatures({ params: { walletAddress } }) {
    try {
      let account = 'change to request';

      if (account) {
        if (!this.isMultisigAccount(account)) {
          throw new InvalidActionError(
            accountWasNotMultisigError,
            `Account with address ${walletAddress} is not a multisig account`,
          );
        }

        // Return signitures required
        return account;
      }
      throw new InvalidActionError(
        multisigAccountDidNotExistError,
        `Error getting multisig account with address ${walletAddress}`,
      );
    } catch (err) {
      if (err instanceof InvalidActionError) {
        throw err;
      }
      throw new InvalidActionError(
        multisigAccountDidNotExistError,
        `Error getting multisig account with address ${walletAddress}`,
        err,
      );
    }
  }

  // Timestamp is epoch by default on Ark
  async getOutboundTransactions({
    params: { walletAddress, fromTimestamp, limit, order },
  }) {
    try {
      const transactions = ['change to transaction request'];

      return transactions.map(this.transactionMapper);
    } catch (err) {
      if (notFound(err)) {
        return [];
      }
      throw new InvalidActionError(
        accountDidNotExistError,
        `Error getting outbound transactions with account address ${walletAddress}`,
        err,
      );
    }
  }

  async getInboundTransactions({
    params: { walletAddress, fromTimestamp, limit, order },
  }) {
    try {
      const transactions = ['change to transaction request'];

      return transactions.map(this.transactionMapper);
    } catch (err) {
      if (notFound(err)) {
        return [];
      }
      throw new InvalidActionError(
        accountDidNotExistError,
        `Error getting outbound transactions with account address ${walletAddress}`,
        err,
      );
    }
  }

  async getInboundTransactionsFromBlock({
    params: { walletAddress, blockId },
  }) {
    try {
      const transactions = ['change to transaction request'];

      return transactions.map(this.transactionMapper);
    } catch (err) {
      if (notFound(err)) {
        return [];
      }
      throw new InvalidActionError(
        accountDidNotExistError,
        `Error getting outbound transactions with account address ${walletAddress}`,
        err,
      );
    }
  }

  async getOutboundTransactionsFromBlock({
    params: { walletAddress, blockId },
  }) {
    try {
      const transactions = ['change to transaction request'];

      return transactions.map(this.transactionMapper);
    } catch (err) {
      if (notFound(err)) {
        return [];
      }
      throw new InvalidActionError(
        accountDidNotExistError,
        `Error getting outbound transactions with account address ${walletAddress}`,
        err,
      );
    }
  }

  async getMaxBlockHeight() {
    return 'change to max block height request';
  }

  async getBlocksBetweenHeights({ params: { fromHeight, toHeight, limit } }) {
    const data = 'blocks between data request';

    return data;
  }

  async getBlockAtHeight({ params: { height } }) {
    const data = 'blocks between data request';

    if (data) {
      return data;
    }

    throw new InvalidActionError(
      blockDidNotExistError,
      `Error getting block at height ${height}`,
    );
  }

  async postTransaction({ params: { transaction } }) {
    const data = 'blocks between data request';

    if (data) {
      return data;
    }

    throw new InvalidActionError(
      transactionBroadcastError,
      `Error broadcasting transaction to the ark network`,
    );
  }

  async getRequiredDexWalletInformation() {
    const account = 'change to account request'

    if (!account.multiSignature) {
      throw new Error('Wallet address is no multisig wallet');
    }

    this.dexNumberOfSignatures = account.multiSignature.min;
    this.dexMultisigPublicKeys = account.multiSignature.publicKeys;
  }

  async publishNewBlocks() {
    /**
     * Currently for blocks
     * Can be changed to websockets
     */
    const blocks = 'blocks request'

    blocks.forEach((b) => {
      const eventPayload = {
        type: 'addBlock',
        block: {
          timestamp: b.timestamp.unix,
          height: b.height,
        },
      };

      this.channel.publish(
        `${this.alias}:${MODULE_CHAIN_STATE_CHANGES_EVENT}`,
        eventPayload,
      );
    });
  }

  async load(channel) {
    if (!this.dexWalletAddress) {
      throw new Error('Dex wallet address not provided in the config');
    }

    this.channel = channel;

    await this.channel.invoke('app:updateModuleState', {
      [this.alias]: {},
    });

    await channel.publish(`${this.alias}:${MODULE_BOOTSTRAP_EVENT}`);

    await this.publishNewBlocks();

    this.chainPollingInterval = setInterval(
      () => this.publishNewBlocks,
      this.pollingInterval,
    );
  }

  async unload() {
    clearInterval(this.chainPollingInterval);
  }

  computeDEXTransactionId(senderAddress, nonce) {
    return crypto
      .createHash('sha256')
      .update(`${senderAddress}-${nonce}`)
      .digest('hex')
      .slice(0, DEX_TRANSACTION_ID_LENGTH);
  }

  sanitizeTransaction(t) {
    return {
      id: this.computeDEXTransactionId(t.sender, t.nonce),
      message: t.vendorField || '',
      amount: t.amount,
      timestamp: t.timestamp.unix,
      senderAddress: t.sender,
      recipientAddress: t.recipient,
      signatures: t.signatures,
      nonce: t.nonce,
    };
  }

  blockMapper({ id, height, timestamp, numberOfTransactions }) {
    return {
      id,
      height,
      timestamp,
      numberOfTransactions,
    };
  }
}

module.exports = ArkAdapter;
