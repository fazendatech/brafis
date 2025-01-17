#!/bin/bash

BASE_URL="https://svn.code.sf.net/p/acbr/code/trunk2/Exemplos/ACBrDFe/Schemas/NFe/"
TEMP_FILE="acbr-schemas-nfe.html"
DEST_DIR="src/dfe/nfe/schemas"

mkdir -p "$DEST_DIR"
wget -q -O "$TEMP_FILE" "$BASE_URL"
# Extrai os links dos arquivos .xsd e faz o download de cada um
grep -oP '(?<=<a href=")[^"]+\.xsd' "$TEMP_FILE" | while read -r FILE; do
    wget -q -P "$DEST_DIR" "${BASE_URL}${FILE}"
done
rm -f "$TEMP_FILE"

echo "Download concluído. Arquivos salvos no diretório '$DEST_DIR'."
