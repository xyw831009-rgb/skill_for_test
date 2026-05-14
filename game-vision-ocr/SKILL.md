---
name: game-vision-ocr
description: Extract structured text and numeric fields from canvas game screenshots for visual UI automation. Use when Codex needs OCR for slot or canvas game testing, including balances, bet amounts, win amounts, history records, leaderboard values, rules text, payout tables, free-spin counters, and screenshot-based result verification.
---

# Game Vision OCR

## Overview

Use this skill to turn canvas game screenshots into structured OCR output. Prefer it when visual inspection needs repeatable numeric extraction rather than only human-readable screenshots.

The bundled script prioritizes RapidOCR when available and falls back to Tesseract. RapidOCR is usually better for Chinese text, game HUD numbers, outlined fonts, and mixed text-number UI.

## Workflow

1. Capture a browser screenshot from the game.
2. Run `scripts/game_vision_ocr.py` on the screenshot.
3. Use `--preset slot-hud` for standard bottom HUD fields such as balance, stake, and win.
4. Use `--full` when reading rules pages, payout tables, history records, or unknown layouts.
5. Treat OCR as an aid, not the only source of truth. Verify critical failures with the screenshot.

## Commands

Run full-image OCR:

```bash
python skills/game-vision-ocr/scripts/game_vision_ocr.py --image path/to/screenshot.png --full
```

Run standard slot HUD OCR:

```bash
python skills/game-vision-ocr/scripts/game_vision_ocr.py --image path/to/screenshot.png --preset slot-hud
```

Write JSON output:

```bash
python skills/game-vision-ocr/scripts/game_vision_ocr.py --image path/to/screenshot.png --preset slot-hud --full --out ocr.json
```

If a project has a dedicated OCR virtual environment, use that interpreter instead:

```bash
.venv-ocr/bin/python skills/game-vision-ocr/scripts/game_vision_ocr.py --image path/to/screenshot.png --preset slot-hud --full
```

## Output Use

Use `regions.balance`, `regions.stake`, and `regions.win` for numeric checks when the game uses the standard bottom HUD layout.

Use `full_ocr` for:

- rules page text
- payout table values
- history detail lines
- leaderboard rows
- free-spin counters and total win banners

Prefer regex extraction from OCR text for numeric fields, then cross-check with bounding boxes and the original screenshot if the value is surprising.

## Cautions

- OCR can confuse stylized `10` with `70`, especially on large symbol art. Give more trust to HUD text than reel symbols.
- Free-spin and win-summary banners may include multiple numbers in one region. Verify whether the extracted number is a total win, a counter, or a symbol value.
- Region presets are based on screenshot proportions, not fixed pixels, so they tolerate moderate viewport changes but still need visual confirmation after a major layout change.
- For pass/fail decisions involving money, require agreement between at least two signals when possible, such as HUD OCR plus history OCR, or OCR plus manual visual review.

## References

Read `references/regions.md` when adding or adjusting crop presets for a new game layout.
