// package: push
// file: block.proto

import * as jspb from "google-protobuf";
import * as tx_pb from "./tx_pb";

export class DidMapping extends jspb.Message {
  getDidmappingMap(): jspb.Map<string, string>;
  clearDidmappingMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DidMapping.AsObject;
  static toObject(includeInstance: boolean, msg: DidMapping): DidMapping.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DidMapping, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DidMapping;
  static deserializeBinaryFromReader(message: DidMapping, reader: jspb.BinaryReader): DidMapping;
}

export namespace DidMapping {
  export type AsObject = {
    didmappingMap: Array<[string, string]>,
  }
}

export class TxValidatorData extends jspb.Message {
  getVote(): VoteMap[keyof VoteMap];
  setVote(value: VoteMap[keyof VoteMap]): void;

  hasDidmapping(): boolean;
  clearDidmapping(): void;
  getDidmapping(): DidMapping | undefined;
  setDidmapping(value?: DidMapping): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxValidatorData.AsObject;
  static toObject(includeInstance: boolean, msg: TxValidatorData): TxValidatorData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxValidatorData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxValidatorData;
  static deserializeBinaryFromReader(message: TxValidatorData, reader: jspb.BinaryReader): TxValidatorData;
}

export namespace TxValidatorData {
  export type AsObject = {
    vote: VoteMap[keyof VoteMap],
    didmapping?: DidMapping.AsObject,
  }
}

export class TxAttestorData extends jspb.Message {
  getVote(): VoteMap[keyof VoteMap];
  setVote(value: VoteMap[keyof VoteMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TxAttestorData.AsObject;
  static toObject(includeInstance: boolean, msg: TxAttestorData): TxAttestorData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TxAttestorData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TxAttestorData;
  static deserializeBinaryFromReader(message: TxAttestorData, reader: jspb.BinaryReader): TxAttestorData;
}

export namespace TxAttestorData {
  export type AsObject = {
    vote: VoteMap[keyof VoteMap],
  }
}

export class TransactionObj extends jspb.Message {
  hasTx(): boolean;
  clearTx(): void;
  getTx(): tx_pb.Transaction | undefined;
  setTx(value?: tx_pb.Transaction): void;

  hasValidatordata(): boolean;
  clearValidatordata(): void;
  getValidatordata(): TxValidatorData | undefined;
  setValidatordata(value?: TxValidatorData): void;

  clearAttestordataList(): void;
  getAttestordataList(): Array<TxAttestorData>;
  setAttestordataList(value: Array<TxAttestorData>): void;
  addAttestordata(value?: TxAttestorData, index?: number): TxAttestorData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionObj.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionObj): TransactionObj.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionObj, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionObj;
  static deserializeBinaryFromReader(message: TransactionObj, reader: jspb.BinaryReader): TransactionObj;
}

export namespace TransactionObj {
  export type AsObject = {
    tx?: tx_pb.Transaction.AsObject,
    validatordata?: TxValidatorData.AsObject,
    attestordataList: Array<TxAttestorData.AsObject>,
  }
}

export class Signer extends jspb.Message {
  getNode(): string;
  setNode(value: string): void;

  getRole(): RoleMap[keyof RoleMap];
  setRole(value: RoleMap[keyof RoleMap]): void;

  getSig(): string;
  setSig(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Signer.AsObject;
  static toObject(includeInstance: boolean, msg: Signer): Signer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Signer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Signer;
  static deserializeBinaryFromReader(message: Signer, reader: jspb.BinaryReader): Signer;
}

export namespace Signer {
  export type AsObject = {
    node: string,
    role: RoleMap[keyof RoleMap],
    sig: string,
  }
}

export class Block extends jspb.Message {
  getTs(): number;
  setTs(value: number): void;

  clearTxobjList(): void;
  getTxobjList(): Array<TransactionObj>;
  setTxobjList(value: Array<TransactionObj>): void;
  addTxobj(value?: TransactionObj, index?: number): TransactionObj;

  clearSignersList(): void;
  getSignersList(): Array<Signer>;
  setSignersList(value: Array<Signer>): void;
  addSigners(value?: Signer, index?: number): Signer;

  getAttesttoken(): Uint8Array | string;
  getAttesttoken_asU8(): Uint8Array;
  getAttesttoken_asB64(): string;
  setAttesttoken(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    ts: number,
    txobjList: Array<TransactionObj.AsObject>,
    signersList: Array<Signer.AsObject>,
    attesttoken: Uint8Array | string,
  }
}

export interface RoleMap {
  ROLE_UNSPECIFIED: 0;
  VALIDATOR: 1;
  ATTESTER: 2;
}

export const Role: RoleMap;

export interface VoteMap {
  VOTE_UNSPECIFIED: 0;
  ACCEPTED: 1;
  REJECTED: 2;
}

export const Vote: VoteMap;

