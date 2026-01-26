use serde::{de::DeserializeOwned, Serialize};
use std::path::Path;
use tokio::fs;
use tokio::sync::RwLock;
use std::sync::Arc;

#[derive(Clone, Debug)]
pub struct FileStore {
    path: String,
    lock: Arc<RwLock<()>>,
}

impl FileStore {
    pub fn new(path: String) -> Self {
        Self {
            path,
            lock: Arc::new(RwLock::new(())),
        }
    }

    pub async fn read<T: DeserializeOwned>(&self) -> Result<Vec<T>, Box<dyn std::error::Error + Send + Sync>> {
        let _guard = self.lock.read().await;
        if !Path::new(&self.path).exists() {
            return Ok(Vec::new());
        }
        match fs::read_to_string(&self.path).await {
            Ok(content) => {
                if content.trim().is_empty() {
                    Ok(Vec::new())
                } else {
                    match serde_json::from_str(&content) {
                        Ok(data) => Ok(data),
                        Err(_) => Ok(Vec::new()), // Return empty on parse error (robustness)
                    }
                }
            }
            Err(_) => Ok(Vec::new()),
        }
    }

    pub async fn write<T: Serialize>(&self, data: &Vec<T>) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let _guard = self.lock.write().await;
        let content = serde_json::to_string_pretty(data)?;
        
        if let Some(parent) = Path::new(&self.path).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        fs::write(&self.path, content).await?;
        Ok(())
    }
}
