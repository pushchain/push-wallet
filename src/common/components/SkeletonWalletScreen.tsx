import { Box, PushLogo, Skeleton } from "blocks";
import { FC, ReactNode } from "react";
import { BoxLayout } from "src/common/components/BoxLayout";
import { css } from "styled-components";

type SkeletonWalletScreenProps = {
  loadingPopup?: ReactNode;
};
const ROWS = 2;

const SkeletonWalletScreen: FC<SkeletonWalletScreenProps> = ({
  loadingPopup,
}) => {
  return (
    <Box
      alignItems="center"
      flexDirection="column"
      display="flex"
      height="498px"
      justifyContent="start"
      width="100%"
      gap="spacing-sm"
      margin="spacing-md spacing-none spacing-none spacing-none"
    >
      <Box width="inherit" display="flex" alignItems="start">
        <PushLogo height={48} width={48} />
      </Box>
      <Box
        alignItems="center"
        flexDirection="column"
        display="flex"
        gap="spacing-sm"
        width="inherit"
      >
        <Skeleton isLoading>
          <Box width="50px" height="50px" borderRadius="radius-round"></Box>
        </Skeleton>
        <Box
          alignItems="center"
          flexDirection="column"
          display="flex"
          gap="spacing-xxxs"
        >
          <Skeleton isLoading>
            <Box height="12px" width="104px"></Box>
          </Skeleton>
          <Skeleton isLoading>
            <Box height="12px" width="104px"></Box>
          </Skeleton>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          width="inherit"
          alignItems="start"
          gap="spacing-sm"
          padding="spacing-sm"
          css={css`
            border-bottom: var(--border-sm) solid var(--stroke-secondary);
          `}
        >
          <Skeleton isLoading>
            <Box
              height="12px"
              width="104px"
              css={css`
                border-bottom: var(--border-md) solid var(--stroke-brand-medium);
              `}
            ></Box>
          </Skeleton>
        </Box>
        <Box display="flex" width="inherit" flexDirection="column">
          {Array.from({ length: ROWS }).map((_, index) => (
            <Box
              key={index}
              display="flex"
              width="inherit"
              padding="spacing-sm spacing-xs"
              alignItems="center"
              justifyContent="space-between"
              css={css`
                border-bottom: var(--border-sm) solid var(--stroke-secondary);
              `}
            >
              <Box display="flex" gap="spacing-xxs" alignItems="center">
                <Skeleton isLoading>
                  <Box
                    width="32px"
                    height="32px"
                    borderRadius="radius-round"
                  ></Box>
                </Skeleton>
                <Skeleton isLoading>
                  <Box height="12px" width="104px"></Box>
                </Skeleton>
              </Box>
              <Skeleton isLoading>
                <Box height="12px" width="64px"></Box>
              </Skeleton>
            </Box>
          ))}
        </Box>
      </Box>
      {loadingPopup}
    </Box>
  );
};

export { SkeletonWalletScreen };
