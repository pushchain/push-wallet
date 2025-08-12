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

const rpcURL = 'https://evm.rpc-testnet-donut-node1.push.org';
const factoryAddress = '0x00000000000000000000000000000000000000eA';

const useUEAOrigin = (addressHash: string | null | undefined): ReturnValue => {
    const [ueaOrigin, setUEAOrigin] = useState<UEAOrigin | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!addressHash) return;

        const fetchOrigin = async () => {
            setIsLoading(true);

            try {
                const provider = new ethers.JsonRpcProvider(rpcURL);
                const factory = new ethers.Contract(
                    factoryAddress,
                    IUEAFactoryABI,
                    provider,
                );

                const result = await factory.getOriginForUEA(addressHash);
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
                setUEAOrigin(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrigin();
    }, [addressHash]);

    return { ueaOrigin, isLoading };
};

export default useUEAOrigin;
