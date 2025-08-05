// flag :  ST_FLAG{1sol_2sol_3sol_truth}
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import idl from "../idl.json" with { type: "json" }
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { test } from 'mocha';
import * as anchor from "@coral-xyz/anchor";

describe("Ghost test", () => {

  const connection = new Connection('https://api.devnet.solana.com'); // or devnet/localnet
  const secretKey = bs58.decode("") // Enter your secret key here
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey))
  const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
  } as Wallet;


  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  const program = new Program<LogsOfTruth>(idl, provider);

  test("Test", async () => {


    let secretNumber = LAMPORTS_PER_SOL; // The hint is in the "From SOL to lamports", meaning, that the secret number is 1 sol in lampor
    console.log("Secret Number::", secretNumber)
    // Let it loop, and whenever you get a the right signature, you'll probably get part of the flag
    while (secretNumber < 10_000_000_000) {
      try {
        const tx = new Transaction().add(
          await program.methods
          .verifyNumber(new anchor.BN(secretNumber))
          .accountsStrict({
            signer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
          
        )
        tx.feePayer = keypair.publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const sig = await sendAndConfirmTransaction(connection, tx, [keypair], {
          skipPreflight: true,
          commitment: "finalized",
        })
        console.log("Sig::", sig)
        secretNumber += 1_000_000_000;
      } catch (error) { 
        console.log("Error: ", error);
        secretNumber += 1_000_000_000;
      }

    }
  })

})

async function sendSol({
  from,
  to,
  conn,
  amountSol
}: {
  from?: Keypair;
  to?: PublicKey;
  conn?: Connection;
  amountSol?: number;
}) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: amountSol * LAMPORTS_PER_SOL,
    })
  );

  const sig = await sendAndConfirmTransaction(conn, tx, [from]);
  console.log(`✅ Sent ${amountSol} SOL from ${from.publicKey.toBase58()} to ${to.toBase58()}`);
  console.log(`🔗 Tx Signature: ${sig}`);

  return sig;
}
/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/logs_of_truth.json`.
 */
export type LogsOfTruth = {
  "address": "5zzgo53dmRCCwrxX3q7UDmssW26Gh4f7Y8J2mEE7Rvds",
  "metadata": {
    "name": "logsOfTruth",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "verifyNumber",
      "discriminator": [
        200,
        160,
        118,
        108,
        184,
        9,
        136,
        137
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "input",
          "type": "u64"
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "tooSmall",
      "msg": "Number must be at least 1,000,000"
    },
    {
      "code": 6001,
      "name": "tooLarge",
      "msg": "Number must be at most 10,000,000,000"
    },
    {
      "code": 6002,
      "name": "notCleanAmount",
      "msg": "Number must end with 0s"
    },
    {
      "code": 6003,
      "name": "invalidSolAmount",
      "msg": "Invalid Amount"
    }
  ]
};

