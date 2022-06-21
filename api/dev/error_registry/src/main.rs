use core_processor::common::ExecutionErrorReason;
use codec::Encode;
use scale_info::{MetaType, PortableRegistry, Registry};
use std::{fs::File, io::{prelude::*, Result}};

fn main() -> Result<()> {
    let mut registry = Registry::new();
    registry.register_types(vec![MetaType::new::<ExecutionErrorReason>()]);

    let registry: PortableRegistry = registry.into();
    let result = hex::encode(registry.encode());

    let mut file = File::create("registry")?;
    file.write_all(result.as_ref())?;

    Ok(())
}
