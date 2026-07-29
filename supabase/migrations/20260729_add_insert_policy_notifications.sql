CREATE POLICY "Authenticated users can insert notifications." ON notifications FOR INSERT TO authenticated WITH CHECK (true);
