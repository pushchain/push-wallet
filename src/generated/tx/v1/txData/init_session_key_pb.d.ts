// package: tx.v1
// file: tx/v1/txData/init_session_key.proto

import * as jspb from "google-protobuf";

export class SessionKeyAction extends jspb.Message {
  getKeyindex(): number;
  setKeyindex(value: number): void;

  getKeyaddress(): string;
  setKeyaddress(value: string): void;

  getAction(): KeyActionMap[keyof KeyActionMap];
  setAction(value: KeyActionMap[keyof KeyActionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SessionKeyAction.AsObject;
  static toObject(includeInstance: boolean, msg: SessionKeyAction): SessionKeyAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SessionKeyAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SessionKeyAction;
  static deserializeBinaryFromReader(message: SessionKeyAction, reader: jspb.BinaryReader): SessionKeyAction;
}

export namespace SessionKeyAction {
  export type AsObject = {
    keyindex: number,
    keyaddress: string,
    action: KeyActionMap[keyof KeyActionMap],
  }
}

export interface KeyActionMap {
  UNSPECIFIED: 0;
  PUBLISH_KEY: 1;
  REVOKE_KEY: 2;
}

export const KeyAction: KeyActionMap;

