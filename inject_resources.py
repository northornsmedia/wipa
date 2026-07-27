import os

files_to_update = [
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\profile\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\liked-threads\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\events\page.tsx"
]

injection = """              <Link href="/platform/resources" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <BookOpen size={16} /> Resource Library
              </Link>
"""

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "Resource Library" in content:
        continue
        
    # Find the Discussion Forums link
    target = """<MessageSquare size={16} /> Discussion Forums
              </Link>
"""
    if target in content:
        content = content.replace(target, target + injection)
    
    # Also we need to make sure BookOpen is imported if it's not.
    if "BookOpen" not in content:
        # Just simple replacement, hope it's not breaking.
        content = content.replace("lucide-react';", "BookOpen } from 'lucide-react';")
        content = content.replace("} from BookOpen", ", BookOpen") # fix the naive replacement
        
        # A safer way to inject import:
        import re
        content = re.sub(r'(import \{[^}]*)(\} from \'lucide-react\';)', r'\1, BookOpen \2', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated sidebars with Resource Library!")
