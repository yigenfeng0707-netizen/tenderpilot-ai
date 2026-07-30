"""Render a cinematic evidence-matrix table still for TenderPilot demo video."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
OUT = Path(__file__).resolve().parents[1] / "assets" / "evidence-matrix-chart.png"

ROWS = [
    ("ID", "类型", "要求摘要", "证据", "负责人", "优先级"),
    ("R-01", "截止节点", "8 月 8 日 18:00 前提交", "日程台账待建立", "项目经理", "高"),
    ("R-02", "资质与案例", "近两年不少于 3 个同类案例", "尚未提供证据", "运营负责人", "高"),
    ("R-03", "方案交付", "目标人群 / 渠道 / 风险预案", "方案目录待映射", "项目协作人", "中"),
    ("R-04", "预算与报价", "预算上限 30 万 · 报价盖章", "尚未提供证据", "商务协作人", "高"),
    ("R-05", "评分项", "场景 30 · 可行性 30 · 创意 20", "评分表待对齐", "项目协作人", "中"),
]


def font(size: int, bold: bool = False):
    for p in (
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
    ):
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (W, H), (245, 242, 233))
    draw = ImageDraw.Draw(img)

    # atmosphere
    draw.rectangle([0, 0, W, 140], fill=(23, 32, 24))
    draw.text((80, 42), "TenderPilot AI", fill=(185, 232, 201), font=font(28, True))
    draw.text((80, 82), "证据矩阵 · Evidence Matrix", fill=(245, 242, 233), font=font(42, True))

    # table geometry
    left, top = 80, 200
    col_w = [110, 160, 520, 320, 220, 140]
    row_h = 100
    x = left
    xs = []
    for w in col_w:
        xs.append(x)
        x += w
    table_w = sum(col_w)
    table_h = row_h * len(ROWS)

    draw.rounded_rectangle(
        [left - 8, top - 8, left + table_w + 8, top + table_h + 8],
        radius=16,
        fill=(252, 251, 247),
        outline=(216, 211, 197),
        width=2,
    )

    for r, row in enumerate(ROWS):
        y = top + r * row_h
        if r == 0:
            draw.rectangle([left, y, left + table_w, y + row_h], fill=(35, 91, 67))
            color = (252, 251, 247)
            f = font(26, True)
        else:
            if r % 2 == 0:
                draw.rectangle([left, y, left + table_w, y + row_h], fill=(249, 247, 240))
            color = (23, 32, 24)
            f = font(24, False)
            if row[-1] == "高":
                # priority chip
                px = xs[-1] + 18
                py = y + 32
                draw.rounded_rectangle([px, py, px + 100, py + 36], radius=8, fill=(231, 111, 60))
        for c, cell in enumerate(row):
            tx, ty = xs[c] + 16, y + 34
            if r > 0 and c == len(row) - 1 and cell == "高":
                draw.text((xs[c] + 42, y + 36), cell, fill=(255, 255, 255), font=font(22, True))
            elif r > 0 and c == len(row) - 1 and cell == "中":
                draw.rounded_rectangle(
                    [xs[c] + 18, y + 32, xs[c] + 100, y + 68],
                    radius=8,
                    fill=(185, 232, 201),
                )
                draw.text((xs[c] + 42, y + 36), cell, fill=(35, 91, 67), font=font(22, True))
            else:
                draw.text((tx, ty), cell, fill=color, font=f)
        draw.line([left, y + row_h, left + table_w, y + row_h], fill=(216, 211, 197), width=1)

    for x in xs[1:]:
        draw.line([x, top, x, top + table_h], fill=(216, 211, 197), width=1)

    footer = "每条要求保留原文引用 · 先暴露缺口 · 再讨论结论 · 草稿禁止无证据承诺"
    fw = draw.textbbox((0, 0), footer, font=font(22))
    draw.text(((W - fw[2] + fw[0]) // 2, H - 70), footer, fill=(105, 112, 102), font=font(22))

    img.save(OUT, quality=95)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
