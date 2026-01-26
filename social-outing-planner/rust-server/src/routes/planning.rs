use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use serde_json::Value;
use crate::{
    models::Event,
    state::AppState,
    utils::{generate_id, AuthUser},
};

// DTOs
#[derive(Deserialize)]
pub struct CreateEventRequest {
    #[serde(default)]
    title: String,
    #[serde(default)]
    date: String,
    #[serde(default, rename = "startTime")]
    start_time: String,
    #[serde(default, rename = "endTime")]
    end_time: String,
    #[serde(default)]
    description: String,
    #[serde(default, rename = "type")]
    event_type: String,
    location: Option<String>,
    duration: Option<serde_json::Value>,
    #[serde(default)]
    category: String,
    #[serde(default)]
    start: String,
    #[serde(default)]
    end: String,
    #[serde(default, rename = "allDay")]
    all_day: bool,
    resource: Option<Value>,
    #[serde(rename = "sharedWith")]
    shared_with: Option<Vec<String>>,
}

pub async fn get_events(
    State(state): State<AppState>,
    auth: AuthUser,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let events: Vec<Event> = state.events_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let user_events: Vec<Event> = events.into_iter()
        .filter(|e| e.user_id == auth.user_id || e.shared_with.contains(&auth.user_id))
        .collect();
        
    Ok(Json(user_events))
}

pub async fn create_event(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(payload): Json<CreateEventRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let mut events: Vec<Event> = state.events_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let new_event = Event {
        id: generate_id(),
        user_id: auth.user_id,
        created_by: auth.username,
        title: payload.title,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        description: payload.description,
        event_type: payload.event_type,
        location: payload.location,
        duration: payload.duration,
        category: payload.category,
        start: payload.start,
        end: payload.end,
        all_day: payload.all_day,
        resource: payload.resource,
        shared_with: payload.shared_with.unwrap_or_default(),
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    events.push(new_event.clone());
    state.events_store.write(&events).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(new_event))
}

pub async fn delete_event(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(event_id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let events: Vec<Event> = state.events_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    // Check ownership before deleting
    let event = events.iter().find(|e| e.id == event_id);
    if let Some(e) = event {
        if e.user_id != auth.user_id {
            return Err((StatusCode::FORBIDDEN, "Only the event creator can delete this event".to_string()));
        }
    } else {
        return Err((StatusCode::NOT_FOUND, "Event not found".to_string()));
    }

    let filtered_events: Vec<Event> = events.into_iter()
        .filter(|e| e.id != event_id)
        .collect();

    state.events_store.write(&filtered_events).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(serde_json::json!({ "message": "Event deleted successfully" })))
}
