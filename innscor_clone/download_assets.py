
import re
import os
import requests
from urllib.parse import urlparse

# Setup
html_file = 'index.html'
assets_dir = 'assets'
if not os.path.exists(assets_dir):
    os.makedirs(assets_dir)

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all images
# Regex to find src="http..." inside img tags or others
# We are looking specifically for innscorafrica.com/wp-content
url_pattern = re.compile(r'(https://www\.innscorafrica\.com/wp-content/uploads/[^"\')\s]+)')
urls = list(set(url_pattern.findall(content)))

print(f"Found {len(urls)} external assets to download.")

replacement_map = {}

for url in urls:
    try:
        # Create a local filename
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        # Handle query params if any ?v=...
        if '?' in filename:
            filename = filename.split('?')[0]
        
        # Avoid duplicate filenames from different years/months if name is same? 
        # For simplicity, we assume unique basenames or we prepend hash if needed.
        # Let's just use basename for now.
        
        local_path = os.path.join(assets_dir, filename)
        
        if not os.path.exists(local_path):
            print(f"Downloading {filename}...")
            r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
            if r.status_code == 200:
                with open(local_path, 'wb') as f_out:
                    f_out.write(r.content)
            else:
                print(f"Failed to download {url}: {r.status_code}")
        else:
            print(f"Skipping {filename} (already exists)")

        # Prepare replacement string
        # We need to replace the FULL URL with 'assets/filename'
        replacement_map[url] = f"assets/{filename}"

    except Exception as e:
        print(f"Error processing {url}: {e}")

# Update HTML content
new_content = content
for url, local in replacement_map.items():
    new_content = new_content.replace(url, local)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("HTML updated with local asset paths.")
