# Criando uma Autoridade de Certificação (CA) para Testes

Este guia ensina como criar uma Autoridade de Certificação (CA) local para testes, usando OpenSSL. Uma CA local permite que você emita seus próprios certificados digitais para fins de desenvolvimento e testes em um ambiente controlado.

## Dependências

Para executar os comandos abaixo, você precisará ter o **OpenSSL** instalado em seu sistema. Aqui estão as instruções de instalação:

### No Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install openssl
```

### No macOS (usando Homebrew)

```bash
brew install openssl
```

### No Windows

- Baixe e instale o OpenSSL para Windows a partir deste [link](https://slproweb.com/products/Win32OpenSSL.html).

## Passo a Passo para Criar uma CA para Testes

### 1. Configurar o Ambiente da CA

Primeiro, crie um diretório para armazenar os arquivos da CA.

```bash
mkdir -p my-ca/{certs,crl,newcerts,private}
cd my-ca/
chmod 700 private/
echo 1000 > serial
touch index.txt
```

Isso cria as seguintes estruturas:

- `certs/`: Diretório para armazenar certificados emitidos.
- `crl/`: Diretório para armazenar listas de revogação de certificados.
- `newcerts/`: Diretório para novos certificados.
- `private/`: Diretório para armazenar a chave privada da CA (protegido com permissões restritas).
- `index.txt`: Arquivo para manter o registro de todos os certificados emitidos.
- `serial`: Arquivo que armazena o número de série dos certificados emitidos.

### 2. Gerar uma Chave Privada para CA

Agora, gere uma chave privada de **4096** bits para a sua CA:

```bash
openssl genrsa -out private/ca.key.pem 4096
chmod 400 private/ca.key.pem
```

### 3. Criar o Certificado da CA

Com a chave privada da CA criada, o próximo passo é gerar o certificado autoassinado da CA.

Crie um arquivo no diretório da CA com nome `ca.cnf` e preencha com o seguinte modelo:

```ini
[ req ]
default_bits       = 4096
default_keyfile    = private/ca.key.pem
distinguished_name = req_distinguished_name
x509_extensions    = v3_ca
string_mask        = utf8only
default_md         = sha256

[ req_distinguished_name ]
countryName                      = Country Name (2 letter code)
countryName_default              = BR
stateOrProvinceName              = State or Province Name (full name)
stateOrProvinceName_default      = São Paulo
localityName                     = Locality Name (eg, city)
localityName_default             = São Paulo
organizationName                 = Organization Name (eg, company)
organizationName_default         = My Test CA
commonName                       = Common Name (e.g. server FQDN or YOUR name)
commonName_default               = My Test CA Root Certificate

[ v3_ca ]
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer
basicConstraints = critical,CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
```

Utilize o seguinte comando para criar o certificado da CA em `certs/ca.cert.pem`

```bash
openssl req -new -x509 -days 3650 -key private/ca.key.pem -sha256 -out certs/ca.cert.pem -config ca.cnf
```

Durante a utilização do comando, você será solicitado a inserir alguns campos de informações. Preencha-os conforme desejar, deixando em branco será usado os valores default do arquivo `ca.cnf`, esses serão as informações da CA que será criada.

Verifique se o arquivo foi criado corretamente:

```bash
openssl x509 -noout -text -in certs/ca.cert.pem
```

### 4. Configurar o Arquivo `openssl.cnf`

Crie um arquivo de configuração `openssl.cnf` que sua CA usará para emitir certificados e use o seguinte modelo básico:

```ini
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = <raíz do diretório da CA>/my-ca
certs = $dir/certs
crl_dir = $dir/crl
new_certs_dir = $dir/newcerts
database = $dir/index.txt
serial = $dir/serial
private_key = $dir/private/ca.key.pem
certificate = $dir/certs/ca.cert.pem
default_days = 375
default_md = sha256
policy = policy_strict

[ policy_strict ]
countryName = match
stateOrProvinceName = optional
organizationName = supplied
organizationalUnitName = supplied
commonName = supplied
emailAddress = optional

[ req ]
default_bits = 4096
default_keyfile = privkey.pem
distinguished_name = req_distinguished_name
string_mask = utf8only
default_md = sha256

