
const fs = require('fs');
const https = require('https');
const path = require('path');

const assetsDir = 'assets';
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

const images = [
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/prodairy.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/mafuro.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/probottlers.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/tbbc.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/natpak.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/probrands.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/mycash.webp',
    'https://www.innscorafrica.com/wp-content/uploads/2025/03/phi.webp',
    'http://www.innscorafrica.com/brands/other/capri/' // Wait this is a page URL likely? Subagent said "Logo: ..."
];

// Subagent said for Capri: "Logo: http://www.innscorafrica.com/brands/other/capri/" -> that looks like a page link.
// I'll guess the logo url or skip capri logo for now, or use a placeholder.
// Actually, I'll try to guess 'capri.webp' or similar if I could, but let's stick to the known valid ones.
// I'll skip Capri logo URL as it looks suspicious.

const validImages = images.filter(url => url.endsWith('.webp') || url.endsWith('.png') || url.endsWith('.jpg'));

function download(url, dest) {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Saved ${path.basename(dest)}`);
            });
        } else {
            console.log(`Failed ${url}: ${response.statusCode}`);
            fs.unlink(dest, () => { });
        }
    }).on('error', (err) => {
        fs.unlink(dest, () => { });
        console.error(err.message);
    });
}

validImages.forEach(url => {
    const filename = path.basename(url);
    const filepath = path.join(assetsDir, filename);
    download(url, filepath);
});
