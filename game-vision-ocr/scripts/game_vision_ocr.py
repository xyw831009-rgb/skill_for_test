#!/usr/bin/env python3
"""OCR helper for canvas game screenshots."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

from PIL import Image, ImageEnhance, ImageOps


SLOT_HUD_REGIONS = {
    "balance": (0.00, 0.785, 0.335, 0.850),
    "stake": (0.335, 0.785, 0.665, 0.850),
    "win": (0.665, 0.785, 1.000, 0.850),
    "banner": (0.120, 0.700, 0.885, 0.785),
    "top_counter": (0.250, 0.000, 0.750, 0.160),
}


def load_rapidocr():
    try:
        from rapidocr_onnxruntime import RapidOCR

        return RapidOCR()
    except Exception:
        return None


def ocr_with_tesseract(image: Image.Image, numeric: bool = False) -> list[dict[str, Any]]:
    import pytesseract

    gray = ImageOps.grayscale(image)
    gray = ImageEnhance.Contrast(gray).enhance(2.5)
    scaled = gray.resize((gray.width * 3, gray.height * 3))
    config = "--psm 7" if numeric else "--psm 6"
    if numeric:
        config += " -c tessedit_char_whitelist=0123456789,."
    text = pytesseract.image_to_string(scaled, lang="chi_sim+eng+snum", config=config)
    return [{"text": text.strip(), "score": None, "box": None}]


def ocr_image(ocr: Any, image_path: Path) -> list[dict[str, Any]]:
    if ocr is None:
        return ocr_with_tesseract(Image.open(image_path).convert("RGB"))

    result, _ = ocr(str(image_path))
    return normalize_rapidocr_result(result)


def ocr_pil_image(ocr: Any, image: Image.Image, temp_path: Path, numeric: bool = False) -> list[dict[str, Any]]:
    if ocr is None:
        return ocr_with_tesseract(image, numeric=numeric)

    temp_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(temp_path)
    result, _ = ocr(str(temp_path))
    return normalize_rapidocr_result(result)


def normalize_rapidocr_result(result: Any) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for item in result or []:
        box, text, score = item
        xs = [float(point[0]) for point in box]
        ys = [float(point[1]) for point in box]
        items.append(
            {
                "text": str(text),
                "score": float(score),
                "box": [min(xs), min(ys), max(xs), max(ys)],
            }
        )
    return items


def proportional_crop(image: Image.Image, region: tuple[float, float, float, float]) -> Image.Image:
    width, height = image.size
    left, top, right, bottom = region
    return image.crop(
        (
            int(left * width),
            int(top * height),
            int(right * width),
            int(bottom * height),
        )
    )


def extract_numbers(text: str) -> list[str]:
    return re.findall(r"\d[\d,.]*", text)


def join_text(items: list[dict[str, Any]]) -> str:
    return " ".join(item["text"] for item in items if item.get("text")).strip()


def run(args: argparse.Namespace) -> dict[str, Any]:
    image_path = Path(args.image).expanduser().resolve()
    image = Image.open(image_path).convert("RGB")
    ocr = load_rapidocr()
    temp_dir = Path(args.temp_dir).expanduser().resolve()

    output: dict[str, Any] = {
        "image": str(image_path),
        "image_size": list(image.size),
        "engine": "rapidocr-onnxruntime" if ocr is not None else "tesseract-fallback",
    }

    if args.full:
        full_items = ocr_image(ocr, image_path)
        output["full_ocr"] = {
            "items": full_items,
            "text": join_text(full_items),
            "numbers": extract_numbers(join_text(full_items)),
        }

    if args.preset == "slot-hud":
        regions: dict[str, Any] = {}
        for name, region in SLOT_HUD_REGIONS.items():
            crop = proportional_crop(image, region)
            crop_items = ocr_pil_image(ocr, crop, temp_dir / f"{image_path.stem}_{name}.png", numeric=True)
            text = join_text(crop_items)
            regions[name] = {
                "text": text,
                "numbers": extract_numbers(text),
                "items": crop_items,
            }
        output["regions"] = regions

    return output


def main() -> None:
    parser = argparse.ArgumentParser(description="OCR canvas game screenshots into structured JSON.")
    parser.add_argument("--image", required=True, help="Path to screenshot image.")
    parser.add_argument("--preset", choices=["slot-hud"], help="Optional crop preset.")
    parser.add_argument("--full", action="store_true", help="Run full-image OCR.")
    parser.add_argument("--out", help="Optional JSON output path.")
    parser.add_argument("--temp-dir", default="/tmp/game_vision_ocr", help="Temporary crop directory.")
    args = parser.parse_args()

    if not args.full and not args.preset:
        args.full = True

    output = run(args)
    text = json.dumps(output, ensure_ascii=False, indent=2)

    if args.out:
        Path(args.out).expanduser().resolve().write_text(text + "\n", encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
