use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    http::header,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use axum_server::tls_rustls::RustlsConfig;
use futures_util::stream::StreamExt;
use rcgen::generate_simple_self_signed;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};

struct AppState {
    app_handle: AppHandle,
}

pub async fn start_server(app_handle: AppHandle, port: u16) {
    let _ = rustls::crypto::ring::default_provider().install_default();

    let app_state = Arc::new(AppState {
        app_handle: app_handle.clone(),
    });

    let app = Router::new()
        .route("/", get(serve_html))
        .route("/style.css", get(serve_css))
        .route("/app.js", get(serve_js))
        .route("/ws", get(ws_handler))
        .with_state(app_state);

    let (cert, key) = generate_cert().expect("Failed to generate cert");

    let config = RustlsConfig::from_pem(cert.into(), key.into())
        .await
        .expect("Failed to config rustls");

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));

    println!("Starting HTTPS server on https://{}", addr);

    axum_server::bind_rustls(addr, config)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

fn generate_cert() -> Result<(String, String), rcgen::Error> {
    let subject_alt_names = vec![
        "localhost".to_string(),
        "127.0.0.1".to_string(),
        "0.0.0.0".to_string(),
    ];
    let cert = generate_simple_self_signed(subject_alt_names)?;
    let cert_pem = cert.cert.pem();
    let key_pem = cert.key_pair.serialize_pem();
    Ok((cert_pem, key_pem))
}

async fn serve_html() -> Html<&'static str> {
    Html(include_str!("../webClient/index.html"))
}

async fn serve_css() -> impl IntoResponse {
    (
        [(header::CONTENT_TYPE, "text/css")],
        include_str!("../webClient/style.css"),
    )
}

async fn serve_js() -> impl IntoResponse {
    (
        [(header::CONTENT_TYPE, "application/javascript")],
        include_str!("../webClient/app.js"),
    )
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: Arc<AppState>) {
    let _ = state.app_handle.emit("client-connected", ());

    while let Some(Ok(msg)) = socket.next().await {
        if let Message::Text(text) = msg {
            let _ = state.app_handle.emit("camera-frame", text);
        }
    }

    let _ = state.app_handle.emit("client-disconnected", ());
}
