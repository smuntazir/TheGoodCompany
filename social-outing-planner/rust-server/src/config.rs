use std::env;

pub struct Config;

impl Config {
    pub fn port() -> u16 {
        env::var("PORT").unwrap_or_else(|_| "5000".to_string()).parse().unwrap_or(5000)
    }

    pub fn secret_key() -> String {
        env::var("SECRET_KEY").unwrap_or_else(|_| "dev_secret_key".to_string())
    }

    pub fn data_dir() -> String {
        env::var("DATA_DIR").unwrap_or_else(|_| "data".to_string())
    }

    pub fn users_file() -> String {
        format!("{}/users.json", Self::data_dir())
    }

    pub fn pois_file() -> String {
        format!("{}/pois.json", Self::data_dir())
    }

    pub fn aois_file() -> String {
        format!("{}/aois.json", Self::data_dir())
    }

    pub fn events_file() -> String {
        format!("{}/events.json", Self::data_dir())
    }
}
