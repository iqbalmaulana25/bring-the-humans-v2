// Entry program for the make.fun bounty "Bring the humans with a TikTok ad"
// (bring-the-humans-03), second entry. Node 22, standard library only.
//
// The entry itself is the video: an original short vertical ad for make.fun,
// made with ffmpeg from make.fun's press pack (brand badge from the first
// frame, referral end card with our own code closing it), posted publicly on
// TikTok. This program's whole job is to hand the video's address to the
// grader: it copies VIDEO.json from the repository root (the bot directory)
// into the output directory, where the gate reads it. Nothing the program
// writes about the video is scored; the house reads the video's views from
// TikTok itself.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly on a malformed VIDEO.json instead of handing the gate a file
// it can only refuse: the record must be a JSON object whose "url" is the
// video's full TikTok address.
const source = join(BOT_DIR, 'VIDEO.json');
let record: unknown;
try {
  record = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json in ${BOT_DIR} is not readable JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof record !== 'object' || record === null || typeof (record as { url?: unknown }).url !== 'string') {
  console.error('VIDEO.json must be an object with a string "url" naming the TikTok video');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
