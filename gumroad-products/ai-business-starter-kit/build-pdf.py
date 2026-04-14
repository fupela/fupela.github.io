#!/usr/bin/env python3
"""Build the AI Business Starter Kit PDF bundle."""

from fpdf import FPDF
import os

DIR = os.path.dirname(os.path.abspath(__file__))

class KitPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 10, "The AI Business Starter Kit", align="R")
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def chapter_title(self, title):
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(40, 40, 40)
        self.ln(5)
        self.cell(0, 12, title)
        self.ln(10)
        self.set_draw_color(100, 80, 200)
        self.set_line_width(0.8)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(8)

    def section_title(self, title):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(60, 60, 60)
        self.ln(4)
        self.cell(0, 10, title)
        self.ln(8)

    def subsection_title(self, title):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(80, 80, 80)
        self.ln(2)
        self.cell(0, 8, title)
        self.ln(6)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 5.5, text)
        self.ln(3)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(50, 50, 50)
        x = self.get_x()
        self.cell(8, 5.5, "-")
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def code_block(self, text):
        self.set_font("Courier", "", 9)
        self.set_fill_color(245, 245, 245)
        self.set_text_color(60, 60, 60)
        self.ln(2)
        for line in text.strip().split("\n"):
            self.cell(0, 5, "  " + line, fill=True)
            self.ln(5)
        self.ln(4)

    def table_row(self, cells, bold=False):
        style = "B" if bold else ""
        self.set_font("Helvetica", style, 9)
        col_w = (self.w - 20) / len(cells)
        for cell in cells:
            self.cell(col_w, 7, cell, border=1)
        self.ln()


def clean(text):
    """Replace unicode chars that latin-1 can't encode."""
    replacements = {
        "\u2014": "-", "\u2013": "-", "\u2018": "'", "\u2019": "'",
        "\u201c": '"', "\u201d": '"', "\u2026": "...", "\u2022": "-",
        "\u2192": "->", "\u2264": "<=", "\u2265": ">=",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text


def parse_and_render(pdf, filepath):
    with open(filepath, "r") as f:
        lines = [clean(l) for l in f.readlines()]

    in_code = False
    code_buf = []
    in_table = False
    table_first = True

    for line in lines:
        stripped = line.rstrip()

        # Code blocks
        if stripped.startswith("```"):
            if in_code:
                pdf.code_block("\n".join(code_buf))
                code_buf = []
                in_code = False
            else:
                in_code = True
            continue
        if in_code:
            code_buf.append(stripped)
            continue

        # Tables
        if "|" in stripped and stripped.startswith("|"):
            cells = [c.strip() for c in stripped.split("|")[1:-1]]
            if all(set(c) <= set("- :") for c in cells):
                continue  # separator row
            if not in_table:
                in_table = True
                table_first = True
            pdf.table_row(cells, bold=table_first)
            table_first = False
            continue
        else:
            if in_table:
                in_table = False
                pdf.ln(4)

        # Skip horizontal rules
        if stripped == "---":
            pdf.ln(4)
            continue

        # Headers
        if stripped.startswith("# ") and not stripped.startswith("## "):
            # Main title - handled separately
            continue
        elif stripped.startswith("## "):
            pdf.chapter_title(stripped[3:].strip())
            continue
        elif stripped.startswith("### "):
            pdf.section_title(stripped[4:].strip())
            continue
        elif stripped.startswith("#### "):
            pdf.subsection_title(stripped[5:].strip())
            continue

        # Bullets
        if stripped.startswith("- "):
            text = stripped[2:]
            # Clean markdown bold
            text = text.replace("**", "")
            pdf.bullet(text)
            continue

        # Checkbox items
        if stripped.startswith("- [ ] "):
            text = stripped[6:]
            text = text.replace("**", "")
            pdf.bullet("[  ] " + text)
            continue

        # Empty lines
        if not stripped:
            pdf.ln(3)
            continue

        # Regular text - clean markdown
        text = stripped.replace("**", "").replace("*", "")
        if text:
            pdf.body_text(text)


def build():
    pdf = KitPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)

    # Cover page
    pdf.add_page()
    pdf.ln(60)
    pdf.set_font("Helvetica", "B", 32)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 15, "The AI Business", align="C")
    pdf.ln(18)
    pdf.cell(0, 15, "Starter Kit", align="C")
    pdf.ln(25)
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 10, "How to Build an Automated Agency", align="C")
    pdf.ln(8)
    pdf.cell(0, 10, "That Works While You Sleep", align="C")
    pdf.ln(30)
    pdf.set_draw_color(100, 80, 200)
    pdf.set_line_width(1)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.ln(15)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(130, 130, 130)
    pdf.cell(0, 8, "Built by someone doing this right now.", align="C")
    pdf.ln(5)
    pdf.cell(0, 8, "Not theory - practice.", align="C")

    # Main content
    pdf.add_page()
    parse_and_render(pdf, os.path.join(DIR, "AI-Business-Starter-Kit.md"))

    # Bonus: Cold Email Templates
    pdf.add_page()
    pdf.ln(20)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 12, "BONUS", align="C")
    pdf.ln(15)
    pdf.set_font("Helvetica", "", 16)
    pdf.cell(0, 10, "Cold Email Templates", align="C")
    pdf.ln(20)
    pdf.add_page()
    parse_and_render(pdf, os.path.join(DIR, "Bonus-Cold-Email-Templates.md"))

    # Bonus: Client Onboarding
    pdf.add_page()
    pdf.ln(20)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(0, 12, "BONUS", align="C")
    pdf.ln(15)
    pdf.set_font("Helvetica", "", 16)
    pdf.cell(0, 10, "Client Onboarding Checklist", align="C")
    pdf.ln(20)
    pdf.add_page()
    parse_and_render(pdf, os.path.join(DIR, "Bonus-Client-Onboarding-Checklist.md"))

    out = os.path.join(DIR, "AI-Business-Starter-Kit.pdf")
    pdf.output(out)
    print(f"PDF created: {out}")
    print(f"Pages: {pdf.page_no()}")
    sz = os.path.getsize(out)
    print(f"Size: {sz / 1024:.0f} KB")

if __name__ == "__main__":
    build()
