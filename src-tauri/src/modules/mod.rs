pub mod fh4;

pub trait GameModule: Send + Sync {
    fn target_process_name(&self) -> &'static str;
    fn discord_client_id(&self) -> &'static str;
    fn uwp_package_name(&self) -> &'static str;
    fn game_name(&self) -> &'static str;
}
