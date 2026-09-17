const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

const targetIds = [
  '9b3c3082-04ef-4041-bebe-f018f3b3ef4d', // Charlotte Sterling (Waymo / Alphabet)
  '44eef627-2bc9-4f3b-998c-56059d686b13', // Claire Dupont (LVMH)
  'f15bd30f-f74b-4a4b-b948-6b001a5cd822', // Beatrice Moreau (Sanofi)
  '0f6fc8f9-7748-436c-a4b3-7499e695ac12', // Olivia Thornton (AstraZeneca)
  '2c41c802-629d-4337-8e4c-aaa3a0e2bed5', // Natalie Brooks (Spotify)
  '1244b78e-a273-4773-9915-7ed4c9b22489', // Neha Kapoor (Titan Company)
  '323c3930-7a00-408d-9845-70bd1aed99da', // Sneha Reddy (Dr. Reddy's)
  'f7ed86a6-58ec-4bff-a5e6-ff9714aa86af', // Tanvi Chawla (Infosys)
  '760a1316-4047-46be-a57d-f889285375de', // Divya Nambiar (Wipro)
  '73b2eb6a-9555-41bf-9022-333ddf5cfed4', // Dr. Priya Ramachandran (Biocon)
  'a4d08f59-2e27-438d-8fe9-e4061c8b2a96', // Pooja Kulkarni (Ola Electric)
  '64232d95-5529-4639-a415-8b92ae28ac64', // Radhika Mathur (Flipkart)
  '5c8ebd65-ce08-4aed-a2e6-2180344b9f56', // Preeti Narayanan (Zoho)
  '42041331-b1e2-481d-b67e-4719c36d579a', // Nisha Singhania (Lupin)
  '0bb5415d-ffb7-4bad-bab5-55f47df43ce5', // Tarini Roy (Yash Raj Films)
  '289f38a0-8e61-4b9c-9905-5e3a5d29f01c', // Chetna Parekh (Marico)
  'f5e1aa38-76bc-4bb2-9ee3-0c005c2a3953', // Rupal Trivedi (Zydus)
  '82e2a4b8-4a82-49a2-841f-fbdef36d92e8', // Leela Namboodiri (Dabur)
  '37e1b565-de5d-4ea8-81f8-e4cb47199b59', // Katherine Pierce (Coca-Cola)
  '8511c9fb-7d3a-405a-9c13-5e2f7ebb3e56', // Hannah Fischer (BMW Group)
  'dc8d86c1-f0ea-4e63-897e-5c688fa895b9', // Alexandra Hayes (Quantum Circuits / Yale)
  '2d2901bc-b2fc-4e07-9e84-fa5526829c6e', // Dr. Kimberly Adams (Genentech / Roche)
  'e9640e73-ea3e-4a6a-9d0b-2547d80a2b7d', // Camille Laurent (Ubisoft)
  'd92b9efd-fc4a-40ad-973d-577c8a978f58', // Dr. Chloe Zhang (Tencent)
  '59da0825-4875-4f4f-bfb9-da51dbb95196', // Grace Kelly (Warner Bros.)
  '79a95ba9-3a6c-4541-acf0-719198b39456', // Juliana Gomez (Mercado Libre)
  '6e6f44cb-cc78-440f-9079-b75572bc3ea5'  // Dr. Samantha Vance (Moderna)
];

async function update() {
  console.log(`Updating ${targetIds.length} profiles to 'in_house_counsel'...`);
  const { data, error } = await supabase
    .from('profiles')
    .update({ membership_tier: 'in_house_counsel' })
    .in('id', targetIds)
    .select('id, full_name, role, company, membership_tier');

  if (error) {
    console.error('Update error:', error);
    return;
  }
  console.log(`Successfully updated ${data.length} profiles to in_house_counsel tier!`);
  data.forEach(p => console.log(`✓ ${p.full_name} | ${p.role} (${p.company}) -> ${p.membership_tier}`));
}

update();
