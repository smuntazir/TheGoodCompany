use crate::storage::json_store::FileStore;

#[derive(Clone)]
pub struct AppState {
    pub users_store: FileStore,
    pub pois_store: FileStore,
    pub aois_store: FileStore,
    pub events_store: FileStore,
}
