"""Build a static site without third-party build dependencies."""
from pathlib import Path
import shutil
import zipfile

root = Path(__file__).resolve().parent.parent
output = root / 'dist'
(output / 'assets').mkdir(parents=True, exist_ok=True)
html = (root / 'src/code.html').read_text()
for asset in root.glob('*.webp'):
    shutil.copy2(asset, output / 'assets' / asset.name)
    html = html.replace('https://d2oir5eh8rty2e.cloudfront.net/assets/images/' + asset.name, 'assets/' + asset.name)
(output / 'index.html').write_text(html)
assert '<title>Ananya Adventures</title>' in html
with zipfile.ZipFile(root / 'ananya-adventures.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in [output / 'index.html', *sorted((output / 'assets').glob('*.webp'))]:
        if file.is_file():
            archive.write(file, file.relative_to(output))
print('Ready: dist/index.html and ananya-adventures.zip')
