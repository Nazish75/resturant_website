import streamlit as st
from pathlib import Path

st.set_page_config(
page_title="Tandoori | Authentic Pakistani Cuisine",
page_icon="🍽️",
layout="wide"
)

Project folder

BASE_DIR = Path(file).parent

Read existing HTML file

html_file = BASE_DIR / "index.html"

if not html_file.exists():
st.error("index.html file was not found.")
st.stop()

html_content = html_file.read_text(encoding="utf-8")

Display the existing restaurant website

st.components.v1.html(
html_content,
height=2500,
scrolling=True
)