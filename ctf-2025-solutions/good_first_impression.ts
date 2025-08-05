// ST_FLAG{k3yp41r_gr1nd1ng_ch4mp}
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import idl from "../good_first_impression.json" with { type: "json" }
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { test } from 'mocha';


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
  const program = new Program<GoodFirstImpression>(idl, provider);
 

  test("Test", async () => {
    const bo1t = findKeypairWithPrefix()
    async function sendSol({
      from = keypair,
      to = bo1t.publicKey,
      conn = connection,
      amountSol = 0.01,
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

    await sendSol({
      from: keypair,
      to: bo1t.publicKey,
      conn: connection,
      amountSol: 1,
    })

    const tx = new Transaction().add(
      await program.methods.getFlag().accountsStrict({
        signer: bo1t.publicKey
      }).instruction()
    )


    tx.feePayer = bo1t.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const sig = await sendAndConfirmTransaction(connection, tx, [bo1t], {
        skipPreflight: true,
        commitment: "finalized",
    }).catch((e) => {
      console.log("Error::",e)
    })
    /// open this signature in solscan or something, and you'll see a log with a flag
    console.log("Sig::",sig)
  })

})



export function findKeypairWithPrefix(prefix: string = 'bo1t'): Keypair {
  let attempts = 0;

  while (true) {
    const keypair = Keypair.generate();
    const pubkey = keypair.publicKey.toString();

    if (pubkey.startsWith(prefix)) {
      const secretKeyBase58 = bs58.encode(keypair.secretKey);
      console.log(`✅ Found matching Keypair after ${attempts} attempts`);
      console.log(`🔐 Secret Key (base58): ${secretKeyBase58}`);
      console.log(`📬 Public Key: ${pubkey}`);
      return keypair;
    }

    attempts++;
    if (attempts % 100000 === 0) {
      console.log(`🔄 Still searching... ${attempts} attempts made`);
    }
  }
}


/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/good_first_impression.json`.
 */
export type GoodFirstImpression = {
  "address": "4tzADDiVAKviEf1Yi7GDiKG21MmLPgwkjVtaGvtheVCy",
  "metadata": {
    "name": "goodFirstImpression",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "getFlag",
      "discriminator": [
        60,
        47,
        79,
        236,
        252,
        145,
        243,
        53
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorizedFlag",
      "msg": "Can't get flag."
    }
  ]
};
