import os

files_to_update = [
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\profile\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\liked-threads\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\events\page.tsx"
]

injection = """              <Link href="/platform/forums" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium text-sm transition-colors">
                <MessageSquare size={16} /> Discussion Forums
              </Link>
"""

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "Discussion Forums" in content:
        continue
        
    # Find the Groups link
    target = """<UsersRound size={16} /> Groups
              </Link>
"""
    if target in content:
        content = content.replace(target, target + injection)
    
    # Also we need to make sure MessageSquare is imported if it's not.
    if "MessageSquare" not in content:
        # Just simple replacement, hope it's not breaking.
        content = content.replace("UsersRound,", "UsersRound, MessageSquare,")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated sidebars!")
