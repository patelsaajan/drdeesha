#!/usr/bin/env python3
"""Re-cut the before/after pairs in public/images/cases from the originals.

The slider in BeforeAfterSlider.vue paints both halves of a pair object-cover
into one 3:2 box and wipes between them. That only reads as one mouth changing
if the two photographs are *registered*: the same anatomy at the same place in
the frame. They are not registered as shot, because each pair is two separate
sessions with the patient and camera in slightly different positions.

So this estimates the uniform scale + translation that maps the before onto the
after, picks a 3:2 window that exists in both frames and sits on the lit
subject, and writes the pair out. Run it after swapping a photograph. Editing
one half of a pair by hand and leaving the other alone is what breaks the
effect, and the break is easy to miss on a still.

    python3 tools/align-cases.py            # re-cut every pair
    python3 tools/align-cases.py 8 9        # just these
    python3 tools/align-cases.py --check    # write comb strips, publish nothing

Needs Pillow, and the gitignored originals in case-originals/. --check writes
interleaved before/after strips to tools/.check/: at a correct alignment the
gum line, lip line and tooth boundaries run straight across every strip seam,
and only the treated teeth ghost.
"""
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'images', 'cases')
SRC = os.path.join(ROOT, 'case-originals')

AR = 3 / 2      # published aspect; must match the slider's aspect-3/2 box
MAXW = 1800     # published width cap
PROXY = 1400    # working resolution for the search
QUALITY = 82

# The originals were handed over with inconsistent names and extensions, and
# one typo ("befpre") that is left alone rather than renamed, so that the file
# on disk still matches what was delivered.
PAIRS = {
    1: ('case-1-after.jpeg', 'case-1-before.jpeg'),
    2: ('case-2-after.jpg', 'case-2-before.jpg'),
    3: ('case-3-after.JPG', 'case-3-before.JPG'),
    4: ('case-4-after.jpg', 'case-4-befpre.JPG'),
    5: ('case-5-after.JPG', 'case-5-before.JPG'),
    6: ('case-6-after.JPG', 'case-6-before.JPG'),
    7: ('case-7-after.jpeg', 'case-7-before.jpeg'),
    8: ('case-8-after.jpeg', 'case-8-before.jpeg'),
    9: ('case-9-after.jpeg', 'case-9-before.jpeg'),
}


# --- registration ----------------------------------------------------------

def proxy(path):
    im = Image.open(path)
    full_w = im.width
    im.draft('L', (PROXY, PROXY))
    if im.width > PROXY:
        im = im.resize((PROXY, round(PROXY * im.height / im.width)), Image.LANCZOS)
    return im.convert('L'), full_w


def prep(g, w):
    """Blur is the whole trick: it discards tooth texture and shade, which is
    exactly what the treatment changed, and keeps the structure that has to
    line up (lip outline, mouth aperture, philtrum, chin)."""
    h = max(1, round(w * g.height / g.width))
    s = ImageOps.autocontrast(g.resize((w, h), Image.LANCZOS), cutoff=1)
    return s.filter(ImageFilter.GaussianBlur(w / 90))


def score(A, B, win, dx, dy):
    """Mean abs difference over a FIXED window of A, so every candidate is
    judged on the same pixels. Scoring their overlap instead quietly rewards
    small scales: shrink the before enough and there is less left to disagree,
    and the search walks off toward a degenerate tiny match."""
    x0, y0, x1, y1 = win
    b = (x0 - dx, y0 - dy, x1 - dx, y1 - dy)
    if b[0] < 0 or b[1] < 0 or b[2] > B.width or b[3] > B.height:
        return 1e9
    return ImageStat.Stat(ImageChops.difference(A.crop(win), B.crop(b))).mean[0]


def search(ga, gb, width, scales, dxs, dys, nominal):
    A = prep(ga, width)
    m = 0.2                                    # judge on the central 60%
    win = (round(A.width * m), round(A.height * m),
           round(A.width * (1 - m)), round(A.height * (1 - m)))
    best = None
    for s in scales:
        B = prep(gb, max(8, round(gb.width * s * nominal * width / ga.width)))
        for dx in dxs:
            for dy in dys:
                v = score(A, B, win, dx, dy)
                if best is None or v < best[0]:
                    best = (v, s, dx, dy)
    return best if best and best[0] < 1e8 else (1e9, 1.0, 0, 0)


def align(after_path, before_path):
    """after_xy == before_xy * scale + (tx, ty), in each original's own pixels.

    Coarse pass over a wide scale range, then two refinements at doubling
    resolution. The range is deliberately wider than any plausible framing
    difference: a minimum that lands on the edge of the range is not a
    minimum, and one pair here genuinely sits at 0.84.
    """
    ga, aw = proxy(after_path)
    gb, bw = proxy(before_path)
    nominal = ga.width / gb.width
    span = lambda a, b, n: [a + (b - a) * i / (n - 1) for i in range(n)]

    v, s, dx, dy = search(ga, gb, 160, span(0.72, 1.34, 17),
                          list(range(-34, 35, 2)), list(range(-24, 25, 2)), nominal)
    W = 160
    for width, rad, ss in ((320, 7, 0.05), (640, 8, 0.024)):
        k = width / W
        dx, dy, W = round(dx * k), round(dy * k), width
        v, s, dx, dy = search(ga, gb, width, span(s - ss, s + ss, 9),
                              [dx + i for i in range(-rad, rad + 1)],
                              [dy + i for i in range(-rad, rad + 1)], nominal)
    base = search(ga, gb, W, [1.0], [0], [0], nominal)[0]
    return {'scale': s * aw / bw, 'tx': dx * aw / W, 'ty': dy * aw / W,
            'residual': v, 'baseline': base}


