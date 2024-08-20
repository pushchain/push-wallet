import { WalletClient } from 'viem'
import { Signer } from './pushSigner.types'
/**
 * Converts a signer instance to Push compatible signer
 * @dev - In Future this will be extended for solana / btc etc non evm chain signers too
 */
export class PushSigner {
  static initialize = async (
    signer: WalletClient // | SolanaClinet | BtcSigner
  ): Promise<Signer> => {
    // TODO: Have checks to determine which type of signer is it
    return this.convertViemWalletClient(signer as WalletClient)
  }

  private static convertViemWalletClient = async (
    walletClient: WalletClient
  ): Promise<Signer> => {
    try {
      const account = await walletClient.account
      if (!account) {
        throw new Error('WalletClient Account Undefined')
      }
      const chainId = await walletClient.getChainId()
      const signMessage = async (message: string) => {
        return await walletClient.signMessage({
          message,
          account,
        })
      }
      return {
        account: `eip155:${chainId}:${account.address}`, // viem signers are valid only for evm (eip155) chains
        source: `eip155:${chainId}`,
        signMessage,
      }
    } catch (err) {
      throw new Error('Invalid WalletClient')
    }
  }
}
