#!/usr/bin/env python3
"""Processa imagens em lote para WebP, preservando a estrutura de pastas.

Requisitos:
- Python 3.9+
- Pillow

Instalação:
    pip install pillow
"""

from __future__ import annotations

import os
import sys
import shutil
from pathlib import Path
from typing import List

try:
    from PIL import Image
except ImportError as exc:
    print("Erro: a biblioteca Pillow não está instalada.")
    print("Instale com: pip install pillow")
    sys.exit(1)


def ask_directory(prompt: str) -> Path:
    while True:
        value = input(prompt).strip().strip('"').strip("'")
        if value:
            path = Path(value).expanduser().resolve()
            if path.exists() and path.is_dir():
                return path
            print(f"Diretório não encontrado ou inválido: {path}")
        else:
            print("Valor vazio. Tente novamente.")


def list_image_files(root: Path) -> List[Path]:
    exts = {'.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff', '.webp'}
    files = []
    for path in sorted(root.rglob('*')):
        if path.is_file() and path.suffix.lower() in exts:
            files.append(path)
    return files


def process_directory(work_dir: Path, out_dir: Path, rel_dir: Path) -> None:
    source_dir = work_dir / rel_dir
    target_dir = out_dir / rel_dir
    target_dir.mkdir(parents=True, exist_ok=True)

    images = list_image_files(source_dir)
    if not images:
        return

    for image_path in images:
        try:
            with Image.open(image_path) as img:
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGBA')
                else:
                    img = img.convert('RGB')

                if img.width > 800:
                    ratio = 800 / img.width
                    new_size = (800, max(1, int(img.height * ratio)))
                    img = img.resize(new_size, Image.Resampling.LANCZOS)
                else:
                    new_size = (img.width, img.height)

                target_path = target_dir / f"{image_path.stem}.webp"
                img.save(target_path, format='WEBP', quality=100, optimize=False)
        except Exception as exc:
            print(f"Falha ao processar {image_path}: {exc}")


def build_output_structure(work_dir: Path, out_dir: Path) -> None:
    if out_dir.exists():
        print(f"Atenção: o diretório de saída já existe: {out_dir}")
        print("Os arquivos serão sobrescritos se houver nomes iguais.")
    else:
        out_dir.mkdir(parents=True, exist_ok=True)

    for path in sorted(work_dir.iterdir()):
        if path.is_dir():
            process_directory(work_dir, out_dir, path.relative_to(work_dir))

    # Processa subdiretórios recursivamente
    for current_dir in sorted(work_dir.rglob('*')):
        if current_dir.is_dir() and current_dir != work_dir:
            rel_dir = current_dir.relative_to(work_dir)
            process_directory(work_dir, out_dir, rel_dir)


def main() -> None:
    print("Script de processamento de imagens para WebP")
    print("Bibliotecas necessárias: Pillow")
    print("Instalação: pip install pillow")
    print()

    work_dir = ask_directory("Digite o diretório de trabalho (onde estão as imagens): ")
    out_dir = ask_directory("Digite o diretório de saída (onde as imagens processadas serão salvas): ")

    if work_dir.resolve() == out_dir.resolve():
        print("O diretório de trabalho e o diretório de saída não podem ser iguais.")
        sys.exit(1)

    print("Processando...")
    build_output_structure(work_dir, out_dir)
    print("Concluído.")
    print(f"Imagens salvas em: {out_dir}")


if __name__ == "__main__":
    main()
