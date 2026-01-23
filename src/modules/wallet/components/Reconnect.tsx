import { Reauthentication } from "./Reauthentication";
import { DrawerWrapper } from "../../../common/components";
import { getAppParamValue } from "../../../common/Common.utils";
import { useGlobalState } from "../../../context/GlobalContext";
import { useEventEmitterContext } from "../../../context/EventEmitterContext";

export interface AuthParams {
    state: string;
    challengeId: string;
    email: string;
}

const Reconnect = () => {
    const isOpenedInIframe = !!getAppParamValue();
    const { handleCancelAppConnection } = useEventEmitterContext();

    const { state } = useGlobalState();

    if (!isOpenedInIframe) {
        return;
    }

    return (
        <>
            {state.reconnect && (
                <DrawerWrapper>
                    <Reauthentication onCancel={() => handleCancelAppConnection()} />
                </DrawerWrapper>
            )}
        </>
    );
}

export {Reconnect};