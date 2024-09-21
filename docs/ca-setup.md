# Criando uma Autoridade de Certificação (CA) para Testes

Este guia ensina como criar uma Autoridade de Certificação (CA) local para testes, usando OpenSSL. Uma CA local permite que você emita seus próprios certificados digitais para fins de desenvolvimento e testes em um ambiente controlado.

## Dependências

Para executar os comandos abaixo, você precisará ter o **OpenSSL** instalado em seu sistema. Aqui estão as instruções de instalação:

### No Linux (Debian/Ubuntu):

```bash
sudo apt update
sudo apt install openssl
```

### No macOS (usando Homebrew):

```bash
brew install openssl
```

### No Windows:

-   Baixe e instale o OpenSSL para Windows a partir deste [link](https://slproweb.com/products/Win32OpenSSL.html).

## Passo a Passo para Criar uma CA para Testes

### 1. Configurar o Ambiente da CA

Primeiro, crie um diretório para armazenar os arquivos da CA.

```bash
mkdir -p my-ca/{certs,crl,newcerts,private}
chmod 700 my-ca/private
touch my-ca/index.txt
echo 1000 > my-ca/serial
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
openssl genrsa -out my-ca/private/ca.key.pem 4096
chmod 400 my-ca/private/ca.key.pem
```

### 3. Criar o Certificado da CA

Com a chave privada da CA criada, o próximo passo é gerar o certificado autoassinado da CA.

```bash
openssl req -new -x509 -days 3650 -key my-ca/private/ca.key.pem -sha256 -out my-ca/certs/ca.cert.pem
```

Durante esse processo, você será solicitado a fornecer informações para o certificado, como nome do país, organização, e o "Common Name" da CA (que identifica sua CA).

### 4. Configurar o Arquivo `openssl.cnf`

Crie um arquivo de configuração `openssl.cnf` que sua CA usará para emitir certificados.
```bash
touch my-ca/openssl.cnf
```

Use o seguinte modelo básico:

```bash
[ ca ]
default_ca = CA_default

[ CA_default ]
dir = /home/my-user/my-ca
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
stateOrProvinceName = match
organizationName = supplied
organizationalUnitName = optional
commonName = supplied
emailAddress = optional

[ req ]
default_bits = 2048
default_keyfile = privkey.pem
distinguished_name = req_distinguished_name
string_mask = utf8only
default_md = sha256

[ req_distinguished_name ]
countryName = Country Name (2 letter code)
stateOrProvinceName = State or Province Name
localityName = Locality Name
organizationName = Organization Name
commonName = Common Name

[ v3_req ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
```

### 5. Emitir Certificados Usando sua CA

Agora que sua CA está configurada, você pode emitir certificados para servidores ou clientes. Primeiro acesse o diretório criado.

```bash
cd my-ca
```

#### 5.1 Gerar uma Chave Privada para o Cliente ou Servidor

```bash
openssl genrsa -out client.key.pem 2048
```

#### 5.2 Criar um Pedido de Assinatura de Certificado (CSR)

Agora, crie um CSR (Certificate Signing Request) para o cliente ou servidor:

```bash
openssl req -new -key client.key.pem -out client.csr.pem
```

#### 5.3 Assinar o Certificado com a CA

Por fim, use sua CA para assinar o CSR, emitindo o certificado final:

```bash
openssl ca -config openssl.cnf -in client.csr.pem -out client.cert.pem
```

Isso gerará um certificado assinado pelo certificado da sua CA.

### 6. Verificar o Certificado

Para garantir que o certificado foi emitido corretamente, você pode verificá-lo com:

```bash
openssl x509 -noout -text -in client.cert.pem
```

### 7. Criar o Arquivo `.pfx`

Agora, combine o certificado e a chave privada em um arquivo `.pfx`, protegendo-o com uma senha para ser utilizado em sistemas windows.

```bash
openssl pkcs12 -export -out certs/ca.cert.pfx -inkey client.key.pem -in certs/ca.cert.pem
```
### 8. Verificar o Certificado

Para garantir que o certificado `.pfx` foi emitido corretamente:

```bash
openssl x509 -noout -text -in client.cert.pfx
```

---

## Conclusão

Você agora tem uma **CA local** configurada para emitir certificados digitais para testes. Essa CA não é reconhecida publicamente, mas pode ser usada para fins de desenvolvimento e simulação em ambientes controlados. Para usar os certificados emitidos pela CA em sistemas de teste, você pode adicionar o certificado da CA como uma **autoridade confiável** nos dispositivos onde serão usados.
