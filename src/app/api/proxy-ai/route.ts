import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const targetUrl = 'https://startup-template-sage.vercel.app/';
    const response = await fetch(targetUrl);
    let html = await response.text();

    // Inject base tag so all relative assets (images, CSS, JS) load correctly from the original vercel domain
    html = html.replace('<head>', '<head><base href="https://startup-template-sage.vercel.app/" />');

    // Do a preliminary static replacement of the text. 
    // We only replace 'Magic UI' (with a space) to avoid breaking URLs (like magicui.png) or CSS classes (like magicui-theme).
    html = html.replace(/Introducing Magic UI Template/gi, 'Powered by WIPA');
    html = html.replace(/Magic UI/g, 'LexIQ');
    html = html.replace(/to build landing pages/gi, 'to learn Intellectual Property');
    html = html.replace(/Simple pricing for everyone./gi, 'The only AI specialized in IP.');
    html = html.replace(/Choose an /gi, 'Unlike ChatGPT or general AI models that hallucinate legal advice, ');
    html = html.replace(/affordable plan/gi, 'LexIQ is ');
    html = html.replace(/that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales\./gi, 'purpose-built to navigate the complex world of patents, trademarks, and intellectual property law with pinpoint accuracy.');
    html = html.replace(/A basic plan for startups and individual users/gi, 'LexIQ is trained on verified IP law, ensuring pinpoint accuracy without the hallucinations common in ChatGPT.');
    html = html.replace(/A premium plan for growing businesses/gi, 'Built specifically for IP professionals, delivering tailored insights rather than generic advice.');
    html = html.replace(/An enterprise plan with advanced features for large organizations/gi, 'Continuously updated with the latest trademark and patent case law from around the globe.');
    html = html.replace(/The ultimate plan with all features for industry leaders/gi, 'Your IP queries are fully encrypted and never used to train public models, unlike other AIs.');
    html = html.replace(/Stop wasting time on design/gi, 'Stop wasting time on searching');
    html = html.replace(/Start your 7-day free trial\. No credit card required\./gi, "Start talking to LexIQ. As you're a member of WIPA, it's free for you!");
    html = html.replace(/UI Library for Design Engineers/gi, 'AI agent for IP Professionals');
    html = html.replace(/Beautifully designed, animated components and templates built with/gi, "An Artificial Intelligence developed by the team behind Women's IP Alliance");
    html = html.replace(/Tailwind CSS, React, and Framer Motion\./gi, "specifically for Intellectual Property professionals.");

    // Rewrite root-relative URLs directly in the HTML to point to the actual domain
    html = html.replace(/src="\//g, 'src="https://startup-template-sage.vercel.app/');
    html = html.replace(/href="\//g, 'href="https://startup-template-sage.vercel.app/');
    html = html.replace(/srcset="\//g, 'srcset="https://startup-template-sage.vercel.app/');

    // Inject an aggressive DOM mutation script and a fetch interceptor
    const script = `
      <script>
        // Intercept all fetch requests (fixes Next.js RSC payload 404s)
        const originalFetch = window.fetch;
        window.fetch = async function() {
          let [resource, config] = arguments;
          if (typeof resource === 'string' && resource.startsWith('/')) {
            resource = 'https://startup-template-sage.vercel.app' + resource;
          } else if (resource instanceof Request && resource.url.startsWith(window.location.origin)) {
             resource = new Request(resource.url.replace(window.location.origin, 'https://startup-template-sage.vercel.app'), resource);
          }
          return originalFetch(resource, config);
        };

        const replacements = [
          [/Introducing Magic UI Template/gi, 'Powered by WIPA'],
          [/Magic UI/gi, 'LexIQ'],
          [/to build landing pages/gi, 'to learn Intellectual Property'],
          [/Simple pricing for everyone./gi, 'The only AI specialized in IP.'],
          [/Choose an /gi, 'Unlike ChatGPT or general AI models that hallucinate legal advice, '],
          [/affordable plan/gi, 'LexIQ is '],
          [/that\\'s packed with the best features for engaging your audience, creating customer loyalty, and driving sales\./gi, 'purpose-built to navigate the complex world of patents, trademarks, and intellectual property law with pinpoint accuracy.'],
          [/A basic plan for startups and individual users/gi, 'LexIQ is trained on verified IP law, ensuring pinpoint accuracy without the hallucinations common in ChatGPT.'],
          [/A premium plan for growing businesses/gi, 'Built specifically for IP professionals, delivering tailored insights rather than generic advice.'],
          [/An enterprise plan with advanced features for large organizations/gi, 'Continuously updated with the latest trademark and patent case law from around the globe.'],
          [/The ultimate plan with all features for industry leaders/gi, 'Your IP queries are fully encrypted and never used to train public models, unlike other AIs.'],
          [/\\bBasic\\b/g, 'Precision'],
          [/\\bPremium\\b/g, 'Specialized'],
          [/\\bEnterprise\\b/g, 'Up to Date'],
          [/\\bUltimate\\b/g, 'Secure'],
          [/Pricing/g, 'Why LexIQ?'],
          [/Stop wasting time on design/gi, 'Stop wasting time on searching'],
          [/Start your 7-day free trial\\. No credit card required\\./gi, "Start talking to LexIQ. As you're a member of WIPA, it's free for you!"],
          [/UI Library for Design Engineers/gi, 'AI agent for IP Professionals'],
          [/Beautifully designed, animated components and templates built with/gi, "An Artificial Intelligence developed by the team behind Women's IP Alliance"],
          [/Tailwind CSS, React, and Framer Motion\./gi, "specifically for Intellectual Property professionals."]
        ];

        const replaceText = () => {
          document.title = document.title.replace(/Magic UI/gi, 'LexIQ');
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while (node = walker.nextNode()) {
            let val = node.nodeValue;
            let changed = false;
            for (const [regex, replacement] of replacements) {
              if (val.match(regex)) {
                val = val.replace(regex, replacement);
                changed = true;
              }
            }
            if (changed) {
              node.nodeValue = val;
            }
            
            // Hide pricing elements (prices, billing toggles)
            const valLower = val.toLowerCase();
            if (valLower.includes('$') || valLower.includes('/ month') || valLower.includes('/month') || valLower.includes('annual') || valLower.includes('2 months free')) {
              if (node.parentElement) {
                // Hide the container to completely remove it from the layout
                node.parentElement.style.display = 'none';
                node.nodeValue = '';
              }
            } else if (['10', '20', '50', '80'].includes(val.trim())) {
              if (node.parentElement) {
                node.parentElement.style.display = 'none';
                node.nodeValue = '';
              }
            }
          }
          
          // Replace buttons and fix links
          document.querySelectorAll('a, button').forEach(el => {
            if (el.tagName === 'A' && el.hasAttribute('href') && el.getAttribute('href').includes('startup-template-sage.vercel.app')) {
              el.removeAttribute('href');
              el.style.cursor = 'pointer'; // keep the pointer since href is gone
            }
            if (el.textContent.trim().toLowerCase() === 'get started') {
              el.textContent = 'Start talking';
            }
            if (el.textContent.trim().toLowerCase().includes('start talking')) {
              el.onclick = (e) => {
                e.preventDefault();
                window.parent.postMessage({ action: 'navigate', url: '/platform/ai/chat' }, '*');
              };
            }
            if (el.getAttribute('role') === 'switch') {
              el.style.display = 'none';
            }
            if (el.textContent.trim() === 'Log in') {
              el.style.display = 'none';
            }
            if (el.textContent.trim() === 'Sign up') {
              el.textContent = 'Start talking';
              el.onclick = (e) => {
                e.preventDefault();
                window.parent.postMessage({ action: 'navigate', url: '/platform/ai/chat' }, '*');
              };
            }
            if (el.textContent.trim() === 'Subscribe') {
              el.style.display = 'none';
            }
          });
          
          // Fix Next.js image hydration reverting URLs to localhost
          document.querySelectorAll('img').forEach(img => {
            if (img.getAttribute('src') && img.getAttribute('src').startsWith('/')) {
              img.src = 'https://startup-template-sage.vercel.app' + img.getAttribute('src');
            }
            if (img.getAttribute('srcset') && img.getAttribute('srcset').includes('/_next/image')) {
              const newSrcset = img.getAttribute('srcset').split(',').map(s => {
                const parts = s.trim().split(' ');
                if (parts[0].startsWith('/')) {
                  parts[0] = 'https://startup-template-sage.vercel.app' + parts[0];
                }
                return parts.join(' ');
              }).join(', ');
              if (newSrcset !== img.getAttribute('srcset')) {
                img.setAttribute('srcset', newSrcset);
              }
            }
          });
        };
        
        // Run immediately and then aggressively poll
        replaceText();
        setInterval(replaceText, 50);
      </script>
    `;
    
    // Guarantee script injection by appending it to the HTML
    html = html + script;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        // Prevent caching so the proxy is always fresh
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Failed to proxy AI site:', error);
    return NextResponse.json({ error: 'Failed to proxy AI site' }, { status: 500 });
  }
}
