-- Seed Level-Wise Quizzes
-- Beginner Quiz
INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_seconds, xp_reward, is_published) 
VALUES ('b0d89262-e64e-4f05-87bd-93c0bc5c30b1', 'Beginner: Copyright Law 101', 'An introductory quiz on the basics of copyright law.', 'Copyright', 'Beginner', 300, 50, true);

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option, explanation, order_index) VALUES
('b0d89262-e64e-4f05-87bd-93c0bc5c30b1', 'What is the primary purpose of copyright law?', '["To protect inventions", "To protect original works of authorship", "To protect brand names", "To protect trade secrets"]', 1, 'Copyright law protects original works of authorship, such as literature, music, and art.', 1),
('b0d89262-e64e-4f05-87bd-93c0bc5c30b1', 'When does copyright protection begin?', '["When the work is published", "When the work is registered with the copyright office", "As soon as the work is fixed in a tangible medium", "When the author dies"]', 2, 'Copyright protection is automatic as soon as the work is created and fixed in a tangible form.', 2),
('b0d89262-e64e-4f05-87bd-93c0bc5c30b1', 'Which of the following cannot be copyrighted?', '["A song", "A novel", "An idea", "A photograph"]', 2, 'Copyright protects the expression of an idea, not the idea itself.', 3);


-- Intermediate Quiz
INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_seconds, xp_reward, is_published) 
VALUES ('i0d89262-e64e-4f05-87bd-93c0bc5c30i2', 'Intermediate: Trademark Prosecution', 'Test your knowledge on the trademark registration process.', 'Trademark', 'Intermediate', 600, 100, true);

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option, explanation, order_index) VALUES
('i0d89262-e64e-4f05-87bd-93c0bc5c30i2', 'What is the "likelihood of confusion" test used for?', '["Determining if a patent is valid", "Determining if trademark infringement has occurred", "Calculating copyright damages", "Filing a trade secret claim"]', 1, 'The likelihood of confusion test evaluates whether consumers would be confused by similar trademarks.', 1),
('i0d89262-e64e-4f05-87bd-93c0bc5c30i2', 'Which classification system is used for registering trademarks internationally?', '["The Paris System", "The Madrid Protocol", "The Berne Convention", "The Hague Agreement"]', 1, 'The Madrid Protocol provides a streamlined system for international trademark registration.', 2),
('i0d89262-e64e-4f05-87bd-93c0bc5c30i2', 'What is an "Office Action"?', '["A lawsuit filed by a competitor", "An official letter from the USPTO regarding issues with an application", "A formal grant of trademark rights", "A cease and desist letter"]', 1, 'An Office Action is official correspondence from an examining attorney at the USPTO.', 3);


-- Advanced Quiz
INSERT INTO quizzes (id, title, description, category, difficulty, time_limit_seconds, xp_reward, is_published) 
VALUES ('a0d89262-e64e-4f05-87bd-93c0bc5c30a3', 'Advanced: Patent Litigation Strategies', 'Deep dive into complex patent litigation scenarios and defenses.', 'Patent', 'Advanced', 900, 250, true);

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option, explanation, order_index) VALUES
('a0d89262-e64e-4f05-87bd-93c0bc5c30a3', 'What is the "doctrine of equivalents"?', '["A rule that invalidates identical patents", "A legal principle allowing infringement findings even if the device does not literally infringe", "A method for calculating equal damages among defendants", "An agreement between patent co-owners"]', 1, 'The doctrine of equivalents prevents infringers from making minor changes to avoid literal infringement.', 1),
('a0d89262-e64e-4f05-87bd-93c0bc5c30a3', 'In the US, what constitutes an "on-sale bar" under 35 U.S.C. § 102?', '["Selling a patented product after filing", "The invention was the subject of a commercial offer for sale more than a year before the filing date", "Selling a product outside the US", "An injunction against selling a product"]', 1, 'An invention cannot be patented if it was on sale or offered for sale more than a year before the patent application was filed.', 2),
('a0d89262-e64e-4f05-87bd-93c0bc5c30a3', 'Which standard of review applies to a district court''s claim construction on appeal?', '["De novo review", "Clearly erroneous standard", "Abuse of discretion", "Substantial evidence"]', 0, 'In Markman v. Westview Instruments, the Supreme Court held that claim construction is a matter of law, subject to de novo review on appeal.', 3),
('a0d89262-e64e-4f05-87bd-93c0bc5c30a3', 'What is an Inter Partes Review (IPR)?', '["A civil lawsuit for patent infringement", "A proceeding before the PTAB to review the patentability of claims based on prior art", "A negotiation between two parties to settle a dispute", "A criminal investigation into patent fraud"]', 1, 'An IPR is a trial proceeding conducted at the Patent Trial and Appeal Board (PTAB) to review the patentability of one or more claims in a patent.', 4);
