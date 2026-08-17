-- Create app_notifications table
CREATE TABLE app_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Trigger to notify when a post becomes trending
CREATE OR REPLACE FUNCTION notify_trending_post()
RETURNS TRIGGER AS $$
BEGIN
    -- If is_trending flips to true
    IF NEW.is_trending = true AND OLD.is_trending = false THEN
        INSERT INTO app_notifications (user_id, title, message, link)
        VALUES (
            NEW.author_id,
            '🔥 Trending Discussion',
            'Your discussion "' || NEW.title || '" is now trending on WIPA!',
            '/platform/forums/' || NEW.forum_id || '/' || NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_trending
AFTER UPDATE ON forum_posts
FOR EACH ROW
WHEN (NEW.is_trending IS DISTINCT FROM OLD.is_trending)
EXECUTE FUNCTION notify_trending_post();

-- Trigger to notify when a resource is created with a source_forum_post_id (Podcast)
CREATE OR REPLACE FUNCTION notify_podcast_conversion()
RETURNS TRIGGER AS $$
DECLARE
    post_author_id UUID;
    post_title TEXT;
    post_forum_id UUID;
BEGIN
    IF NEW.type = 'podcast' AND NEW.source_forum_post_id IS NOT NULL THEN
        SELECT author_id, title, forum_id INTO post_author_id, post_title, post_forum_id
        FROM forum_posts
        WHERE id = NEW.source_forum_post_id;

        IF post_author_id IS NOT NULL THEN
            INSERT INTO app_notifications (user_id, title, message, link)
            VALUES (
                post_author_id,
                '🎙️ Podcast Feature',
                'Your discussion "' || post_title || '" has been featured as a Podcast Episode!',
                '/platform/resources/podcasts-conversations/' || NEW.id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_podcast_created
AFTER INSERT ON resources
FOR EACH ROW
EXECUTE FUNCTION notify_podcast_conversion();
