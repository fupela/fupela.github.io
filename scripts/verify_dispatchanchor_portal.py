#!/usr/bin/env python3
"""Static verification for the DispatchAnchor portal PWA shell."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PORTAL = ROOT / "portal"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def assert_contains(text: str, needle: str, label: str) -> None:
    if needle not in text:
        raise AssertionError(f"Missing {label}: {needle}")


def main() -> None:
    required_files = [
        PORTAL / "index.html",
        PORTAL / "portal.css",
        PORTAL / "portal.js",
        PORTAL / "manifest.webmanifest",
        PORTAL / "service-worker.js",
    ]
    missing = [str(p.relative_to(ROOT)) for p in required_files if not p.exists()]
    if missing:
        raise AssertionError(f"Missing portal files: {missing}")

    html = read(PORTAL / "index.html")
    css = read(PORTAL / "portal.css")
    js = read(PORTAL / "portal.js")
    manifest = json.loads(read(PORTAL / "manifest.webmanifest"))
    sw = read(PORTAL / "service-worker.js")

    # PWA/installability basics
    assert_contains(html, 'rel="manifest"', "manifest link")
    assert_contains(html, 'name="viewport"', "mobile viewport")
    assert_contains(html, 'serviceWorker.register', "service worker registration")
    assert manifest["name"] == "DispatchAnchor Portal"
    assert manifest["display"] in {"standalone", "fullscreen"}
    assert manifest["start_url"].startswith("/portal/")

    # Product scope basics — form-first customer intake, not a checklist-led dashboard
    for section in [
        "Create your portal profile",
        "Business Setup Form",
        "Business Profile",
        "Agent Settings",
        "Phone Setup",
        "Call Inbox",
        "Subscription",
        "Pricing",
        "Database Preview",
    ]:
        assert_contains(html, section, section)

    # Pricing, registration/onboarding, and DispatchAnchor brand consistency basics
    for pricing_item in ["$499", "$199/mo", "Setup package", "Monthly dispatcher plan"]:
        assert_contains(html, pricing_item, pricing_item)
    assert_contains(html, "profileForm", "profile onboarding form")
    assert_contains(html, "Start your setup profile", "portal profile CTA")
    assert_contains(html, "/assets/dispatchanchor/icon-32.png", "DispatchAnchor logo asset")
    assert_contains(css, "#ff8a3c", "DispatchAnchor amber brand color")
    assert_contains(css, "#0c1424", "DispatchAnchor navy brand color")
    assert_contains(css, ".portal-form-grid", "mobile-friendly form grid")

    # Customer-control fields
    for field in [
        "Company name",
        "Trade",
        "Service area",
        "Business hours",
        "Primary alert phone",
        "Alert email",
        "Emergency rules",
        "Pricing policy",
    ]:
        assert_contains(html, field, field)

    # Mobile-friendly app shell and no external dependency requirement
    assert_contains(css, "@media (max-width: 760px)", "mobile breakpoint")
    assert_contains(css, "grid-template-columns", "responsive grid")
    assert_contains(js, "localStorage", "local demo persistence")
    assert_contains(js, "renderCalls", "call inbox renderer")
    assert_contains(sw, "portal/index.html", "portal SW cache")

    print("DispatchAnchor portal static verification passed.")


if __name__ == "__main__":
    main()
