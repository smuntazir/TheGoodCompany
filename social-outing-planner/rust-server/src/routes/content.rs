use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use crate::{
    models::{AOI, POI},
    state::AppState,
    utils::{generate_id, AuthUser},
};

// DTOs
#[derive(Deserialize)]
pub struct CreatePOIRequest {
    #[serde(default)]
    name: String,
    #[serde(default)]
    location: String,
    #[serde(default)]
    description: String,
    #[serde(default)]
    category: String,
}

#[derive(Deserialize)]
pub struct CreateAOIRequest {
    #[serde(default)]
    name: String,
    #[serde(default)]
    description: String,
    #[serde(default)]
    duration: Option<String>,
    #[serde(default)]
    category: String,
}

// POI Handlers
pub async fn get_pois(
    State(state): State<AppState>,
    auth: AuthUser,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let pois: Vec<POI> = state.pois_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let user_pois: Vec<POI> = pois.into_iter().filter(|p| p.user_id == auth.user_id).collect();
    Ok(Json(user_pois))
}

pub async fn create_poi(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(payload): Json<CreatePOIRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let mut pois: Vec<POI> = state.pois_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let new_poi = POI {
        id: generate_id(),
        user_id: auth.user_id,
        name: payload.name,
        location: payload.location,
        description: payload.description,
        category: payload.category,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    pois.push(new_poi.clone());
    state.pois_store.write(&pois).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(new_poi))
}

pub async fn delete_poi(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(poi_id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let pois: Vec<POI> = state.pois_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let filtered_pois: Vec<POI> = pois.into_iter()
        .filter(|p| !(p.id == poi_id && p.user_id == auth.user_id))
        .collect();
    
    // Note: This logic follows Python: if POI doesn't exist or not owned, it effectively does nothing but writes back.
    // Ideally we should return 404/403 but Python impl just filters.
    
    state.pois_store.write(&filtered_pois).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(serde_json::json!({ "message": "POI deleted successfully" })))
}

// AOI Handlers
pub async fn get_aois(
    State(state): State<AppState>,
    auth: AuthUser,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let aois: Vec<AOI> = state.aois_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let user_aois: Vec<AOI> = aois.into_iter().filter(|a| a.user_id == auth.user_id).collect();
    Ok(Json(user_aois))
}

pub async fn create_aoi(
    State(state): State<AppState>,
    auth: AuthUser,
    Json(payload): Json<CreateAOIRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let mut aois: Vec<AOI> = state.aois_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let new_aoi = AOI {
        id: generate_id(),
        user_id: auth.user_id,
        name: payload.name,
        description: payload.description,
        duration: payload.duration.unwrap_or_default(),
        category: payload.category,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    aois.push(new_aoi.clone());
    state.aois_store.write(&aois).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(new_aoi))
}

pub async fn delete_aoi(
    State(state): State<AppState>,
    auth: AuthUser,
    Path(aoi_id): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let aois: Vec<AOI> = state.aois_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let filtered_aois: Vec<AOI> = aois.into_iter()
        .filter(|a| !(a.id == aoi_id && a.user_id == auth.user_id))
        .collect();
    
    state.aois_store.write(&filtered_aois).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(serde_json::json!({ "message": "AOI deleted successfully" })))
}
