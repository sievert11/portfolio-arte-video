# Script de processamento de imagens

## Requisitos

- Python 3.9+
- Pillow

Instale:

```bash
pip install pillow
```

## Uso

```bash
python scripts/process_images.py
```

O script vai pedir:
- o diretório de trabalho (onde estão as imagens originais)
- o diretório de saída (onde as imagens processadas serão salvas)

Ele cria subpastas no diretório de saída preservando a estrutura do diretório de trabalho e converte todas as imagens encontradas para `.webp` com largura máxima de 800px, qualidade 100% e sem metadados.