# --- framing ---------------------------------------------------------------

def shared_region(tf, after, before):
    """The part of the after frame that also exists in the before frame."""
    s, tx, ty = tf['scale'], tf['tx'], tf['ty']
    return (max(0, tx) + 1, max(0, ty) + 1,
            min(after.width, tx + before.width * s) - 1,
            min(after.height, ty + before.height * s) - 1)


def content_box(im, region, thresh=48, sample=400):
    """Bounding box of the lit subject inside `region`.

    Half of these are retracted intraoral shots on black, where the largest
    window that merely exists in both frames is mostly void. Framing on the
    subject is what keeps the teeth big in a 3:2 card. A full-face shot has
    nothing under the threshold, so this returns `region` and the framing
    falls back to centred.
    """
    r = tuple(round(v) for v in region)
    crop = im.convert('L').crop(r)
    k = min(1.0, sample / max(crop.width, crop.height))
    small = crop.resize((max(1, round(crop.width * k)), max(1, round(crop.height * k))))
    bb = small.point(lambda v: 255 if v > thresh else 0).getbbox()
    if not bb:
        return region
    return (r[0] + bb[0] / k, r[1] + bb[1] / k, r[0] + bb[2] / k, r[1] + bb[3] / k)


def frame_on(valid, content):
    """Smallest 3:2 window covering `content`, clamped inside `valid`."""
    cw, ch = content[2] - content[0], content[3] - content[1]
    vw, vh = valid[2] - valid[0], valid[3] - valid[1]
    w = min(max(cw, ch * AR), vw, vh * AR)
    h = w / AR
    cx = min(max((content[0] + content[2]) / 2, valid[0] + w / 2), valid[2] - w / 2)
    cy = min(max((content[1] + content[3]) / 2, valid[1] + h / 2), valid[3] - h / 2)
    return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)


def cut(n, tf, box):
    """Render both halves of the pair for the shared window `box`.

    Each side is rendered at its own native resolution for that window, so a
    low-res source is never upscaled to meet its partner and a high-res one is
    never thrown away — the slider paints both object-cover into one box, so
    only the ratio has to match, not the pixel count. The width is forced to a
    multiple of 3 so the ratio is exactly 3:2 and not 1.5007, which
    object-cover would resolve by cropping the two sides differently and
    undoing the registration this whole script exists to get.
    """
    after = Image.open(os.path.join(SRC, PAIRS[n][0])).convert('RGB')
    before = Image.open(os.path.join(SRC, PAIRS[n][1])).convert('RGB')
    s, tx, ty = tf['scale'], tf['tx'], tf['ty']
    bbox = ((box[0] - tx) / s, (box[1] - ty) / s, (box[2] - tx) / s, (box[3] - ty) / s)

    def fit(im, b):
        w = int(min(MAXW, b[2] - b[0])) // 3 * 3
        return im.resize((w, w * 2 // 3), Image.LANCZOS, box=b)

    return fit(before, bbox), fit(after, box)


def comb(b, a, W=760):
    """Interleaved strips: misregistration shows as a step at every seam."""
    H = round(W / AR)
    b, a = b.resize((W, H), Image.LANCZOS), a.resize((W, H), Image.LANCZOS)
    out = b.copy()
    for x in range(0, W, 56):
        out.paste(a.crop((x, 0, x + 28, H)), (x, 0))
    return out


def main(argv):
    check = '--check' in argv
    wanted = [int(a) for a in argv if a.isdigit()] or sorted(PAIRS)
    if check:
        os.makedirs(os.path.join(ROOT, 'tools', '.check'), exist_ok=True)
    for n in wanted:
        ap = os.path.join(SRC, PAIRS[n][0])
        bp = os.path.join(SRC, PAIRS[n][1])
        tf = align(ap, bp)
        after, before = Image.open(ap), Image.open(bp)
        valid = shared_region(tf, after, before)
        box = frame_on(valid, content_box(after, valid))
        b, a = cut(n, tf, box)
        if check:
            path = os.path.join(ROOT, 'tools', '.check', f'case-{n}.png')
            sheet = comb(b, a)
            ImageDraw.Draw(sheet).text((8, 6), f'case {n}', fill=(255, 235, 0))
            sheet.save(path)
        else:
            for im, phase in ((b, 'before'), (a, 'after')):
                im.save(os.path.join(OUT, f'case-{n}-{phase}.webp'),
                        'WEBP', quality=QUALITY, method=6)
        print(f'case {n}: scale={tf["scale"]:.4f} '
              f't=({tf["tx"]:.0f},{tf["ty"]:.0f}) '
              f'residual={tf["residual"]:.2f} (unaligned {tf["baseline"]:.2f}) '
              f'before={b.size} after={a.size}')


if __name__ == '__main__':
    main(sys.argv[1:])
