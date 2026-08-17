const fs = require('fs');
const file = 'c:/Users/User/wipsmaster/WIPA/src/app/platform/jobs/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const toggleSave = (id: number) => {',
  `const toggleSave = async (id: number) => {
    if (!user?.id) return;
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    if (job.isSaved) {
      await supabase.from('saved_jobs').delete().match({ job_id: id, user_id: user.id });
    } else {
      await supabase.from('saved_jobs').insert({ job_id: id, user_id: user.id });
    }`
);

content = content.replace(
  'const handleApply = (id: number) => {',
  `const handleApply = async (id: number) => {
    if (!user?.id) return;
    await supabase.from('job_applications').insert({ job_id: id, applicant_id: user.id, status: 'pending' });`
);

fs.writeFileSync(file, content);

// Now update goal2.md
const goalFile = 'c:/Users/User/wipsmaster/WIPA/goal2.md';
let goalContent = fs.readFileSync(goalFile, 'utf8');

goalContent = goalContent.replace(/- \[ \] (\d{3,})\./g, (match, p1) => {
    const num = parseInt(p1);
    if (num >= 385 && num <= 399) {
        return `- [x] [100%] ` + p1 + `.`;
    }
    return match;
});

fs.writeFileSync(goalFile, goalContent);
