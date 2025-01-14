import { useCallback } from 'react';

import { Money, createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import {
  determineUtxosForSpend,
  determineUtxosForSpendAll,
} from '@app/common/transactions/bitcoin/coinselect/local-coin-selection';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

export const MAX_FEE_RATE_MULTIPLIER = 50000;

interface UseBitcoinCustomFeeArgs {
  amount: Money;
  isSendingMax: boolean;
  recipient: string;
}
export function useBitcoinCustomFee({ amount, isSendingMax, recipient }: UseBitcoinCustomFeeArgs) {
  const balance = useCurrentNativeSegwitAddressBalance();
  const { data: utxos = [] } = useCurrentNativeSegwitUtxos();
  const btcMarketData = useCryptoCurrencyMarketData('BIT');

  return useCallback(
    (feeRate: number) => {
      if (!feeRate || !utxos.length) return { fee: 0, fiatFeeValue: '' };

      const satAmount = isSendingMax ? balance.amount.toNumber() : amount.amount.toNumber();

      const determineUtxosArgs = {
        amount: satAmount,
        recipient,
        utxos,
        feeRate,
      };
      const { fee } = isSendingMax
        ? determineUtxosForSpendAll(determineUtxosArgs)
        : determineUtxosForSpend(determineUtxosArgs);

      return {
        fee,
        fiatFeeValue: `~ ${i18nFormatCurrency(
          baseCurrencyAmountInQuote(createMoney(Math.ceil(fee), 'BIT'), btcMarketData)
        )}`,
      };
    },
    [utxos, isSendingMax, balance.amount, amount.amount, recipient, btcMarketData]
  );
}
