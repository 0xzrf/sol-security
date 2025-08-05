// flag: ST_FLAG{ep0ch_0}
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import idl from "../idl.json" with { type: "json" }
import secret from "../secret.json" with { type: "json" }
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { test } from 'mocha';


describe("Ghost test", () => {

  const connection = new Connection('https://api.devnet.solana.com'); // or devnet/localnet
  const secretKey = bs58.decode(secret.privateKey) // Enter your secret key here
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey))
  const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
  } as Wallet;


  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  const program = new Program<TheBirthdaySeed>(idl, provider);

  test("Test", async () => {

    // The reveal function is a distraction. Just get the vault and get the flag stored inside of them
      const allVaults = await program.account.vault.all();

      allVaults.map((val) => {
        console.log(val.account.flag.toString())
      })
  })

})



/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/the_birthday_seed.json`.
 */
export type TheBirthdaySeed = {
  "address": "6V3rGaqVZakNJtvCFAHpz77LWgyBVf4uPSESDnh7dwsn",
  "metadata": {
    "name": "theBirthdaySeed",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "reveal",
      "discriminator": [
        9,
        35,
        59,
        190,
        167,
        249,
        76,
        115
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "seedHint"
              }
            ]
          }
        },
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
          "name": "seedHint",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidSeed",
      "msg": "Invalid seed provided. Keep searching..."
    }
  ],
  "types": [
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "flag",
            "type": "string"
          },
          {
            "name": "discoverer",
            "type": "pubkey"
          },
          {
            "name": "discoveredAt",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
