from PIL import Image
import collections

# Work at native 512x512 resolution where holes are smaller
img = Image.open("avatar-zero-sworddown-blackbg-cleaner.png").convert("RGB")
w, h = img.size
pixels = img.load()
print(f"Source: {w}x{h}")

# ── Step 1: Remove floating fragments ──
non_black = set()
for x in range(w):
    for y in range(h):
        if pixels[x, y] != (0, 0, 0):
            non_black.add((x, y))

vis = set()
components = []
def bfs_comp(start):
    comp = set()
    queue = collections.deque([start])
    vis.add(start)
    while queue:
        x, y = queue.popleft()
        comp.add((x, y))
        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]:
            nx, ny = x+dx, y+dy
            if (nx, ny) in non_black and (nx, ny) not in vis:
                vis.add((nx, ny))
                queue.append((nx, ny))
    return comp

for px in non_black:
    if px not in vis:
        components.append(bfs_comp(px))

components.sort(key=len, reverse=True)
main_body = components[0]

for x in range(w):
    for y in range(h):
        if (x, y) in non_black and (x, y) not in main_body:
            pixels[x, y] = (0, 0, 0)
print(f"Step 1: Removed {len(non_black) - len(main_body)} fragments")

# ── Step 2: Seal thin black channels ──
# At 1x resolution, gaps should be 1-2px wide
sealed = set()
for gap in [2, 3, 4]:
    for x in range(gap, w - gap):
        for y in range(gap, h - gap):
            if pixels[x, y] != (0, 0, 0):
                continue
            if (x, y) in sealed:
                continue

            has_left = any(pixels[x-d, y] != (0, 0, 0) for d in range(1, gap+1) if x-d >= 0)
            has_right = any(pixels[x+d, y] != (0, 0, 0) for d in range(1, gap+1) if x+d < w)
            has_top = any(pixels[x, y-d] != (0, 0, 0) for d in range(1, gap+1) if y-d >= 0)
            has_bottom = any(pixels[x, y+d] != (0, 0, 0) for d in range(1, gap+1) if y+d < h)

            if (has_left and has_right) or (has_top and has_bottom):
                sealed.add((x, y))

print(f"Step 2: Sealed {len(sealed)} channel pixels")

# Temporarily mark sealed pixels
for x, y in sealed:
    pixels[x, y] = (1, 1, 1)

# ── Step 3: Find interior holes ──
exterior = set()
queue = collections.deque()
for x in range(w):
    for y in [0, h-1]:
        if pixels[x, y] == (0, 0, 0) and (x,y) not in exterior:
            exterior.add((x,y))
            queue.append((x,y))
for y in range(h):
    for x in [0, w-1]:
        if pixels[x, y] == (0, 0, 0) and (x,y) not in exterior:
            exterior.add((x,y))
            queue.append((x,y))

while queue:
    x, y = queue.popleft()
    for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
        nx, ny = x+dx, y+dy
        if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny] == (0,0,0) and (nx,ny) not in exterior:
            exterior.add((nx,ny))
            queue.append((nx,ny))

holes = set()
for x in range(w):
    for y in range(h):
        if pixels[x, y] == (0, 0, 0) and (x,y) not in exterior:
            holes.add((x, y))

holes.update(sealed)
for x, y in sealed:
    pixels[x, y] = (0, 0, 0)

print(f"Step 3: {len(holes)} interior holes (was 17820/2=~8910 at 2x, now finding body holes too)")

# ── Step 4: Fill holes ──
filled_total = 0
for pass_num in range(30):
    to_fill = {}
    for x, y in list(holes):
        nr, ng, nb = [], [], []
        for dx in range(-2, 3):
            for dy in range(-2, 3):
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x+dx, y+dy
                if 0 <= nx < w and 0 <= ny < h and (nx,ny) not in holes:
                    r, g, b = pixels[nx, ny]
                    if r + g + b > 3:
                        wt = 2 if abs(dx) <= 1 and abs(dy) <= 1 else 1
                        for _ in range(wt):
                            nr.append(r); ng.append(g); nb.append(b)
        if len(nr) >= 3:
            to_fill[(x,y)] = (int(sum(nr)/len(nr)), int(sum(ng)/len(ng)), int(sum(nb)/len(nb)))

    for (x,y), color in to_fill.items():
        pixels[x,y] = color
        holes.discard((x,y))
    filled_total += len(to_fill)
    if len(to_fill) == 0:
        break
    print(f"  Pass {pass_num+1}: filled {len(to_fill)} ({len(holes)} remaining)")

print(f"Step 4: Total filled {filled_total}")

# ── Step 5: Gentle fringe bottom 45% ──
current_pixels = set()
for x in range(w):
    for y in range(h):
        if pixels[x, y] != (0, 0, 0):
            current_pixels.add((x, y))

min_y_body = min(y for x, y in current_pixels)
max_y_body = max(y for x, y in current_pixels)
content_h = max_y_body - min_y_body
fringe_y_start = min_y_body + int(content_h * 0.55)

def is_gold(r, g, b):
    if r > 120 and g > 60 and b < 70 and r > b * 2:
        return True
    if 70 < r < 170 and 40 < g < 120 and b < 50 and r > g:
        return True
    return False

for pass_num in range(2):
    boundary = set()
    for x, y in list(current_pixels):
        if y < fringe_y_start:
            continue
        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            nx, ny = x+dx, y+dy
            if 0 <= nx < w and 0 <= ny < h and pixels[nx, ny] == (0,0,0):
                boundary.add((x, y))
                break
    nibbled = 0
    for x, y in boundary:
        r, g, b = pixels[x, y]
        if is_gold(r, g, b):
            pixels[x, y] = (0, 0, 0)
            current_pixels.discard((x, y))
            nibbled += 1
    print(f"Step 5: Fringe pass {pass_num+1}: nibbled {nibbled}")

# ── Step 6: Upscale 2x, crop, square ──
current_pixels = set()
for x in range(w):
    for y in range(h):
        if pixels[x, y] != (0, 0, 0):
            current_pixels.add((x, y))

min_x = min(x for x, y in current_pixels)
max_x = max(x for x, y in current_pixels)
min_y = min(y for x, y in current_pixels)
max_y = max(y for x, y in current_pixels)

pad = 5
cropped = img.crop((max(0,min_x-pad), max(0,min_y-pad), min(w-1,max_x+pad)+1, min(h-1,max_y+pad)+1))

# Upscale 2x for the final image
upscaled = cropped.resize((cropped.width*2, cropped.height*2), Image.NEAREST)

uw, uh = upscaled.size
side = max(uw, uh)
square = Image.new("RGB", (side, side), (0, 0, 0))
square.paste(upscaled, ((side-uw)//2, (side-uh)//2))

square.save("avatar-zero-final.png")
print(f"Saved avatar-zero-final.png ({side}x{side})")

small = square.resize((256, 256), Image.NEAREST)
small.save("avatar-zero-final-256.png")
print("Saved avatar-zero-final-256.png")
