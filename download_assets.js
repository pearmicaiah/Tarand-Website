
const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const htmlFile = 'index.html';
const assetsDir = 'assets';

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

let content = fs.readFileSync(htmlFile, 'utf8');
const urlRegex = /(https:\/\/www\.innscorafrica\.com\/wp-content\/uploads\/[^"'\)\s]+)/g;
const matches = [...new Set(content.match(urlRegex) || [])];

console.log(`Found ${matches.length} external assets.`);

let downloadCount = 0;

function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close(cb);
        });
    }).on('error', (err) => {
        fs.unlink(dest, () => { }); // Delete the file async. (But we don't check the result) - valid for cleanup
        if (cb) cb(err.message);
    });
}

// Process duplicates/names
matches.forEach((url, index) => {
    try {
        const parsed = new URL(url);
        let filename = path.basename(parsed.pathname);
        const filepath = path.join(assetsDir, filename);

        // Download only if not exists (or overwrite? user said download missing. safer to download all to be sure)
        // We'll trust existing files to save bandwidth if needed, but for "Missing" implies we should ensure they are there.
        // Let's just download.

        console.log(`Downloading: ${filename}`);
        download(url, filepath, (err) => {
            if (err) console.error(`Error downloading ${url}: ${err}`);
            else console.log(`Saved ${filename}`);
        });

        // Update HTML content in memory
        // We need to escape special regex chars if we used regex for replacement, but simpler to use string replace
        // Note: Global replace might be needed if URL appears multiple times
        content = content.split(url).join(`assets/${filename}`);

    } catch (e) {
        console.error(`Skipping ${url}: ${e.message}`);
    }
});

// Write updated HTML
fs.writeFileSync(htmlFile, content, 'utf8');
console.log('Updated index.html references.');
