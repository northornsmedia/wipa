import sys
try:
    import docx
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    import docx

doc = docx.Document(r"C:\Users\91836\PERSONAL\CONNECT\Women's IP World Alliance Community Platform (1).docx")
for p in doc.paragraphs:
    print(p.text)
