import streamlit as st
from pathlib import Path
import base64
import mimetypes
import re

st.set_page_config(
    page_title="Tandoori | Authentic Pakistani Cuisine",
    page_icon="🍽️",
    layout="wide"
)

# Project folder
BASE_DIR = Path(__file__).parent

# Read index.html
html_file = BASE_DIR / "index.html"

if not html_file.exists():
    st.error("index.html file not found.")
    st.stop()

html = html_file.read_text(encoding="utf-8")


# ---------------- CSS ----------------

css_file = BASE_DIR / "style.css"

if css_file.exists():
    css = css_file.read_text(encoding="utf-8")

    html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        f"<style>{css}</style>"
    )


# ---------------- JavaScript ----------------

js_file = BASE_DIR / "script.js"

if js_file.exists():
    js = js_file.read_text(encoding="utf-8")

    html = html.replace(
        '<script src="script.js"></script>',
        f"<script>{js}</script>"
    )


# ---------------- Media Files ----------------

media_folder = BASE_DIR / "media"


def convert_media(match):
    filename = match.group(1)
    file_path = media_folder / filename

    if not file_path.exists():
        return match.group(0)

    mime_type = mimetypes.guess_type(str(file_path))[0]

    if not mime_type:
        mime_type = "application/octet-stream"

    encoded = base64.b64encode(
        file_path.read_bytes()
    ).decode("utf-8")

    return f'src="data:{mime_type};base64,{encoded}"'


if media_folder.exists():

    html = re.sub(
        r'src="media/([^"]+)"',
        convert_media,
        html
    )


# ---------------- Display Website ----------------

st.components.v1.html(
    html,
    height=3000,
    scrolling=True
)