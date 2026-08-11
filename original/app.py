import re

import gradio as gr


MAX_CHARS = 2_000
UTM_URL = (
    "https://lynote.ai/ai-humanizer?utm_source=huggingface"
    "&utm_medium=space&utm_campaign=hf_launch&utm_content=humanizer_lite"
)

EN_REPLACEMENTS = {
    "in today's rapidly evolving world": "today",
    "it is important to note that": "",
    "it is worth noting that": "",
    "serves as a testament to": "shows",
    "delve into": "examine",
    "leverage": "use",
    "seamless": "smooth",
    "robust": "reliable",
    "game-changer": "useful change",
    "in conclusion": "",
    "moreover": "also",
    "furthermore": "also",
}

ZH_REPLACEMENTS = {
    "值得注意的是，": "",
    "值得注意的是": "",
    "综上所述，": "",
    "综上所述": "",
    "在当今快速发展的时代": "现在",
    "赋能": "帮助",
    "助力": "帮助",
    "降本增效": "降低成本、提高效率",
    "闭环": "完整流程",
    "无缝": "顺畅",
}

PROTECTED_PATTERN = re.compile(
    r"(`[^`]+`|https?://\S+|(?:[A-Za-z]:)?(?:[/\\][\w.\-]+)+|"
    r"\b\d+(?:\.\d+)?(?:%|[A-Za-z]+)?\b|\"[^\"]*\"|'[^']*')"
)


def _protect(text: str):
    protected = []

    def replace(match):
        token = f"⟦PROTECTED_{len(protected)}⟧"
        protected.append(match.group(0))
        return token

    return PROTECTED_PATTERN.sub(replace, text), protected


def _restore(text: str, protected):
    for index, value in enumerate(protected):
        text = text.replace(f"⟦PROTECTED_{index}⟧", value)
    return text


def _replace_case_insensitive(text: str, old: str, new: str):
    return re.sub(re.escape(old), new, text, flags=re.IGNORECASE)


def humanize(text: str, voice: str):
    original = (text or "").strip()
    if not original:
        return "Please enter some text.", "No text was processed."
    if len(original) > MAX_CHARS:
        return original, f"Input is limited to {MAX_CHARS:,} characters in this demo."

    working, protected = _protect(original)
    changes = []

    for old, new in EN_REPLACEMENTS.items():
        updated = _replace_case_insensitive(working, old, new)
        if updated != working:
            changes.append(f"Replaced formulaic phrase: {old}")
            working = updated

    for old, new in ZH_REPLACEMENTS.items():
        if old in working:
            working = working.replace(old, new)
            changes.append(f"替换模板化表达：{old}")

    working = re.sub(r"[ \t]{2,}", " ", working)
    working = re.sub(r"\s+([,.;:!?，。；：！？])", r"\1", working)
    working = re.sub(r"([.!?。！？])\s*\1+", r"\1", working)
    working = re.sub(r"\n{3,}", "\n\n", working).strip(" ,，")

    if voice == "Concise":
        working = re.sub(r"\b(very|really|highly|extremely)\s+", "", working, flags=re.I)
        working = working.replace("非常", "").replace("极其", "")
    elif voice == "Professional":
        working = re.sub(r"\b(a lot of)\b", "many", working, flags=re.I)
        working = working.replace("挺多", "较多").replace("搞定", "完成")

    result = _restore(working, protected)
    if not changes and result == original:
        note = "No high-confidence template phrases were changed."
    else:
        note = f"Applied {len(changes)} conservative style edit(s). Protected numbers, URLs, paths, code, and quotes."

    return result, note


DESCRIPTION = f"""
This free, local demo removes a small set of high-confidence AI-writing clichés while
protecting numbers, URLs, paths, code, and quoted text. It is based on ideas from
[`humanize-text`](https://github.com/lynote-ai/humanize-text) and
[`humanize-text-skill`](https://github.com/lynote-ai/humanize-text-skill).

It is a writing-quality aid—not a guarantee that text will be classified as human.
[Try Lynote's full multi-stage humanizer]({UTM_URL}).
"""

with gr.Blocks(title="Lynote Humanizer Lite") as demo:
    gr.Markdown("# ✍️ Lynote Humanizer Lite")
    gr.Markdown(DESCRIPTION)
    with gr.Row():
        source = gr.Textbox(label="Draft", lines=14, max_lines=20, placeholder="Paste up to 2,000 characters…")
        output = gr.Textbox(label="Edited draft", lines=14, max_lines=20)
    voice = gr.Radio(["Natural", "Concise", "Professional"], value="Natural", label="Editing style")
    run = gr.Button("Humanize conservatively", variant="primary")
    notes = gr.Markdown()
    run.click(humanize, inputs=[source, voice], outputs=[output, notes])
    gr.Examples(
        examples=[
            ["It is worth noting that this robust tool serves as a testament to our commitment to innovation.", "Natural"],
            ["值得注意的是，我们通过这套方案赋能团队，形成降本增效闭环。", "Concise"],
        ],
        inputs=[source, voice],
    )


if __name__ == "__main__":
    demo.launch()
