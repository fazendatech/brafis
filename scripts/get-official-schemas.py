import os
import requests
import xml.etree.ElementTree as ET
import zipfile
import io

# NOTE: URL do portal da Receita Federal com os arquivos de esquemas da NF-e
URL = "https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=BMPFMBoln3w="
DEST_DIR = "src/dfe/nfe/schemas"
TEMP_DIR = f"{DEST_DIR}/tmp"
os.makedirs(TEMP_DIR, exist_ok=True)

def downloadAndExtractFiles(url):
    try:
        response = requests.get(url)
        response.raise_for_status()

        # Extrair o conteúdo do arquivo ZIP
        with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
            zip_ref.extractall(TEMP_DIR)

    except requests.exceptions.RequestException as e:
        print(f"Erro ao baixar {url}: {e}")

def getDownloadLinks():
    try:
        response = requests.get(URL)
        response.raise_for_status()

        htmlTarget = response.text\
            .split('<p class="tituloSessao">VERSÕES OFICIAIS (em uso)</p>')[1]\
            .split('<p class="tituloSessao">VERSÕES PARA TESTES (Homologação)</p>')[0]
        # NOTE: Extrair os links de download dos arquivos zip
        return [f"https://www.nfe.fazenda.gov.br/portal/{tag_a.attrib["href"].strip()}"
                for tag_a in ET.fromstring(htmlTarget).findall(".//a")]

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a página: {e}")
        return []

if __name__ == "__main__":
    download_links = getDownloadLinks()
    if not download_links:
        exit("Nenhum link encontrado.")
    for link in download_links:
        downloadAndExtractFiles(link)
