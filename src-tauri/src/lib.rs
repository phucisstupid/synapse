pub mod commands;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            crate::commands::get_app_info,
            crate::commands::save_quiz,
            crate::commands::get_quizzes,
            crate::commands::save_session,
            crate::commands::get_sessions,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
