# -*- coding: utf-8 -*-
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8767/"
out = Path(__file__).resolve().parent.parent / "_shots"
out.mkdir(exist_ok=True)
logs = []

def shot(page, name):
    page.screenshot(path=str(out / name), full_page=True)

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("pageerror", lambda err: logs.append(f"ERR {err}"))
        page.on("console", lambda msg: logs.append(f"CON {msg.type} {msg.text}") if msg.type == "error" else None)

        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(400)
        h1 = page.locator("#hub h1").inner_text()
        logs.append("hub " + h1.replace("\n", " "))
        shot(page, "hub.png")

        page.goto(BASE + "#ask", wait_until="networkidle")
        page.fill("#rc-now", "우산을 갈까 말까")
        page.fill("#rc-group", "1모둠")
        page.fill("#rc-names", "검사")
        page.fill("#rc-mine", "아무 생각이 없는 것도 생각인가")
        page.fill("#rc-why", "프롤로그가 그 말을 한다")
        page.fill("#rc-picked", "아무 생각이 없는 것도 생각인가")
        page.select_option("#rc-station", "calculate")
        page.click("#rc-make")
        cid = page.locator("#rc-id").inner_text()
        logs.append("card " + cid)
        shot(page, "ask.png")

        page.goto(BASE + "#inquire/calculate", wait_until="networkidle")
        page.wait_for_timeout(300)
        page.locator(".choice").first.click()
        page.wait_for_timeout(200)
        logs.append("calc meter " + page.locator("#meter").inner_text())
        shot(page, "calculate.png")

        page.goto(BASE + "#inquire/focus", wait_until="networkidle")
        page.wait_for_timeout(300)
        logs.append("focus h2 " + page.locator(".stage h2").inner_text())
        shot(page, "focus.png")

        page.goto(BASE + "#inquire/pose", wait_until="networkidle")
        page.wait_for_timeout(200)
        page.locator("[data-id=still]").click()
        page.wait_for_timeout(1200)
        logs.append("pose meter " + page.locator("#meter").inner_text())
        shot(page, "pose.png")

        page.goto(BASE + "#inquire/types", wait_until="networkidle")
        for _ in range(4):
            page.locator(".choice").nth(1).click()
            page.wait_for_timeout(80)
        logs.append("types h2 " + page.locator(".stage h2").inner_text())
        shot(page, "types.png")

        page.goto(BASE + "#chat", wait_until="networkidle")
        page.wait_for_timeout(300)
        logs.append("chat open " + page.locator(".bubble.ai").first.inner_text())
        page.fill("#chat-input", "아무 생각도 안 하고 있어")
        page.click(".chat-form button[type=submit]")
        page.wait_for_timeout(500)
        logs.append("chat reply " + page.locator(".bubble.ai").nth(1).inner_text())
        shot(page, "chat.png")

        page.goto(BASE + "#write", wait_until="networkidle")
        logs.append("write " + page.locator("#sheet-root .a4 h1").first.inner_text())
        logs.append("epi " + page.locator("#sheet-root .epi").first.inner_text())
        shot(page, "write.png")

        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(300)
        shot(page, "hub-mobile.png")
        page.goto(BASE + "#inquire/calculate", wait_until="networkidle")
        shot(page, "calculate-mobile.png")

        browser.close()
    print("\n".join(logs))

if __name__ == "__main__":
    main()
