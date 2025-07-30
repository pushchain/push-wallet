import { Box, PushLogo, Skeleton } from "blocks";
import { FC, ReactNode } from "react";
import { BoxLayout, ContentLayout } from "common";
import { css } from "styled-components";

export type WalletSkeletonScreenProps = {
  content?: ReactNode;
};
const ROWS = 10;

const WalletSkeletonScreen: FC<WalletSkeletonScreenProps> = ({ content }) => {
  return (
    <ContentLayout>
      <BoxLayout>
        <Box
          alignItems="start"
          flexDirection="column"
          display="flex"
          height="570px"
          justifyContent="start"
          width={{ initial: "376px", ml: "100%" }}
          padding="spacing-md"
          gap="spacing-xs"
          margin="spacing-sm spacing-none spacing-none spacing-none"
        >
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
              <Skeleton isLoading borderRadius="radius-round">
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
                border-bottom: var(--border-sm) solid var(--pw-int-border-secondary-color);
              `}
            >
              <Skeleton isLoading>
                <Box height="12px" width="104px"></Box>
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
                      var(--pw-int-border-secondary-color);
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
          <Box
            display="flex"
            flexDirection="column"
            backgroundColor="pw-int-bg-primary-color"
            borderRadius="radius-md"
            width="98%"
            padding="spacing-xl spacing-lg spacing-lg spacing-lg"
            position="absolute"
            css={css`
              bottom: 2px;
              left: 3px;
              border-top: var(--border-xmd) solid var(--pw-int-border-secondary-color);
            `}
          >
            {content}
          </Box>
        </Box>
      </BoxLayout>
    </ContentLayout>
  );
};

// const slideUp = keyframes`
//   from {
//     transform: translateY(100%);
//   }
//   to {
//     transform: translateY(0);
//   }

// transition: transform 0.5s ease-in-out;
// animation: ${slideUp} 0.5s ease-out forwards;
// `;

export { WalletSkeletonScreen };
