import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { PRIVATE_KEY, TOKEN_MINT_ADDRESS } from "../config/index.js";
import {
  createBurnCheckedInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com");
const secret = new Uint8Array(PRIVATE_KEY as any);
const wallet = Keypair.fromSecretKey(secret);
const mint = new PublicKey(TOKEN_MINT_ADDRESS as any);

export const mintTokens = async (fromAddress: string, amount: number) => {
  const recipient = new PublicKey(fromAddress);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    recipient,
    false,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  await mintTo(
    connection,
    wallet,
    mint,
    tokenAccount.address,
    wallet.publicKey,
    amount,
    [],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
};

export const burnToken = async (fromAddress: string, amount: number) => {
  const owner = wallet.publicKey;

  const tokenAccount = await getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const transaction = new Transaction().add(
    createBurnCheckedInstruction(
      tokenAccount,
      mint,
      owner,
      amount,
      9,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    wallet,
  ]);

  console.log("burned tokens txns: ", signature);
};

export const sendNativeToken = async (toAddress: string, amount: number) => {
  const recipient = new PublicKey(toAddress);

  const transaction = new Transaction().add(
    createTransferInstruction(
      wallet.publicKey,
      recipient,
      wallet.publicKey,
      amount * 1e9
    )
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    wallet,
  ]);

  console.log("SOL SENT: ", signature);
};
