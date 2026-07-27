import os
import re

files_to_update = [
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\profile\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\liked-threads\page.tsx",
    r"C:\Users\91836\PERSONAL\CONNECT\src\app\platform\events\page.tsx"
]

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We need to make sure BookOpen is imported
    # It seems my previous script might have failed because the regex wasn't applied correctly or wasn't powerful enough across multiple lines
    # lucide-react imports usually span multiple lines.
    
    if " BookOpen" not in content and "BookOpen," not in content:
        # Find } from 'lucide-react'
        # we can replace "from 'lucide-react'" with ", BookOpen } from 'lucide-react'" but that's risky if it's multiple lines.
        # Let's just find "lucide-react" and insert BookOpen before the closing brace.
        # Actually, simpler: just find the first occurrence of "from 'lucide-react'" and look backwards for "}"
        idx = content.find("} from 'lucide-react'")
        if idx != -1:
            content = content[:idx] + ", BookOpen\n" + content[idx:]
        else:
            # maybe it's } from "lucide-react"
            idx2 = content.find('} from "lucide-react"')
            if idx2 != -1:
                content = content[:idx2] + ", BookOpen\n" + content[idx2:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed imports!")
