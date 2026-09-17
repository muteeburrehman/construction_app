"""Management command to download assets from Wix CDN into media storage."""
from pathlib import Path
import urllib.request
from django.conf import settings
from django.core.management.base import BaseCommand

KNOWN_ASSETS = {
    "logo_horizontal": {
        "filename": "logo_horizontal.png",
        "url": "https://static.wixstatic.com/media/d251b1_eb0152792d4049b7b790265f669b4f4e~mv2.png",
    },
    "logo_vertical": {
        "filename": "logo_vertical.png",
        "url": "https://static.wixstatic.com/media/d251b1_005bdf697f0c4846a11cacd3cc1e2935.png",
    },
    "tower_exterior": {
        "filename": "tower_exterior.jpg",
        "url": "https://static.wixstatic.com/media/d251b1_1efb0c862f974f3fb3f7ee4319f1517b~mv2_d_4032_3024_s_4_2.jpg",
    },
    "custom_kitchen": {
        "filename": "custom_kitchen.png",
        "url": "https://static.wixstatic.com/media/d251b1_7035afeee35847a7882e1e6143d25d3d~mv2.png",
    },
    "living_room": {
        "filename": "living_room.png",
        "url": "https://static.wixstatic.com/media/d251b1_2ab4220f7d5341799746085c0954d41d~mv2.png",
    },
    "spaced_house": {
        "filename": "spaced_house.jpg",
        "url": "https://static.wixstatic.com/media/d251b1_f6b350664b5e4d75b3fc975353c0de40~mv2_d_4032_3024_s_4_2.jpg",
    },
    "commercial_facility": {
        "filename": "commercial_facility.jpg",
        "url": "https://static.wixstatic.com/media/d251b1_23aac9772827412bb13eb963d44ee27e~mv2_d_3000_2250_s_2.jpg",
    },
    "eric_portrait": {
        "filename": "eric_portrait.jpeg",
        "url": "https://static.wixstatic.com/media/d251b1_efcc30ca9fd046eb922787b6bf3cb0b4~mv2.jpeg",
    },
}


class Command(BaseCommand):
    help = "Pulls known Wix CDN assets into local media storage."

    def handle(self, *args, **options):
        dest_dir = Path(settings.MEDIA_ROOT) / "downloaded_assets"
        dest_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Downloading assets into: {dest_dir}")
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

        for key, asset in KNOWN_ASSETS.items():
            dest_path = dest_dir / asset["filename"]
            if dest_path.exists() and dest_path.stat().st_size > 0:
                self.stdout.write(self.style.SUCCESS(f"  [Exists] {asset['filename']}"))
                continue

            try:
                self.stdout.write(f"  Fetching {asset['filename']}...")
                req = urllib.request.Request(asset["url"], headers=headers)
                with urllib.request.urlopen(req, timeout=15) as resp, open(dest_path, "wb") as f:
                    f.write(resp.read())
                self.stdout.write(self.style.SUCCESS(f"  [Downloaded] {asset['filename']}"))
            except Exception as exc:
                self.stdout.write(
                    self.style.WARNING(f"  [Failed] Could not download {asset['filename']}: {exc}. Creating fallback image.")
                )
                self._create_fallback_image(dest_path)

        self.stdout.write(self.style.SUCCESS("Asset fetch completed successfully."))

    def _create_fallback_image(self, path: Path):
        from PIL import Image, ImageDraw

        img = Image.new("RGB", (1200, 800), color="#1C231C")
        draw = ImageDraw.Draw(img)
        draw.rectangle([20, 20, 1180, 780], outline="#6B2231", width=4)
        draw.text((600, 400), "Eric Sherwood Construction", fill="#EFEBE2", anchor="mm")
        img.save(path)
