import { PRC20_TOKENS } from '../constants';

type SourceChain = typeof PRC20_TOKENS[number]['sourceChain'];
type TokenSymbol = typeof PRC20_TOKENS[number]['symbol'];

export const getPrc20Address = (
  symbol: TokenSymbol,
  sourceChain: SourceChain
): string | null => {
  return (
    PRC20_TOKENS.find(
      (t) => t.symbol === symbol && t.sourceChain === sourceChain
    )?.prc20Address ?? null
  );
};