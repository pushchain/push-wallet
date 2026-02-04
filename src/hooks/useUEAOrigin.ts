import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const IUEAFactoryABI = [
    'function getOriginForUEA(address addr) view returns (tuple(string chainNamespace, string chainId, bytes owner) account, bool isUEA)',
];

type UEAOrigin = {
    owner: string;
    isUEA: boolean;
    chainId: string;
};

type ReturnValue = {
    ueaOrigin: UEAOrigin | null;
    isLoading: boolean;
};

const rpcURL = 'https://evm.donut.rpc.push.org/';
const factoryAddress = '0x00000000000000000000000000000000000000eA';
const COOLDOWN_MS = 30_000;
let last429 = 0;

const provider = new ethers.JsonRpcProvider(rpcURL, undefined, {
  staticNetwork: true,
  polling: false,
});

const useUEAOrigin = (addressHash: string | null | undefined): ReturnValue => {
    const [ueaOrigin, setUEAOrigin] = useState<UEAOrigin | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!addressHash) return;

        if (last429 !== 0 && Date.now() - last429 < COOLDOWN_MS) {
            return;
        }

        let cancelled = false;

        const fetchOrigin = async () => {
            setIsLoading(true);

            try {
                const factory = new ethers.Contract(
                    factoryAddress,
                    IUEAFactoryABI,
                    provider,
                );

                const result = await factory.getOriginForUEA(addressHash);

                if (cancelled) return;

                const account = result.account;
                const isUEA = result.isUEA;

                // Format owner as 0x string (if needed)
                const ownerHex = ethers.hexlify(account.owner);

                setUEAOrigin({
                    owner: ownerHex,
                    isUEA,
                    chainId: account.chainId,
                });
            } catch (err) {
                if (err?.status === 429) {
                    last429 = Date.now();
                }

                if (!cancelled) {
                    setUEAOrigin(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchOrigin();

        return () => {
            cancelled = true;
        };
    }, [addressHash]);

    return { ueaOrigin, isLoading };
};

export default useUEAOrigin;
