// Generates simple minimalist PNG app icons (dark bg + ring) without external deps.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size, draw) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = draw(x, y, size);
      const o = rowStart + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const idat = deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Optima icon: dark bg (#0a0a0a), amber ring representing focus, rounded square mask.
function drawIcon(x, y, size) {
  const cx = size / 2, cy = size / 2;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const cornerRadius = size * 0.22;
  const half = size / 2;
  const inCorner = Math.abs(dx) > half - cornerRadius && Math.abs(dy) > half - cornerRadius;
  if (inCorner) {
    const cornerDist = Math.hypot(Math.abs(dx) - (half - cornerRadius), Math.abs(dy) - (half - cornerRadius));
    if (cornerDist > cornerRadius) return [0, 0, 0, 0];
  }

  const outerR = size * 0.30;
  const innerR = size * 0.185;
  if (dist < innerR) {
    return [10, 10, 10, 255];
  }
  if (dist <= outerR) {
    return [245, 158, 11, 255]; // amber-500 ring
  }
  return [10, 10, 10, 255];
}

mkdirSync("public/icons", { recursive: true });

const sizes = [192, 512];
for (const s of sizes) {
  writeFileSync(`public/icons/icon-${s}.png`, makePng(s, drawIcon));
}
writeFileSync("public/icons/apple-touch-icon.png", makePng(180, drawIcon));

console.log("Icons generated.");
