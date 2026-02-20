use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StudySessionData {
    pub id: String,
    pub subject: String,
    pub completed: bool,
}

#[tauri::command]
pub fn save_session(session: StudySessionData) -> String {
    format!("Session saved: {} - {}", session.subject, session.id)
}

#[tauri::command]
pub fn get_sessions() -> Vec<StudySessionData> {
    vec![]
}
