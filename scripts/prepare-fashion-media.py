"""Rebuild user-requested media from the original photos.zip contents.
Usage: python3 scripts/prepare-fashion-media.py /path/to/extracted/photos
Requires ffmpeg and Pillow. Source photos/videos are user supplied, not fetched.
"""
from pathlib import Path
from PIL import Image, ImageOps
import subprocess, sys, tempfile, json
source = Path(sys.argv[1])
public = Path(__file__).resolve().parents[1] / 'public/editorial'
images = public / 'images'
motion = public / 'motion'
images.mkdir(parents=True, exist_ok=True)
manifest = []
def run(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-threads', '2', *args], check=True)
def frame(stem, seconds, name):
    with tempfile.TemporaryDirectory() as temp:
        path = Path(temp) / 'frame.png'
        run(['-ss', str(seconds), '-i', str(source / (stem + '.mp4')), '-frames:v', '1', '-y', str(path)])
        im = Image.open(path).convert('RGB')
        im.thumbnail((900, 1280))
        im.save(images / (name + '.webp'), quality=87, method=6)
    manifest.append({'asset': name + '.webp', 'source': stem + '.mp4', 'seconds': seconds})
frame('reelsvideo.io_1792068834191', 5.6, 'career_pattern_cutting')
frame('reelsvideo.io_1792068689368', 1.15, 'profile_red_carpet_gold')
frame('reelsvideo.io_1792068759589', 6.4, 'inspiration_yellow_model')
frame('reelsvideo.io_1792068759589', 31.8, 'inspiration_lilac_model')
frame('reelsvideo.io_1792068962750', 2.1, 'inspiration_mauve_model')
frame('reelsvideo.io_1792068716233', 23, 'inspiration_monochrome_model')
im = Image.open(source / 'reelsvideo.io_1792069035883.jpeg').convert('RGB')
im.thumbnail((1000, 1500))
im.save(images / 'profile_red_carpet_black.webp', quality=88, method=6)
manifest.append({'asset': 'profile_red_carpet_black.webp', 'source': 'reelsvideo.io_1792069035883.jpeg'})
# Seven quick scenes: three crafts and four model looks. Contain foreground
# preserves full dresses; a softly blurred source fills the wider hero frame.
scenes = [
 ('reelsvideo.io_1792068834191', 4.3, .85),
 ('reelsvideo.io_1792068689368', 1.05, 1.25),
 ('reelsvideo.io_1792068777441', 10.1, .85),
 ('reelsvideo.io_1792068759589', 6.0, 1.2),
 ('reelsvideo.io_1792068796270', 13.0, .85),
 ('reelsvideo.io_1792068759589', 31.2, 1.2),
 ('reelsvideo.io_1792068962750', 1.0, 1.2),
]
with tempfile.TemporaryDirectory() as temp:
    temp = Path(temp)
    for i, (stem, start, duration) in enumerate(scenes):
        filters = '[0:v]setpts=(PTS-STARTPTS)/1.12,fps=30,split=2[bg][fg];[bg]scale=720:800:force_original_aspect_ratio=increase,crop=720:800,boxblur=24:2[blur];[fg]scale=720:800:force_original_aspect_ratio=decrease[sharp];[blur][sharp]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p[out]'
        run(['-ss', str(start), '-i', str(source / (stem + '.mp4')), '-filter_complex_threads', '1', '-filter_complex', filters, '-map', '[out]', '-t', str(duration), '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-y', str(temp / f'{i}.mp4')])
    (temp / 'concat.txt').write_text(''.join(f"file '{i}.mp4'\n" for i in range(len(scenes))))
    target = motion / 'hero_atelier_montage.mp4'
    run(['-f', 'concat', '-safe', '0', '-i', str(temp / 'concat.txt'), '-an', '-c:v', 'copy', '-movflags', '+faststart', '-y', str(target)])
    run(['-i', str(target), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', '-y', str(motion / 'hero_atelier_montage.webm')])
    # Start poster on the first scene for a clean handoff to autoplay.
    run(['-i', str(target), '-frames:v', '1', '-quality', '87', '-y', str(images / 'hero_atelier_poster.webp')])
(public / 'fashion-media-manifest.json').write_text(json.dumps({'images': manifest, 'montage': [{'source': s + '.mp4', 'start': t, 'duration': d} for s,t,d in scenes]}, indent=2))
print('Fashion media rebuilt successfully.')