[ req_distinguished_name ]
countryName = BR
organizationUnitName = <nome da unidade da organização da CA>
organizationName = <nome da organização da CA>
commonName = <nome da CA>

[ v3_req ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
```

Configure o arquivo `openssl.cnf` com o caminho correto para o diretório da CA e os campos de informações da CA que foram declarados nos passos anteriores. Altere a política de acordo com as regras de emissão de certificados da sua CA.

### 5. Emitir Certificados Usando sua CA

Agora que sua CA está configurada, você pode emitir certificados para servidores ou clientes.

#### 5.1 Gerar uma Chave Privada para o Cliente ou Servidor

```bash
openssl genrsa -out client.key.pem 4096
```

#### 5.2 Criar um Pedido de Assinatura de Certificado (CSR)

Agora, crie um CSR (Certificate Signing Request) para o cliente ou servidor:

```bash
openssl req -new -key client.key.pem -out client.csr.pem
```

Também será nescessário informar alguns campos, de acordo com a política da CA escrita no exemplo do `openssl.cnf`, apenas o campo `Country Name` deve ser obrigatoriarmente igual ao da CA. Os campos `organizationName`,`organizationalUnitName` e `commonName` devem obrigatoriarmente serem preenchidos porém são independentes dos campos da CA. Os demais são opcionais.

#### 5.3 Assinar o Certificado com a CA

Por fim, use sua CA para assinar o CSR, emitindo o certificado final:

```bash
openssl ca -config openssl.cnf -in client.csr.pem -out certs/client.cert.pem
```

Isso gerará um certificado assinado pelo certificado da sua CA. Para garantir que o certificado foi emitido corretamente, você pode verificá-lo com:

```bash
openssl x509 -noout -text -in certs/client.cert.pem
```

### 6. Criar o Arquivo `.pfx`

Agora, combine o certificado e a chave privada em um arquivo `.pfx`, protegendo-o com uma senha para ser utilizado em sistemas Windows.

```bash
openssl pkcs12 -export -out certs/client.cert.pfx -inkey client.key.pem -in certs/client.cert.pem
```

Para garantir que o certificado `.pfx` foi emitido corretamente:

```bash
openssl pkcs12 -info -in certs/client.cert.pfx
```

## Automatizando a emissão de Certificado e Criação do Arquivo .pfx

Após ter criado sua CA, a geração de certificados pode ser automatizada com este script que gera a chave privada, cria o CSR, emite o certificado e cria o arquivo `.pfx`.

Crie um arquivo `emitir_certificado.sh` e cole o conteúdo abaixo.

```bash
#!/bin/bash

set -e

# Funções de utilidade
check_file_exists() {
    if [ -f "$1" ]; then
        echo "Erro: O arquivo $1 já existe. Remova-o ou use um nome diferente."
        exit 1
    fi
}

# Nomes de arquivo padrão
KEY_FILE="client.key.pem"
CSR_FILE="client.csr.pem"
CERT_FILE="certs/client.cert.pem"
PFX_FILE="certs/client.cert.pfx"

# Verificar arquivos existentes
check_file_exists "$KEY_FILE"
check_file_exists "$CSR_FILE"
check_file_exists "$CERT_FILE"
check_file_exists "$PFX_FILE"

echo "Gerando chave privada para o cliente/servidor..."
openssl genrsa -out $KEY_FILE 4096
echo "Chave privada para o cliente/servidor gerada com sucesso!"

echo "Criando CSR para o cliente/servidor..."
openssl req -new -key $KEY_FILE -out $CSR_FILE
echo "CSR para o cliente/servidor gerado com sucesso!"

echo "Assinando CSR com a CA..."
openssl ca -config openssl.cnf -in $CSR_FILE -out $CERT_FILE
echo "Certificado do cliente/servidor assinado com sucesso!"

echo "Criando arquivo .pfx..."
openssl pkcs12 -export -out $PFX_FILE -inkey $KEY_FILE -in $CERT_FILE
echo "Arquivo .pfx criado com sucesso!"

echo "Verificando o arquivo .pfx..."
openssl pkcs12 -info -in $PFX_FILE
echo "Verificação do arquivo .pfx concluída!"
```

Dê permissão de execução ao script:

```bash
chmod +x emitir_certificado.sh
```

Execute o script:

```bash
./emitir_certificado.sh
```
