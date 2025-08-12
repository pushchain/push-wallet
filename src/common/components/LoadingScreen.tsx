import React, { ReactNode } from 'react';
import { Box, Skeleton } from 'blocks';
import { css } from 'styled-components';

const ROWS = 10;

const LoadingScreen = ({ content }: { content: ReactNode }) => {
    return (
        <>
            <Box
                alignItems="start"
                flexDirection="column"
                display="flex"
                height="570px"
                justifyContent="start"
                gap="spacing-xs"
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
        </>
    );
};

export { LoadingScreen };