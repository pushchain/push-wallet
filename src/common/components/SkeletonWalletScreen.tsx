import { Box, PushLogo, Skeleton } from "blocks";
import { FC, ReactNode } from "react";
import { BoxLayout, ContentLayout, PopupLayout } from "common";
import { css } from "styled-components";

type SkeletonWalletScreenProps = {
  loadingPopup?: ReactNode;
};
const ROWS = 10;

//fix the highlighted border
const SkeletonWalletScreen: FC<SkeletonWalletScreenProps> = ({
  loadingPopup,
}) => {
  return (
    <ContentLayout>
      <BoxLayout>
        <Box
          alignItems="start"
          flexDirection="column"
          display="flex"
          height="570px"
          justifyContent="start"
          width="376px"
          padding='spacing-md'
          gap="spacing-xs"
          margin="spacing-sm spacing-none spacing-none spacing-none"
        >
          <Box width="100%" display="flex" alignItems="start">
            <PushLogo height={48} width={48} />
          </Box>
          <Box
            alignItems="center"
            flexDirection="column"
            display="flex"
            width="100%"
            gap="spacing-xxs"
          >
            <Box
              alignItems="center"
              flexDirection="column"
              display="flex"
              gap="spacing-sm"
              width="100%"
            >
              <Skeleton isLoading>
                <Box
                  width="50px"
                  height="50px"
                  borderRadius="radius-round"
                ></Box>
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
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              alignItems="start"
              padding="spacing-sm"
              css={css`
                border-bottom: var(--border-sm) solid var(--stroke-secondary);
              `}
            >
              <Skeleton isLoading>
                <Box
                  height="12px"
                  width="104px"
                  //   padding="spacing-sm"
                  css={css`
                    border-bottom: 1px solid red;
                  `}
                  //   css={css`
                  //     border-bottom: var(--border-md) solid var(--stroke-brand-medium);
                  //   `}
                ></Box>
              </Skeleton>
            </Box>
            <Box
              display="flex"
              width="100%"
              flexDirection="column"
              overflow="hidden scroll"
              customScrollbar
              height="200px"
            >
              {Array.from({ length: ROWS }).map((_, index) => (
                <Box
                  key={index}
                  display="flex"
                  width="100%"
                  padding="spacing-sm spacing-xs"
                  alignItems="center"
                  justifyContent="space-between"
                  css={css`
                    border-bottom: var(--border-sm) solid
                      var(--stroke-secondary);
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
          <PopupLayout>{loadingPopup}</PopupLayout>
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

export { SkeletonWalletScreen };
