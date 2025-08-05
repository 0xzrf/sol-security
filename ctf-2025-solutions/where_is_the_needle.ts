// ST_FLAG{pda_hunt1ng_m4st3r}
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Keypair, Connection } from '@solana/web3.js';
import secret from "../secret.json" with {type: "json"}
import { test } from 'mocha';
import { AnchorProvider, Wallet, Program } from '@coral-xyz/anchor';
import {WhereIsTheNeedle} from "../target/types/where_is_the_needle"
import * as anchor from "@coral-xyz/anchor"

// Download the lib.rs and save it in a anchor worspace in place of the actual lib.rs, compile it and get the following types
describe("Ghost test", () => {
  const connection = new Connection('https://api.devnet.solana.com');

  const secretKey = bs58.decode(secret.privateKey); // keypair used for wallet
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

  const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
  } as Wallet;
  
  // const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.whereIsTheNeedle as Program<WhereIsTheNeedle>;

  test("Flags", async () => {
    console.log(program.programId.toString())
    const accs = await program.account.flagAccount.all()

    // This should log the flag. Unfortunately for me, I picked this Challenge first, and didn't know the pattern of the flag
    accs.map(flag => {
      const data = new Uint8Array(flag.account.flag);
      
      // Option 1: Strip trailing nulls (recommended)
      const trimmed = data.slice(0, data.indexOf(0));
      const decoded = new TextDecoder().decode(trimmed);
      if (decoded.startsWith("ST_FLAG")) {
        console.log(decoded)
      }
    })

  });
});
