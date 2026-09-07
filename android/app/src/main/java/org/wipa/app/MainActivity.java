package org.wipa.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(
                new String[] { Manifest.permission.POST_NOTIFICATIONS },
                NOTIFICATION_PERMISSION_REQUEST
            );
        }

        openPushDestination(getIntent());

        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.setBackgroundColor(android.graphics.Color.WHITE);
            
            // Native Chromium hardware acceleration with zero intermediate layer invalidation flicker
            webView.setLayerType(View.LAYER_TYPE_NONE, null);
            webView.setOverScrollMode(View.OVER_SCROLL_IF_CONTENT_SCROLLS);
            webView.setVerticalScrollBarEnabled(false);
            webView.setHorizontalScrollBarEnabled(false);
            webView.setFadingEdgeLength(0);

            WebSettings settings = webView.getSettings();
            if (settings != null) {
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setOffscreenPreRaster(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
                settings.setEnableSmoothTransition(true);
            }

            // Calculate physical status bar height in dp and inject into CSS variable
            int statusBarHeight = 0;
            int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
            if (resourceId > 0) {
                statusBarHeight = getResources().getDimensionPixelSize(resourceId);
            }
            float density = getResources().getDisplayMetrics().density;
            final int statusBarHeightDp = Math.max((int) (statusBarHeight / density), 38);

            webView.post(() -> {
                String js = "document.documentElement.style.setProperty('--android-status-bar-height', '" + statusBarHeightDp + "px');";
                webView.evaluateJavascript(js, null);
            });
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (bridge != null && bridge.getWebView() != null) {
            int statusBarHeight = 0;
            int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
            if (resourceId > 0) {
                statusBarHeight = getResources().getDimensionPixelSize(resourceId);
            }
            float density = getResources().getDisplayMetrics().density;
            final int statusBarHeightDp = Math.max((int) (statusBarHeight / density), 38);

            WebView webView = bridge.getWebView();
            webView.post(() -> {
                String js = "document.documentElement.style.setProperty('--android-status-bar-height', '" + statusBarHeightDp + "px');";
                webView.evaluateJavascript(js, null);
            });
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        openPushDestination(intent);
    }

    private void openPushDestination(Intent intent) {
        if (intent == null) return;
        String path = intent.getStringExtra("push_url");
        if (path == null || path.isEmpty() || bridge == null) return;
        String conversationId = intent.getStringExtra("conversation_id");
        if (conversationId != null && !conversationId.isEmpty()) {
            getSharedPreferences("wipa_notification_history", MODE_PRIVATE)
                .edit()
                .remove(WipaMessagingService.historyKey(conversationId))
                .apply();
        }
        String destination = path.startsWith("http") ? path : "https://platform.womensipalliance.com" + path;
        bridge.getWebView().post(() -> bridge.getWebView().loadUrl(destination));
    }
}
