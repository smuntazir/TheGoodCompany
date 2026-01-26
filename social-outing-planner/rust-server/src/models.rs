use serde::{Deserialize, Serialize};
use chrono::Utc;

// Helper for default date
fn default_date() -> String {
    Utc::now().to_rfc3339()
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub password: String,
    #[serde(default = "default_date", rename = "createdAt")]
    pub created_at: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct POI {
    #[serde(rename = "_id")]
    pub id: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub location: String,
    #[serde(default)]
    pub description: String,
    #[serde(default = "default_category")]
    pub category: String,
    #[serde(default = "default_date", rename = "createdAt")]
    pub created_at: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AOI {
    #[serde(rename = "_id")]
    pub id: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub duration: String,
    #[serde(default = "default_category")]
    pub category: String,
    #[serde(default = "default_date", rename = "createdAt")]
    pub created_at: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Event {
    #[serde(rename = "_id")]
    pub id: String,
    #[serde(rename = "userId")]
    pub user_id: String,
    #[serde(rename = "createdBy")]
    pub created_by: String,
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub date: String,
    #[serde(default, rename = "startTime")]
    pub start_time: String,
    #[serde(default, rename = "endTime")]
    pub end_time: String,
    #[serde(default)]
    pub description: String,
    #[serde(default, rename = "type")]
    pub event_type: String,
    pub location: Option<String>,
    pub duration: Option<serde_json::Value>,
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub start: String,
    #[serde(default)]
    pub end: String,
    #[serde(default, rename = "allDay")]
    pub all_day: bool,
    #[serde(default)]
    pub resource: Option<serde_json::Value>,
    #[serde(default, rename = "sharedWith")]
    pub shared_with: Vec<String>,
    #[serde(default = "default_date", rename = "createdAt")]
    pub created_at: String,
}

fn default_category() -> String {
    "other".to_string()
}
