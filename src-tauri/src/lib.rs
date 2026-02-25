mod server;
use local_ip_address::local_ip;

#[tauri::command]
fn get_stream_url() -> String {
    if let Ok(ip) = local_ip() {
        format!("https://{}:4104", ip.to_string())
    } else {
        "https://localhost:4104".to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_stream_url])
        .setup(|app| {
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                server::start_server(app_handle, 4104).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
