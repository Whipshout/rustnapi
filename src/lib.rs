#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use napi::{CallContext, JsNumber, JsObject, JsString, Result};
use rand::RngCore;
use sha2::{Digest, Sha256};

#[module_exports]
fn init(mut exports: JsObject) -> Result<()> {
    exports.create_named_method("generateHashRs", generate_hash)?;
    exports.create_named_method("generateHashesApiRs", generate_hashes_api)?;

    Ok(())
}

#[js_function(1)]
fn generate_hashes_api(ctx: CallContext) -> Result<JsNumber> {
    let number: i64 = ctx.get::<JsNumber>(0)?.try_into()?;

    let mut all_data = vec![];

    for _ in 0..number {
        let mut data = [0u8; 18];
        rand::thread_rng().fill_bytes(&mut data);
        all_data.push(data);
    }

    for data in all_data.iter() {
        let hash = Sha256::digest(data);

        let _hash = format!("{:x}", hash);
    }

    ctx.env.create_uint32(0)
}

#[js_function(1)]
fn generate_hash(ctx: CallContext) -> Result<JsString> {
    let input_string = ctx.get::<JsString>(0)?.into_utf8()?;

    let hash = Sha256::digest(input_string.as_slice());

    let output = format!("{:x}", hash);

    ctx.env.create_string(output.as_str())
}
