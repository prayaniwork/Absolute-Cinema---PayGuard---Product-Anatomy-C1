"""Pack sampled video frames (video_grid.json, from sample.py) into base64 clips for PayGuard-pixel.html.
usage: python3 export_clips.py video_grid.json clips.js"""
import sys, json, base64
vg = json.load(open(sys.argv[1]))
W, H = 66, 53
RANGES = {            # clip name -> (first frame, last frame) of the 12 fps sample
    'turn': (1, 58),   # a full turn: front, profile, back, profile (the one hero illustration)
}
def pack(rows):
    bits = ''.join(r.ljust(W, '0')[:W] for r in (rows + ['0' * W] * H)[:H])
    bits = bits.ljust(((len(bits) + 7) // 8) * 8, '0')
    return base64.b64encode(bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))).decode()
out = {k: [pack(vg[n - 1]['rows']) for n in range(a, b + 1)] for k, (a, b) in RANGES.items()}
open(sys.argv[2], 'w').write('const CLIPS=' + json.dumps(out) + ';')
print({k: len(v) for k, v in out.items()}, sum(len(x) for v in out.values() for x in v), 'bytes')
