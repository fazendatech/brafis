# brafis

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.1.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### TODO

- [ ] Handle A1 certificates
  - [ ] Convert .pfx to .pem
  - [ ] Sign XML
- [ ] Basic [SEFAZ integration](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=LrBx7WT9PuA=)
  - NfeStatusServico
  - NfeAutorizacao (sync only)
- [ ] [XML generation](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=J%20I%20v4eN00E=)
- [ ] Data validation
  - [ ] Input data when using Brafis API ([zod](https://zod.dev/))
  - [ ] [XML schemas](https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=BMPFMBoln3w=)
- [ ] [DANFE generation](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=f%20NhsSn3/5M=)
- [ ] CI/CD pipeline (linting, testing, deploying)


## Tech Stack

### Ferramentas

- TypeScript
- [Biomejs.dev](https://biomejs.dev/pt-br/) - Linter + Formatter
- [Bun.sh](http://bun.sh/) - Runtime
- [Reviewable](https://reviewable.io/) - Code review
- (Opcional) [Toggl Track](https://toggl.com/) - Controle de horas (apenas uso pessoal)

### Libraries

- [node-forge](https://github.com/digitalbazaar/forge) - Certificados
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) - Parsing/building XMLs

### Recursos

- [node-mde](https://github.com/lucashpmelo/node-mde) - Referência de implementação
- [nfe.fazenda.gov.br](https://www.nfe.fazenda.gov.br/portal/listaSubMenu.aspx?Id=04BIflQt1aY=) - Documentação e Schemas XML
