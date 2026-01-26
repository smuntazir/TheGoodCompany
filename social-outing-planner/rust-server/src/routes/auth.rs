use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use crate::{
    models::User,
    state::AppState,
    utils::{create_jwt, generate_id, hash_password, verify_password, AuthUser},
};

// Request DTOs
#[derive(Deserialize)]
pub struct RegisterRequest {
    username: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    token: String,
    user: UserResponse,
}

#[derive(Serialize)]
pub struct UserResponse {
    id: String,
    username: String,
    email: String,
}

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.username.is_empty() || payload.email.is_empty() || payload.password.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Missing required fields".to_string()));
    }

    // Read users
    let mut users: Vec<User> = state.users_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Check existing
    if users.iter().any(|u| u.email == payload.email || u.username == payload.username) {
        return Err((StatusCode::BAD_REQUEST, "User already exists".to_string()));
    }

    let hashed_pw = hash_password(&payload.password).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let user_id = generate_id();
    let new_user = User {
        id: user_id.clone(),
        username: payload.username.clone(),
        email: payload.email.clone(),
        password: hashed_pw,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    users.push(new_user.clone());
    state.users_store.write(&users).await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let token = create_jwt(&user_id, &payload.username).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(AuthResponse {
        token,
        user: UserResponse {
            id: new_user.id,
            username: new_user.username,
            email: new_user.email,
        },
    }))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.email.is_empty() || payload.password.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Missing email or password".to_string()));
    }

    let users: Vec<User> = state.users_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    let user = users.iter().find(|u| u.email == payload.email).ok_or((StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()))?;

    if !verify_password(&payload.password, &user.password).unwrap_or(false) {
        return Err((StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()));
    }

    let token = create_jwt(&user.id, &user.username).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(AuthResponse {
        token,
        user: UserResponse {
            id: user.id.clone(),
            username: user.username.clone(),
            email: user.email.clone(),
        },
    }))
}

pub async fn get_users(
    State(state): State<AppState>,
    auth: AuthUser,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let users: Vec<User> = state.users_store.read().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let safe_users: Vec<UserResponse> = users.into_iter()
        .filter(|u| u.id != auth.user_id)
        .map(|u| UserResponse {
            id: u.id,
            username: u.username,
            email: u.email,
        })
        .collect();

    Ok(Json(safe_users))
}
