import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if '—' not in content:
        return
    
    # Specific known lines
    content = content.replace("SYN · together — ARKHE · origin — ARKIA · the radiant", "SYN · together, ARKHE · origin, ARKIA · the radiant")
    content = content.replace("For most of history they were three rooms in one temple — beauty,", "For most of history they were three rooms in one temple: beauty,")
    content = content.replace("we'd half-forgotten —", "we'd half-forgotten:")
    
    # "04 — Contact" -> "04: Contact"
    for i in range(1, 10):
        content = content.replace(f"0{i} — ", f"0{i}: ")
        
    content = content.replace("If the quality of your work exceeds the quality of your systems —", "If the quality of your work exceeds the quality of your systems...")
    content = content.replace("Our fees reflect what the outcome is worth to you —", "Our fees reflect what the outcome is worth to you:")
    content = content.replace("Led by Leï Zagato — systems thinker", "Led by Leï Zagato, systems thinker")
    content = content.replace("Supported by a curated network of senior operators — designers, developers, copywriters, and specialists — activated per project", "Supported by a curated network of senior operators: designers, developers, copywriters, and specialists, activated per project")
    content = content.replace("syn — together", "syn: together")
    content = content.replace("archia — to rise", "archia: to rise")

    # General replacements
    content = content.replace(" —<br", ":<br")
    content = content.replace(" —\n", ":\n")
    content = content.replace(" — ", ", ")
    content = content.replace("—", ":")

    with open(filepath, 'w') as f:
        f.write(content)

def main():
    src_dir = '/Users/leizagato/Desktop/Antigravity/synarkia-web/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
