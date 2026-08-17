-- Quizzes and Gamification Schema

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT,
  time_limit_seconds INTEGER DEFAULT 300,
  xp_reward INTEGER DEFAULT 50,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_threshold INTEGER DEFAULT 0,
  badge_color TEXT DEFAULT '#5a32fa'
);

CREATE TABLE IF NOT EXISTS member_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Seed Achievements
INSERT INTO achievements (name, description, icon, xp_threshold, badge_color) VALUES
('Quiz Newbie', 'Completed your first quiz.', 'brain', 10, '#3b82f6'),
('IP Scholar', 'Earned 100 XP from learning.', 'book', 100, '#10b981'),
('Patent Pro', 'Earned 500 XP from quizzes.', 'award', 500, '#8b5cf6'),
('WIPA Legend', 'Earned 2000 XP in total.', 'crown', 2000, '#f59e0b'),
('Connector', 'Connected with 5 members.', 'users', 30, '#ec4899'),
('First Post', 'Shared your first thought on the platform.', 'message-square', 25, '#6366f1'),
('Profile Complete', 'Filled out your profile completely.', 'user-check', 50, '#14b8a6'),
('Event Goer', 'Registered for your first event.', 'calendar', 40, '#f43f5e'),
('Popular Voice', 'Received 10 likes on a single post.', 'heart', 20, '#ef4444'),
('Top 10 Leaderboard', 'Reached the top 10 on the global leaderboard.', 'trending-up', 1000, '#eab308');

-- We won't seed quizzes here since it's easier to create them via Admin Panel, 
-- but we can seed one basic quiz to fulfill the requirement.
INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_seconds, xp_reward, is_published) 
VALUES ('c0d89262-e64e-4f05-87bd-93c0bc5c30f1', 'Basics of Intellectual Property', 'Test your knowledge on the foundations of IP.', 'General', 'Easy', 300, 50, true);

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option, explanation, order_index) VALUES
('c0d89262-e64e-4f05-87bd-93c0bc5c30f1', 'What does IP stand for?', '["Internet Protocol", "Intellectual Property", "Internal Process", "International Patent"]', 1, 'In the context of law, IP stands for Intellectual Property.', 1),
('c0d89262-e64e-4f05-87bd-93c0bc5c30f1', 'Which of the following is NOT a type of intellectual property?', '["Patent", "Trademark", "Copyright", "Real Estate"]', 3, 'Real Estate is a type of physical property, not intellectual property.', 2),
('c0d89262-e64e-4f05-87bd-93c0bc5c30f1', 'How long does a utility patent typically last in the US?', '["10 years from issuance", "20 years from filing", "70 years plus life of author", "Indefinitely"]', 1, 'A US utility patent typically lasts 20 years from the earliest filing date.', 3),
('c0d89262-e64e-4f05-87bd-93c0bc5c30f1', 'What protects original works of authorship?', '["Copyright", "Trademark", "Trade Secret", "Patent"]', 0, 'Copyright protects original works of authorship like books, music, and software.', 4),
('c0d89262-e64e-4f05-87bd-93c0bc5c30f1', 'Can a color be trademarked?', '["Yes, always", "No, never", "Yes, if it has acquired secondary meaning", "Only for clothing"]', 2, 'Colors can be trademarked (like Tiffany Blue) if they identify the source of a product.', 5);
