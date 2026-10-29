"""Dev-only QR generator. Dependencies: qrcode==8.2, zxing-cpp==2.3.0, Pillow.
The site build serves the committed SVG/PNG and does not need these packages.
"""
from pathlib import Path
import qrcode
from qrcode.image.svg import SvgPathFillImage
from PIL import Image
import zxingcpp

url = 'https://restaudedina.vercel.app/'
out = Path(__file__).resolve().parent.parent / 'public' / 'qr'
out.mkdir(parents=True, exist_ok=True)
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=10, border=4)
qr.add_data(url)
qr.make(fit=True)
qr.make_image(fill_color='black', back_color='white').save(out / 'restaudedina.png')
qr.make_image(image_factory=SvgPathFillImage).save(out / 'restaudedina.svg')
result = zxingcpp.read_barcode(Image.open(out / 'restaudedina.png'))
assert result and result.text == url, 'QR decoding failed'
print('QR décodé :', result.text)
