package org.wipa.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

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
            bridge.getWebView().setBackgroundColor(android.graphics.Color.parseColor("#6600FF"));
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
