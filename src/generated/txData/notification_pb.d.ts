// package: push
// file: txData/notification.proto

import * as jspb from "google-protobuf";

export class Notification extends jspb.Message {
  getApp(): string;
  setApp(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  getChannelurl(): string;
  setChannelurl(value: string): void;

  getActionurl(): string;
  setActionurl(value: string): void;

  getImg(): string;
  setImg(value: string): void;

  getIcon(): string;
  setIcon(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Notification.AsObject;
  static toObject(includeInstance: boolean, msg: Notification): Notification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Notification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Notification;
  static deserializeBinaryFromReader(message: Notification, reader: jspb.BinaryReader): Notification;
}

export namespace Notification {
  export type AsObject = {
    app: string,
    title: string,
    body: string,
    channelurl: string,
    actionurl: string,
    img: string,
    icon: string,
  }
}

export class EncryptionDetails extends jspb.Message {
  getRecipientdid(): string;
  setRecipientdid(value: string): void;

  getType(): EncryptionTypeMap[keyof EncryptionTypeMap];
  setType(value: EncryptionTypeMap[keyof EncryptionTypeMap]): void;

  getKeyindex(): number;
  setKeyindex(value: number): void;

  getEncryptedsecret(): Uint8Array | string;
  getEncryptedsecret_asU8(): Uint8Array;
  getEncryptedsecret_asB64(): string;
  setEncryptedsecret(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncryptionDetails.AsObject;
  static toObject(includeInstance: boolean, msg: EncryptionDetails): EncryptionDetails.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncryptionDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncryptionDetails;
  static deserializeBinaryFromReader(message: EncryptionDetails, reader: jspb.BinaryReader): EncryptionDetails;
}

export namespace EncryptionDetails {
  export type AsObject = {
    recipientdid: string,
    type: EncryptionTypeMap[keyof EncryptionTypeMap],
    keyindex: number,
    encryptedsecret: Uint8Array | string,
  }
}

export class EncryptedNotif extends jspb.Message {
  getEncryptednotif(): Uint8Array | string;
  getEncryptednotif_asU8(): Uint8Array;
  getEncryptednotif_asB64(): string;
  setEncryptednotif(value: Uint8Array | string): void;

  hasSourceenc(): boolean;
  clearSourceenc(): void;
  getSourceenc(): EncryptionDetails | undefined;
  setSourceenc(value?: EncryptionDetails): void;

  clearTargetencList(): void;
  getTargetencList(): Array<EncryptionDetails>;
  setTargetencList(value: Array<EncryptionDetails>): void;
  addTargetenc(value?: EncryptionDetails, index?: number): EncryptionDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EncryptedNotif.AsObject;
  static toObject(includeInstance: boolean, msg: EncryptedNotif): EncryptedNotif.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EncryptedNotif, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EncryptedNotif;
  static deserializeBinaryFromReader(message: EncryptedNotif, reader: jspb.BinaryReader): EncryptedNotif;
}

export namespace EncryptedNotif {
  export type AsObject = {
    encryptednotif: Uint8Array | string,
    sourceenc?: EncryptionDetails.AsObject,
    targetencList: Array<EncryptionDetails.AsObject>,
  }
}

export interface EncryptionTypeMap {
  ENCRYPTION_UNSPECIFIED: 0;
  ECC: 1;
}

export const EncryptionType: EncryptionTypeMap;

