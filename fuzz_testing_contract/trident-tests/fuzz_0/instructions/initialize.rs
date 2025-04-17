use crate::fuzz_transactions::FuzzAccounts;
use crate::types::*;
use borsh::{BorshDeserialize, BorshSerialize};
use trident_fuzz::fuzzing::*;

#[derive(Arbitrary, TridentInstruction)]
#[program_id("6yxyBEwKowMWfYkuvUi9USF8coef9r55MqPfYouCmg3w")]
# [discriminator ([175u8 , 175u8 , 109u8 , 31u8 , 13u8 , 152u8 , 155u8 , 237u8 ,])]
pub struct InitializeInstruction {
    pub accounts: InitializeInstructionAccounts,
    pub data: InitializeInstructionData,
}

/// Instruction Accounts
#[derive(Arbitrary, Debug, Clone, TridentAccounts)]
#[instruction_data(InitializeInstructionData)]
#[storage(FuzzAccounts)]
pub struct InitializeInstructionAccounts {
    #[account(mut, signer)]
    signer: TridentAccount,
    #[account(mut)]
    asset: TridentAccount,
    #[account(mut, signer)]
    mint: TridentAccount,
    #[account(mut)]
    metadata_account: TridentAccount,
    #[account(address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")]
    mpl_token_metadata: TridentAccount,
    #[account(address = "11111111111111111111111111111111")]
    system_program: TridentAccount,
    #[account(address = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")]
    token_program: TridentAccount,
}

/// Instruction Data
#[derive(Arbitrary, Debug, BorshDeserialize, BorshSerialize, Clone)]
pub struct InitializeInstructionData {
    input1: u8,
    input2: u8,
    name: String,
    symbol: String,
    uri: String,
}
/// Implementation of instruction setters for fuzzing
///
/// Provides methods to:
/// - Set instruction data during fuzzing
/// - Configure instruction accounts during fuzzing
/// - (Optional) Set remaining accounts during fuzzing
///
/// Docs: https://ackee.xyz/trident/docs/latest/start-fuzzing/writting-fuzz-test/
impl InstructionHooks for InitializeInstruction {
    type IxAccounts = FuzzAccounts;
    fn set_data(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
    fn set_accounts(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
}
