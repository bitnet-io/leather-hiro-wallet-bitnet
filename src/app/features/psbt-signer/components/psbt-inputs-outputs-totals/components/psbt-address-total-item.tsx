import { Box, HStack, styled } from 'leather-styles/jsx';

import { useClipboard } from '@app/common/hooks/use-copy-to-clipboard';
import { Flag } from '@app/components/layout/flag';
import { LeatherButton } from '@app/ui/components/button';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface PsbtAddressTotalItemProps {
  hoverLabel?: string;
  image?: React.JSX.Element;
  subtitle?: string;
  subValue?: string;
  title?: string;
  value: string;
  valueAction?(): void;
}
export function PsbtAddressTotalItem({
  hoverLabel,
  image,
  subtitle,
  subValue,
  title,
  value,
  valueAction,
}: PsbtAddressTotalItemProps) {
  const { onCopy, hasCopied } = useClipboard(hoverLabel ?? '');

  return (
    <Flag align="middle" img={image ? image : <BtcIcon />} mt="space.05" spacing="space.04">
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">{title ? title : 'Bitcoin'}</styled.span>
        {valueAction ? (
          <LeatherButton onClick={valueAction} variant="link">
            {value}
          </LeatherButton>
        ) : (
          <styled.span textStyle="label.01">{value}</styled.span>
        )}
      </HStack>
      <HStack alignItems="center" justifyContent="space-between" mt="space.02">
        {subtitle ? (
          <HStack gap="space.01">
            <styled.span mr="space.01" textStyle="caption.01">
              {subtitle}
            </styled.span>
            <BasicTooltip
              disabled={!hoverLabel}
              label={hasCopied ? 'Copied!' : hoverLabel}
              side="bottom"
            >
              <Box display="flex" height="16px">
                <LeatherButton onClick={onCopy} variant="text">
                  {hoverLabel ? <CopyIcon /> : null}
                </LeatherButton>
              </Box>
            </BasicTooltip>
          </HStack>
        ) : null}
        {subValue ? (
          <styled.span mr="space.01" textStyle="caption.01">
            {subValue}
          </styled.span>
        ) : null}
      </HStack>
    </Flag>
  );
}
