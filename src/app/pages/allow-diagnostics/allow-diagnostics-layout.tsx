import { FC } from 'react';
import { FiCheck } from 'react-icons/fi';
import { Box, Button, Flex, color, Stack } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';
import { Body, Title } from '@app/components/typography';
import { FULL_PAGE_MAX_WIDTH } from '@shared/styles-constants';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

interface ReasonToAllowDiagnosticsProps {
  text: string;
}
const ReasonToAllowDiagnostics: FC<ReasonToAllowDiagnosticsProps> = ({ text }) => {
  return (
    <Flex color={color('text-caption')} textStyle="body.small">
      <Box mr="tight" mt="3px">
        <FiCheck />
      </Box>
      <Box>{text}</Box>
    </Flex>
  );
};

interface AllowDiagnosticsLayoutProps {
  onUserAllowDiagnostics(): void;
  onUserDenyDiagnosticsPermissions(): void;
}
export function AllowDiagnosticsLayout(props: AllowDiagnosticsLayoutProps) {
  const { onUserAllowDiagnostics, onUserDenyDiagnosticsPermissions } = props;

  return (
    <Stack
      flexGrow={1}
      justifyContent="center"
      maxWidth={`${FULL_PAGE_MAX_WIDTH}px`}
      spacing="extra-loose"
    >
      <Title as="h1" fontWeight={500} textAlign="center">
        Help us improve
      </Title>
      <Box mx="loose" mb="extra-loose">
        <Body>
          We would like to gather de-identified usage data to help improve your experience with Hiro
          Wallet.
        </Body>
        <Stack mt="loose" spacing="base-tight">
          <ReasonToAllowDiagnostics text="Send anonymous data about page views and clicks" />
          <ReasonToAllowDiagnostics text="This data is tied to randomly-generated IDs and not personal data, such as your Stacks addresses, keys, balance, or IP addresses" />
          <ReasonToAllowDiagnostics text="This data is used to generate and send crash reports, help us fix errors, and analyze trends and statistics" />
        </Stack>
        <Flex mt="loose" fontSize="14px" justifyContent="center">
          <PrimaryButton
            dataTestId={OnboardingSelectors.AnalyticsAllow}
            onClick={onUserAllowDiagnostics}
          >
            Allow
          </PrimaryButton>
          <Button
            type="button"
            mode="tertiary"
            size="lg"
            ml="base"
            variant="link"
            onClick={() => onUserDenyDiagnosticsPermissions()}
          >
            Deny
          </Button>
        </Flex>
      </Box>
    </Stack>
  );
}