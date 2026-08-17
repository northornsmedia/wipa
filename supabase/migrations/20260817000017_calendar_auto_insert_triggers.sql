-- Trigger for event_registrations -> calendar_events
CREATE OR REPLACE FUNCTION sync_event_registration_to_calendar()
RETURNS TRIGGER AS $$
DECLARE
    evt_title TEXT;
    evt_start TIMESTAMPTZ;
    evt_end TIMESTAMPTZ;
    evt_location TEXT;
BEGIN
    SELECT title, start_date, end_date, location INTO evt_title, evt_start, evt_end, evt_location
    FROM events WHERE id = NEW.event_id;

    IF FOUND THEN
        INSERT INTO calendar_events (user_id, title, description, start_at, end_at, event_type, reference_id, reference_type, location)
        VALUES (
            NEW.user_id,
            'Event: ' || evt_title,
            'Registered WIPA Event',
            evt_start,
            COALESCE(evt_end, evt_start + interval '1 hour'),
            'wipa_event',
            NEW.event_id,
            'events',
            evt_location
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_event_registration_calendar
AFTER INSERT ON event_registrations
FOR EACH ROW
EXECUTE FUNCTION sync_event_registration_to_calendar();

-- Since we don't have a webinar_registrations table yet, we can omit it or make a placeholder.
-- If it exists:
-- CREATE TRIGGER on_webinar_registration_calendar ...
