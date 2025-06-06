// React + Web3 Essentials
import { useEffect, useState } from 'react';

export function useDeviceWidthCheck(deviceWidth: number) {
    const [width, setWidth] = useState<number>(window.outerWidth);

    function handleWindowSizeChange() {
        setWidth(window.outerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    // if (log) console.log(deviceWidth, width, width <= deviceWidth);
    return width <= deviceWidth;
}