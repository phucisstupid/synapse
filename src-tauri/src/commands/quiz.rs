use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct QuizData {
    pub id: String,
    pub topic: String,
    pub score: Option<i32>,
}

#[tauri::command]
pub fn save_quiz(quiz: QuizData) -> String {
    format!("Quiz saved: {} - {}", quiz.topic, quiz.id)
}

#[tauri::command]
pub fn get_quizzes() -> Vec<QuizData> {
    vec![]
}
