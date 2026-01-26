use axum::{
    routing::{delete, get, post},
    Router,
};
use dotenvy::dotenv;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod models;
mod routes;
mod state;
mod storage;
mod utils;

use config::Config;
use routes::{auth, content, planning};
use state::AppState;
use storage::json_store::FileStore;

#[tokio::main]
async fn main() {
    dotenv().ok();
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "debug".to_string()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let state = AppState {
        users_store: FileStore::new(Config::users_file()),
        pois_store: FileStore::new(Config::pois_file()),
        aois_store: FileStore::new(Config::aois_file()),
        events_store: FileStore::new(Config::events_file()),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        // Auth Routes
        .route("/api/register", post(auth::register))
        .route("/api/login", post(auth::login))
        .route("/api/users", get(auth::get_users))
        // Content Routes
        .route("/api/pois", get(content::get_pois).post(content::create_poi))
        .route("/api/pois/:id", delete(content::delete_poi))
        .route("/api/aois", get(content::get_aois).post(content::create_aoi))
        .route("/api/aois/:id", delete(content::delete_aoi))
        // Planning Routes
        .route("/api/events", get(planning::get_events).post(planning::create_event))
        .route("/api/events/:id", delete(planning::delete_event))
        .layer(cors)
        .with_state(state);

    let port = Config::port();
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    tracing::info!("Server running on port {}", port);
    axum::serve(listener, app).await.unwrap();
}
