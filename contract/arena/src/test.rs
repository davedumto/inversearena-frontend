#[cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ArenaContract);
    let client = ArenaContractClient::new(&env, &contract_id);

    assert_eq!(client.hello(), 123);
}

#[test]
fn data_model_doc_covers_required_sections() {
    let doc = include_str!("../../DATA_MODEL.md");

    assert!(doc.contains("## Storage Key Inventory"));
    assert!(doc.contains("## TTL Policy Baseline"));
    assert!(doc.contains("## Access Pattern Matrix"));
    assert!(doc.contains("## ER-Style State Diagram"));
    assert!(doc.contains("No custom Soroban storage keys are currently defined or used."));
}
