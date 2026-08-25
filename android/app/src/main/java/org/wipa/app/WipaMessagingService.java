package org.wipa.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.Person;
import androidx.core.graphics.drawable.IconCompat;

import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class WipaMessagingService extends MessagingService {
    private static final String CHANNEL_ID = "wipa_messages";
    private static final String HISTORY_PREFS = "wipa_notification_history";
    private static final int MAX_VISIBLE_MESSAGES = 7;

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Map<String, String> data = remoteMessage.getData();
        if (!"message".equals(data.get("notificationType"))) return;

        String conversationId = value(data, "conversationId", value(data, "senderId", "chat"));
        String senderName = value(data, "senderName", "New message");
        String body = value(data, "body", "Sent you a message");
        String avatarUrl = value(data, "senderAvatar", "");
        String targetUrl = value(data, "url", "/platform/messages");
        long timestamp = parseTimestamp(data.get("timestamp"));

        createMessageChannel();
        Bitmap avatar = downloadAvatar(avatarUrl);
        Person.Builder senderBuilder = new Person.Builder().setName(senderName).setKey(value(data, "senderId", conversationId));
        if (avatar != null) senderBuilder.setIcon(IconCompat.createWithBitmap(avatar));
        Person sender = senderBuilder.build();

        JSONArray history = appendHistory(conversationId, body, timestamp);
        Person recipient = new Person.Builder().setName("You").setKey("wipa-recipient").build();
        NotificationCompat.MessagingStyle style = new NotificationCompat.MessagingStyle(recipient)
            .setConversationTitle(senderName)
            .setGroupConversation(false);

        for (int index = 0; index < history.length(); index++) {
            JSONObject item = history.optJSONObject(index);
            if (item != null) {
                style.addMessage(item.optString("body", "New message"), item.optLong("timestamp", timestamp), sender);
            }
        }

        Intent openChat = new Intent(this, MainActivity.class)
            .setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP)
            .putExtra("push_url", targetUrl)
            .putExtra("conversation_id", conversationId);
        int notificationId = positiveHash(conversationId);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            notificationId,
            openChat,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_message)
            .setContentTitle(senderName)
            .setContentText(body)
            .setStyle(style)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
            .setOnlyAlertOnce(false)
            .setGroup("wipa_conversations");
        if (avatar != null) builder.setLargeIcon(avatar);

        try {
            NotificationManagerCompat.from(this).notify("conversation:" + conversationId, notificationId, builder.build());
        } catch (SecurityException ignored) {
            // Android 13+ blocks posting when the user has not granted notification permission.
        }
    }

    private void createMessageChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Messages",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Direct message notifications");
        channel.enableVibration(true);
        getSystemService(NotificationManager.class).createNotificationChannel(channel);
    }

    private JSONArray appendHistory(String conversationId, String body, long timestamp) {
        SharedPreferences prefs = getSharedPreferences(HISTORY_PREFS, Context.MODE_PRIVATE);
        JSONArray existing;
        try {
            existing = new JSONArray(prefs.getString(historyKey(conversationId), "[]"));
        } catch (Exception ignored) {
            existing = new JSONArray();
        }

        JSONArray trimmed = new JSONArray();
        int first = Math.max(0, existing.length() - (MAX_VISIBLE_MESSAGES - 1));
        for (int index = first; index < existing.length(); index++) trimmed.put(existing.opt(index));
        try {
            trimmed.put(new JSONObject().put("body", body).put("timestamp", timestamp));
        } catch (Exception ignored) {}
        prefs.edit().putString(historyKey(conversationId), trimmed.toString()).apply();
        return trimmed;
    }

    private Bitmap downloadAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isEmpty()) return null;
        HttpURLConnection connection = null;
        try {
            String resolved = avatarUrl.startsWith("http") ? avatarUrl : "https://platform.womensipalliance.com" + avatarUrl;
            connection = (HttpURLConnection) new URL(resolved).openConnection();
            connection.setConnectTimeout(3500);
            connection.setReadTimeout(3500);
            connection.setDoInput(true);
            connection.connect();
            if (connection.getResponseCode() >= 200 && connection.getResponseCode() < 300) {
                return BitmapFactory.decodeStream(connection.getInputStream());
            }
        } catch (Exception ignored) {
        } finally {
            if (connection != null) connection.disconnect();
        }
        return null;
    }

    static String historyKey(String conversationId) {
        return "messages_" + conversationId;
    }

    private static String value(Map<String, String> data, String key, String fallback) {
        String value = data.get(key);
        return value == null || value.isEmpty() ? fallback : value;
    }

    private static long parseTimestamp(String raw) {
        try { return Long.parseLong(raw); } catch (Exception ignored) { return System.currentTimeMillis(); }
    }

    private static int positiveHash(String value) {
        return value.hashCode() & 0x7fffffff;
    }
}
