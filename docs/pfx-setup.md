# Gerando um Certificado Autoassinado `.pfx`

Este guia ensina como criar um certificado autoassinado no formato `.pfx` (ou `.p12`) para testar e implementar segurança SSL/TLS ou autenticação em servidores ou dispositivos móveis.

## O que é um Certificado Autoassinado `.pfx`?

-   Um **certificado autoassinado** é um certificado digital que você mesmo emite sem uma Autoridade de Certificação (CA) externa.
-   O formato `.pfx` (ou `.p12`) combina o **certificado público** e a **chave privada** em um único arquivo protegido por senha. Ele é amplamente utilizado em ambientes Windows e em dispositivos que requerem ambos os componentes em um único arquivo.

### Por que criar um Certificado Autoassinado `.pfx`?

-   **Testes de SSL/TLS**: Você pode testar sites ou aplicativos locais com SSL/TLS sem precisar de um certificado válido de uma CA.
-   **Ambientes de Desenvolvimento**: Ótimo para configurar segurança em ambientes de desenvolvimento sem custo.
-   **Aplicações internas**: Para sistemas internos que não precisam de validação pública (por exemplo, uma intranet ou serviços privados).
-   **Autenticação em dispositivos móveis e Windows**: Alguns dispositivos e aplicativos requerem certificados no formato `.pfx` com a chave privada para autenticação.

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

> [!NOTE]
> Após a instalação, certifique-se de adicionar o diretório bin do OpenSSL ao PATH do sistema para poder usar o comando `openssl` no prompt de comando.

## Criando um Certificado Autoassinado `.pfx`

### 1. Gere uma Chave Privada

Execute o comando abaixo para gerar uma chave privada de **4096** bits.

```bash
openssl genrsa -out cert.key.pem 4096
chmod 400 cert.key.pem
```

### 2. Crie um arquivo de configuração do certificado

Crie um arquivo `openssl.cnf` com base no modelo a seguir:

```bash
[ req ]
default_bits        = 4096
distinguished_name  = req_distinguished_name
x509_extensions     = v3_req
prompt              = no

[ req_distinguished_name ]
CN = www.exemplo.com.br
OU = Departamento de TI
O  = Minha Empresa LTDA
C  = BR

[ v3_req ]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
```

### 2. Crie o Certificado Autoassinado

Crie o certificado autoassinado usando a chave privada gerada e o arquivo `openssl.cnf`. Esse certificado terá validade de 365 dias.

```bash
openssl req -new -x509 -days 365 -key cert.key.pem -out cert.pem -config openssl.cnf
```

### 3. Criar o Arquivo `.pfx`

Agora, combine o certificado e a chave privada em um arquivo `.pfx`, protegendo-o com uma senha.

```bash
openssl pkcs12 -export -out cert.pfx -inkey cert.key.pem -in cert.pem
```

Você será solicitado a definir uma senha para o arquivo `.pfx`. Esta senha será necessária sempre que você utilizar o certificado.

### 4. Verificar os certificados

Verifique a criação dos certificados com os comandos:

```bash
openssl x509 -text -noout -in cert.pem
openssl x509 -info -in cert.pfx
```

Ambos comandos devem exibir informações detalhadas sobre os certificados gerados.

## Script Completo

Para facilitar o processo, você pode usar o seguinte script Bash para realizar todas as etapas automaticamente:

```bash
#!/bin/bash

KEY_NAME="cert.key.pem"
CERT_NAME="cert.pem"
PFX_NAME="cert.pfx"
CONFIG_FILE="openssl.cnf"
VALIDITY_DAYS=365

echo "Gerando uma chave privada de 4096 bits"
openssl genrsa -out $KEY_NAME 4096
chmod 400 $KEY_NAME

echo "Criando um certificado autoassinado com validade de 365 dias"
openssl req -new -x509 -days $VALIDITY_DAYS -key $KEY_NAME -out $CERT_NAME -config $CONFIG_FILE

echo "Criando o arquivo .pfx combinando a chave privada e o certificado"
openssl pkcs12 -export -out $PFX_NAME -inkey $KEY_NAME -in $CERT_NAME

echo "Verificando o certificado .crt:"
openssl x509 -text -noout -in $CERT_NAME

echo "Verificando o arquivo .pfx:"
openssl pkcs12 -info -in $PFX_NAME

echo "Processo concluído! Certificado .pfx criado e verificado."
```

Salve o script acima em um arquivo, por exemplo criar-certificado.sh e dê a permissão de execução ao script:

```bash
chmod +x criar-certificado.sh
```

Por fim, poderá executar o script:

```bash
./criar-certificado.sh
```

Durante a execução, você será solicitado a preencher uma senha para o arquivo .pfx.