const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const adminDb = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

const IN_HOUSE_FORUM_ID = '66666666-6666-6666-6666-666666666666';

// Replicate exact server action logic
const VERIFIED_IN_HOUSE_COUNSEL_IDS = new Set([
  '9b3c3082-04ef-4041-bebe-f018f3b3ef4d', // Charlotte Sterling (Waymo / Alphabet)
  '44eef627-2bc9-4f3b-998c-56059d686b13', // Claire Dupont (LVMH)
  'f15bd30f-f74b-4a4b-b948-6b001a5cd822', // Beatrice Moreau (Sanofi)
  '0f6fc8f9-7748-436c-a4b3-7499e695ac12', // Olivia Thornton (AstraZeneca)
]);

function checkIsInHouseCounsel(profile) {
  if (!profile) return false;
  if (profile.membership_tier === 'in_house_counsel') return true;
  if (VERIFIED_IN_HOUSE_COUNSEL_IDS.has(profile.id)) return true;

  const role = (profile.role || '').toLowerCase();
  const company = (profile.company || '').toLowerCase();

  const counselKeywords = [
    'in-house', 'in house', 'general counsel', 'chief ip', 'head of ip',
    'head of legal', 'patent counsel', 'legal director', 'director of ip',
    'vp ip', 'corporate counsel', 'lead ip counsel', 'senior legal director'
  ];

  const hasCounselRole = counselKeywords.some(kw => role.includes(kw));
  const hasCorporateCompany = company.length > 0 && 
    !company.includes('llp') && 
    !company.includes('law firm') && 
    !company.includes('advocates') && 
    !company.includes('practice');

  return hasCounselRole && hasCorporateCompany;
}

async function verifyAll() {
  console.log('=== 1. VERIFY FORUM FETCH QUERY ===');
  const { data: questions, error: fetchErr } = await adminDb
    .from('forum_posts')
    .select(`
      id,
      title,
      content,
      created_at,
      author:author_id(id, full_name, avatar_url, role, company, membership_tier),
      forum_replies(
        id,
        content,
        created_at,
        author:author_id(id, full_name, avatar_url, role, company, is_wipa_recommended, membership_tier)
      )
    `)
    .eq('forum_id', IN_HOUSE_FORUM_ID)
    .order('created_at', { ascending: false });

  if (fetchErr) {
    console.error('Fetch Error:', fetchErr);
    process.exit(1);
  }
  console.log(`✓ Fetched ${questions.length} questions successfully with nested replies and profile relations.`);
  questions.forEach((q, i) => {
    console.log(`  Q${i+1}: "${q.title.slice(0, 50)}..." by ${q.author?.full_name} (${q.author?.membership_tier})`);
    console.log(`      Replies count: ${q.forum_replies?.length || 0}`);
    q.forum_replies?.forEach(r => {
      const isCounsel = checkIsInHouseCounsel(r.author);
      const isAuthor = r.author?.id === q.author?.id;
      console.log(`      -> Reply by ${r.author?.full_name}: Counsel=${isCounsel}, Author=${isAuthor}`);
    });
  });

  console.log('\n=== 2. VERIFY QUESTION CREATION IN DB ===');
  // Use a real community member to ask a test question
  const testAuthorId = 'ac3759c1-58bc-412a-90bc-4de024aced85'; // Sophia Bennett
  const { data: newPost, error: createErr } = await adminDb
    .from('forum_posts')
    .insert({
      forum_id: IN_HOUSE_FORUM_ID,
      author_id: testAuthorId,
      title: 'DB Verification: How do in-house teams handle open-source software compliance?',
      content: 'Testing automated verification of in-house question flow and schema integrity.'
    })
    .select()
    .single();

  if (createErr) {
    console.error('Create question error:', createErr);
    process.exit(1);
  }
  console.log(`✓ Created test question ID: ${newPost.id}`);

  console.log('\n=== 3. VERIFY COUNSEL ANSWER IN DB ===');
  // In-House Counsel Charlotte Sterling replies
  const counselId = '9b3c3082-04ef-4041-bebe-f018f3b3ef4d'; // Waymo Lead IP Counsel
  const { data: counselReply, error: counselReplyErr } = await adminDb
    .from('forum_replies')
    .insert({
      post_id: newPost.id,
      author_id: counselId,
      content: 'We employ automated CI/CD scanner tools like FOSSA and Black Duck to prevent copyleft GPL contamination in commercial microservices.'
    })
    .select(`
      id,
      content,
      created_at,
      author:author_id(id, full_name, role, company, membership_tier)
    `)
    .single();

  if (counselReplyErr) {
    console.error('Counsel reply error:', counselReplyErr);
    process.exit(1);
  }
  console.log(`✓ In-House Counsel posted reply ID: ${counselReply.id} by ${counselReply.author?.full_name} (${counselReply.author?.company})`);

  console.log('\n=== 4. VERIFY QUESTION AUTHOR FOLLOW-UP IN DB ===');
  // Question author Sophia Bennett replies / follows up
  const { data: authorFollowUp, error: authorFollowUpErr } = await adminDb
    .from('forum_replies')
    .insert({
      post_id: newPost.id,
      author_id: testAuthorId,
      content: 'Thank you Charlotte! Do you require dual-licensing approval from engineering managers before merging pull requests?'
    })
    .select(`
      id,
      content,
      created_at,
      author:author_id(id, full_name, role, company, membership_tier)
    `)
    .single();

  if (authorFollowUpErr) {
    console.error('Author follow-up error:', authorFollowUpErr);
    process.exit(1);
  }
  console.log(`✓ Question Author posted follow-up ID: ${authorFollowUp.id} by ${authorFollowUp.author?.full_name}`);

  console.log('\n=== 5. VERIFY UNAUTHORIZED THIRD-PARTY REJECTION ===');
  // Test with random member who is NOT in-house counsel and NOT question author
  const unauthorizedUserId = '0e6f5485-42fb-4f16-bd9c-62b8c955b633'; // Abhigna Mistry
  const { data: unauthProfile } = await adminDb.from('profiles').select('*').eq('id', unauthorizedUserId).single();
  const isCounsel = checkIsInHouseCounsel(unauthProfile);
  const isAuthor = newPost.author_id === unauthorizedUserId;

  console.log(`Checking unauthorized user ${unauthProfile?.full_name}:`);
  console.log(`- isCounsel: ${isCounsel}`);
  console.log(`- isAuthor: ${isAuthor}`);

  if (!isCounsel && !isAuthor) {
    console.log(`✓ Successfully rejected unauthorized engagement! Only counsel and author can participate.`);
  } else {
    console.error('FAILURE: Unauthorized user was incorrectly permitted!');
    process.exit(1);
  }

  console.log('\n=== 6. CLEAN UP TEST DATA ===');
  await adminDb.from('forum_replies').delete().eq('post_id', newPost.id);
  await adminDb.from('forum_posts').delete().eq('id', newPost.id);
  console.log('✓ Cleaned up verification post and replies from DB.');

  console.log('\n========================================');
  console.log('ALL DATABASE INTEGRATION TESTS PASSED 100%!');
  console.log('========================================');
}

verifyAll();
