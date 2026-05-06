use super::GameModule;

pub struct FH4Module;

impl GameModule for FH4Module {
    fn target_process_name(&self) -> &'static str {
        "ForzaHorizon4.exe"
    }

    fn discord_client_id(&self) -> &'static str {
        "1501483341164183562"
    }

    fn uwp_package_name(&self) -> &'static str {
        "Microsoft.SunriseBaseGame_8wekyb3d8bbwe"
    }

    fn game_name(&self) -> &'static str {
        "Forza Horizon 4"
    }
}
