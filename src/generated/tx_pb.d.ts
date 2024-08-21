// package: push
// file: tx.proto

import * as jspb from "google-protobuf";

export class Transaction extends jspb.Message {
  getType(): number;
  setType(value: number): void;

  getCategory(): string;
  setCategory(value: string): void;

  getSource(): string;
  setSource(value: string): void;

  clearRecipientsList(): void;
  getRecipientsList(): Array<string>;
  setRecipientsList(value: Array<string>): void;
  addRecipients(value: string, index?: number): string;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getSalt(): Uint8Array | string;
  getSalt_asU8(): Uint8Array;
  getSalt_asB64(): string;
  setSalt(value: Uint8Array | string): void;

  getApitoken(): Uint8Array | string;
  getApitoken_asU8(): Uint8Array;
  getApitoken_asB64(): string;
  setApitoken(value: Uint8Array | string): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  getFee(): string;
  setFee(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    type: number,
    category: string,
    source: string,
    recipientsList: Array<string>,
    data: Uint8Array | string,
    salt: Uint8Array | string,
    apitoken: Uint8Array | string,
    signature: Uint8Array | string,
    fee: string,
  }
}

