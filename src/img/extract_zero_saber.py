from PIL import Image, ImageFilter
import numpy as np

src = "d:/workspace/hung-blog/img/RMX4-Zero-Z-Saber-Attack.jpg"
out = "d:/workspace/hung-blog/img/avatar-zero-saber.png"

img = Image.open(src).convert("RGBA")
data = np.array(img)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# White background detection: pixels where R, G, B are all > threshold
threshold = 235
is_white = (r > threshold) & (g > threshold) & (b > threshold)

# Near-white with low saturation (catches off-white edges)
max_rgb = np.maximum(np.maximum(r.astype(int), g.astype(int)), b.astype(int))
min_rgb = np.minimum(np.minimum(r.astype(int), g.astype(int)), b.astype(int))
saturation = max_rgb - min_rgb
is_near_white = (r > 220) & (g > 220) & (b > 220) & (saturation < 20)

bg_mask = is_white | is_near_white

# Flood fill from corners to only remove connected white regions (not internal whites)
from scipy import ndimage

h, w = bg_mask.shape
seed = np.zeros_like(bg_mask)
seed[0, :] = bg_mask[0, :]
seed[-1, :] = bg_mask[-1, :]
seed[:, 0] = bg_mask[:, 0]
seed[:, -1] = bg_mask[:, -1]

# Iterative reconstruction to find connected background
struct = ndimage.generate_binary_structure(2, 2)
prev = np.zeros_like(seed)
while not np.array_equal(seed, prev):
    prev = seed.copy()
    seed = ndimage.binary_dilation(seed, structure=struct) & bg_mask

connected_bg = seed

# Create alpha channel: 0 for background, 255 for foreground
alpha = np.where(connected_bg, 0, 255).astype(np.uint8)

# Smooth edges slightly to avoid hard jaggies
from PIL import ImageFilter as IF
alpha_img = Image.fromarray(alpha)
alpha_img = alpha_img.filter(IF.MedianFilter(3))
alpha = np.array(alpha_img)

data[:,:,3] = alpha

result = Image.fromarray(data)

# Crop to content bounding box with small padding
bbox = result.getbbox()
if bbox:
    pad = 10
    x0 = max(0, bbox[0] - pad)
    y0 = max(0, bbox[1] - pad)
    x1 = min(result.width, bbox[2] + pad)
    y1 = min(result.height, bbox[3] + pad)
    result = result.crop((x0, y0, x1, y1))

result.save(out, "PNG", optimize=False)
print(f"Saved: {result.size[0]}x{result.size[1]}")
