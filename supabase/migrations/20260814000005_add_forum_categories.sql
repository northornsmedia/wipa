-- Insert default forums
INSERT INTO public.forums (id, title, description, category) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Patent Law & Prosecution', 'Discuss patent drafting, office actions, and subject matter eligibility.', 'Law'),
    ('22222222-2222-2222-2222-222222222222', 'Trademark & Copyright', 'Conversations around brand protection, DMCA, and fair use.', 'Law'),
    ('33333333-3333-3333-3333-333333333333', 'IP Strategy & Monetization', 'Licensing, portfolio management, and commercialization strategies.', 'Strategy'),
    ('44444444-4444-4444-4444-444444444444', 'Career & Leadership', 'Advice on career progression, in-house vs law firm, and leadership.', 'Career'),
    ('55555555-5555-5555-5555-555555555555', 'Technology & AI', 'The intersection of artificial intelligence and intellectual property.', 'Technology')
ON CONFLICT (id) DO NOTHING;
