use fuzz_transactions::*;
use trident_fuzz::fuzzing::*;
mod fuzz_transactions;
mod instructions;
mod transactions;
mod types;
pub use transactions::*;
use trident_one::entry as entry_trident_one;
#[derive(Default)]
struct FuzzTest<C> {
    client: C,
}
/// Use flows to specify custom sequences of behavior
/// #[init]
/// fn start(&mut self) {
///     // Initialization goes here
/// }
/// #[flow]
/// fn flow1(
///     &mut self,
///     fuzzer_data: &mut FuzzerData,
///     accounts: &mut FuzzAccounts,
/// ) -> Result<(), FuzzingError> {
///     // Flow logic goes here
///     Ok(())
/// }
#[flow_executor]
impl<C: FuzzClient + std::panic::RefUnwindSafe> FuzzTest<C> {
    fn new(client: C) -> Self {
        Self { client }
    }
    #[init]
    fn start(&mut self) {
        self.client.deploy_native_program(ProgramEntrypoint::new(
            pubkey!("6yxyBEwKowMWfYkuvUi9USF8coef9r55MqPfYouCmg3w"),
            None,
            processor!(entry_trident_one),
        ));
    }
}
fn main() {
    let client = TridentSVM::new_client(&[], &TridentConfig::new());
    FuzzTest::new(client).fuzz();
}
