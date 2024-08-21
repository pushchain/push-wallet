// package: push
// file: txData/init_did.proto

import * as jspb from "google-protobuf";

export class InitDid extends jspb.Message {
  getDid(): string;
  setDid(value: string): void;

  getMasterpubkey(): string;
  setMasterpubkey(value: string): void;

  getDerivedkeyindex(): number;
  setDerivedkeyindex(value: number): void;

  getDerivedpubkey(): string;
  setDerivedpubkey(value: string): void;

  getEncderivedprivkey(): string;
  setEncderivedprivkey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitDid.AsObject;
  static toObject(includeInstance: boolean, msg: InitDid): InitDid.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InitDid, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitDid;
  static deserializeBinaryFromReader(message: InitDid, reader: jspb.BinaryReader): InitDid;
}

export namespace InitDid {
  export type AsObject = {
    did: string,
    masterpubkey: string,
    derivedkeyindex: number,
    derivedpubkey: string,
    encderivedprivkey: string,
  }
}

