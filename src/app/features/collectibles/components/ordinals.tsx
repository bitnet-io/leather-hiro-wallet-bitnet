import { UseQueryResult } from '@tanstack/react-query';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useInscriptionQuery } from '@app/query/bitcoin/ordinals/use-inscription.query';
import { useTaprootAddressUtxosQuery } from '@app/query/bitcoin/ordinals/use-taproot-address-utxos.query';
import { useTransactionsMetadataQuery } from '@app/query/bitcoin/ordinals/use-transactions-metadata.query';
import {
  OrdApiXyzGetTransactionOutput,
  createInfoUrl,
  whenOrdinalType,
} from '@app/query/bitcoin/ordinals/utils';

import { CollectibleImage } from './collectible-image';
import { CollectibleOther } from './collectible-other';
import { CollectibleText } from './collectible-text';

interface InscriptionProps {
  path: string;
}

function Inscription({ path }: InscriptionProps) {
  const { isLoading, isError, data } = useInscriptionQuery(path);

  if (isLoading) return null; // TODO

  if (isError) return null; // TODO

  const inscription = whenOrdinalType(data['content type'], {
    image: () => ({
      infoUrl: createInfoUrl(data.content),
      src: `https://ordinals.com${data.content}`,
      title: data.title,
      type: 'image',
    }),
    text: () => ({
      contentSrc: `https://ordinals.com${data.content}`,
      infoUrl: createInfoUrl(data.content),
      title: data.title,
      type: 'text',
    }),
    other: () => ({
      infoUrl: createInfoUrl(data.content),
      title: data.title,
      type: 'other',
    }),
  });

  switch (inscription.type) {
    case 'image': {
      return (
        <CollectibleImage
          key={inscription.title}
          onSelectCollectible={() => openInNewTab(inscription.infoUrl)}
          src={inscription.src}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      );
    }
    case 'text': {
      return (
        <CollectibleText
          key={inscription.title}
          onSelectCollectible={() => openInNewTab(inscription.infoUrl)}
          contentSrc={inscription.contentSrc}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      );
    }
    case 'other': {
      return (
        <CollectibleOther
          key={inscription.title}
          onSelectCollectible={() => openInNewTab(inscription.infoUrl)}
          subtitle="Ordinal inscription"
          title={inscription.title}
        />
      );
    }
    default: {
      return null;
    }
  }
}

interface TransactionQueryLoaderProps {
  transactionMetadataQuery: UseQueryResult<OrdApiXyzGetTransactionOutput>;
  children(path: string): JSX.Element;
}
function InscriptionQueryLoader({
  transactionMetadataQuery,
  children,
}: TransactionQueryLoaderProps) {
  if (transactionMetadataQuery.isLoading) return null; // TODO

  if (transactionMetadataQuery.isError) return null; // TODO

  return children(transactionMetadataQuery.data.inscriptions);
}

export function Ordinals() {
  const { data: utxos } = useTaprootAddressUtxosQuery();
  const transactionsMetadata = useTransactionsMetadataQuery(utxos ?? []);

  return (
    <>
      {transactionsMetadata.map((query, i) => (
        <InscriptionQueryLoader key={i} transactionMetadataQuery={query}>
          {path => <Inscription path={path} />}
        </InscriptionQueryLoader>
      ))}
    </>
  );
}
