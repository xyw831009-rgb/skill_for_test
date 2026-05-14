# OCR Region Presets

## slot-hud

The `slot-hud` preset targets the standard mobile slot bottom HUD used by the current canvas game tests.

Fields:

- `balance`: bottom-left balance value
- `stake`: bottom-center bet or stake value
- `win`: bottom-right current win value
- `banner`: center result or summary banner above the HUD
- `top_counter`: top-center counter area, useful for ways, free-spin counters, or feature values

The preset uses proportional image coordinates so it works across screenshots with similar portrait layouts. If the game viewport changes substantially, capture one screenshot, inspect the visible HUD, and adjust the preset boxes in `scripts/game_vision_ocr.py`.

## Practical Extraction Notes

- Use `balance`, `stake`, and `win` for financial consistency checks.
- Use `banner` for `共赢得`, `赢得`, and free-spin summary text.
- Use `top_counter` only as supporting evidence because top displays often combine symbol art and counters.
- Avoid reading reel symbols as financial values unless the screenshot is a history detail panel with clear labels.
