# Luizalabs - Serviço de favoritos

[![codecov](https://codecov.io/gh/flavio-brusamolin/luizalabs-test/graph/badge.svg?token=9ZS8PUNLM1)](https://codecov.io/gh/flavio-brusamolin/luizalabs-test)

## 🛠️ Instalação e testes

### ✅ Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- Docker Engine
- Docker Compose
- Node.js (Opcional)

---

### 🚀 Instalação

Copie o arquivo [`.env.example`](./.env.example) para `.env` e ajuste os valores conforme necessário. Caso o arquivo `.env` não seja configurado, valores default serão utilizados.

Execute o seguinte comando na raiz do projeto para iniciar todos os serviços:

```
docker-compose up -d
```

- A API estará disponível em: http://localhost:8080/api
- O Swagger estará disponível em: http://localhost:8080/api/docs

⚠️ Se você pretende executar os testes automatizados localmente com Node.js, execute `npm install` antes de iniciar o `docker-compose` para evitar problemas de permissão posteriormente.

---

### 🎮 Playground

Você pode utilizar os seguintes IDs de produto para testar:

```
6ce6b564-92d3-492a-91ba-ee4e6aee7d87
5db40d1b-6609-4d56-b20e-eb00e53b6299
be9d0e0d-0780-4918-ab28-df723dcb4e3c
03b3422c-e4a8-434a-bda2-23c974d021d5
0b1d0e55-245e-4772-9f77-9efc8526ffbd
```

Caso prefira utilizar o Postman em vez do Swagger, importe os arquivos abaixo:

- Coleção: [`postman/luizalabs.postman_collection.json`](./postman/luizalabs.postman_collection.json)
- Ambiente: [`postman/env-luizalabs.postman_environment.json`](./postman/env-luizalabs.postman_environment.json)

---

### 🧪 Testes

Execute os comandos abaixo para rodar os testes usando Docker:

- `docker-compose run --rm favorites-service npm test` - Executa todos os testes (unitários e de integração).
- `docker-compose run --rm favorites-service npm run test:unit` - Executa apenas os testes unitários.
- `docker-compose run --rm favorites-service npm run test:integration` - Executa apenas os testes de integração.
- `docker-compose run --rm favorites-service npm run test:coverage` - Executa todos os testes e gera relatório de cobertura.

Se você tem o Node.js instalado e já executou `npm install`, também pode rodar os testes com os comandos abaixo:

- `npm test` - Executa todos os testes (unitários e de integração).
- `npm run test:unit` - Executa apenas os testes unitários.
- `npm run test:integration` - Executa apenas os testes de integração.
- `npm run test:coverage` - Executa todos os testes e gera relatório de cobertura.

---

## 💡 Solução

### 🔒 Autenticação

Um dos requisitos do desafio é que o cliente se cadastre informando apenas seu nome e email. Uma vez que o cliente não define uma senha de acesso, fazer a sua autenticação por meio do email seria inseguro, já que qualquer outra pessoa poderia tentar acessar o serviço se soubesse o email de um cliente ou mesmo por força bruta na tentativa e erro.

#### 📌 Possíveis soluções

Considerando então esse cenário, existem algumas possibilidades para garantir a autenticação nesse serviço. A primeira delas e a mais comum num ambiente de microsserviços distribuídos seria essa autenticação estar no API Gateway, mas essa não é uma opção considerando o escopo do desafio. Uma outra possibilidade seria ter um serviço autenticador, que conheceria as credencias do cliente, e seria chamado pelo serviço de favoritos. Porém, essa também não é uma opção já que nenhum serviço de autenticação foi mencionado ou disponibilizado.

#### 🎯 Solução escolhida

Já que não é possível contar com uma credencial que o **cliente saiba** ou com um componente externo que conheça as credenciais dele, a opção escolhida usufrui de algo que o **cliente tem**: acesso ao próprio email. Quando um cliente se cadastra (**POST /signup**), é disparado um email para ele com uma **chave de acesso (UUID)** no corpo. Essa chave de acesso deve ser utilizada para autenticá-lo no sistema (**POST /signin**). O **token (JWT)** gerado a partir de então o dará acesso a todos os recursos do serviço pelo tempo de expiração definido, até que ele tenha que se autenticar novamente usando a mesma chave de acesso. Esse tempo de expiração é configurável pela variável de ambiente **TOKEN_EXPIRATION**.

O disparo do email é feito de maneira assíncrona. Quando um cliente se registra, um evento **created-customer** é publicado. Esse evento, ao ser consumido, inicia um processo em background para disparar o email para o cliente. Para enviar emails reais, as variáveis de ambiente **SMTP_HOST**, **SMTP_PORT**, **SMTP_USER** e **SMTP_PASS** devem ser configuradas. Se não forem, uma conta de teste será utilizada e um link para visualização do email será logado. Use `docker logs -f luizalabs-test-favorites-service-1` para ver os logs do serviço e acessar o link.

**Observações:**

- A solução de autenticação escolhida provavelmente não faria sentido se integrada ao ecossistema da Luizalabs. A decisão por essa estratégia se deu ao imaginar um serviço isolado sendo consumido diretamente por um cliente que não possui uma senha.
- A solução de autenticação escolhida poderia ser aprimorada. Recursos como revogação de chaves de acesso, geração de novas chaves, renovação de tokens, etc são necessários, mas não puderam ser implementados a tempo.
- Caso a variável **TOKEN_EXPIRATION** não seja configurada, será utilizado o valor default de 1 hora. Esse valor foi definido apenas para facilitar os testes e não necessariamente reflete a realidade.

---

### 🧑 Gerenciamento de clientes

Um dos requisitos do desafio é que, após se registrar e autenticar, o cliente deve poder:

- Visualizar seus próprios dados (**GET /me**)
- Atualizar suas informações (**PATCH /me**)
- Excluir sua conta (**DELETE /me**)

É importante ressaltar que o identificador do cliente é extraído do seu token de acesso. Por isso, os endpoints não permitem um ID no path. Essa decisão se deu ao imaginar que essa API seria pública e consumida diretamente pelo cliente autenticado. Porém, caso um outro componente de software ou um administrador do sistema precise gerenciar clientes, os recursos poderiam ser facilmente renomeados para:

- Visualizar dados de um cliente específico (**GET /customers/{id}**)
- Atualizar informações de um cliente específico (**PATCH /customers/{id}**)
- Excluir um cliente específico (**DELETE /customers/{id}**)

É claro que, ao implementar a segunda opção, também seria necessário adicionar autorização/permissionamento para evitar que clientes interajam com informações de outros clientes.

---

### ⭐ Gerenciamento de favoritos

Um dos requisitos do desafio é que, após se registrar e autenticar, o cliente deve poder:

- Adicionar um produto à sua lista de favoritos (**POST /favorites**)
- Visualizar produtos favoritos (**GET /favorites**)
- Remover um produto da sua lista de favoritos (**DELETE /favorites/{id}**)

#### 📌 Possíveis soluções

Considerando que os dados dos produtos precisam ser extraídos de uma API externa, existem 2 opções mais simples para gerenciar favoritos do cliente:

1. Ao adicionar um favorito, buscar os dados do produto na API e salvar esses dados dentro da lista de favoritos do cliente no banco. Quando o cliente solicitar seus favoritos, os dados já estarão salvos, eliminando a necessidade de chamadas externas. Essa opção até favorece a performance, mas possui sérios **problemas de consistência**, já que os mesmos dados continuariam sendo retornados ainda que os dados reais dos produtos fossem alterados.
2. Ao adicionar um favorito, se o produto existir, salvar o ID do produto na lista de favoritos do cliente no banco. Quando o cliente solicitar seus favoritos, para cada ID de produto salvo na lista, será feita uma chamada externa para trazer os dados mais atualizados dos produtos. Essa opção é bem consistente, mas possui sérios **problemas de performance**, já que as múltiplas chamadas externas aumentariam a latência e sobrecarregariam a API de produtos. Além disso, também existe um **problema de resiliência**, já que o serviço seria fortemente acoplado a sua dependência e, consequentemente, frágil e pouco resiliente a possíveis falhas ou indisponibilidades da API externa.

#### 🎯 Solução escolhida

Considerando esses fatores, a solução escolhida busca **equilibrar consistência, resiliência e ainda ser muito performática**. Para isso, foram utilizadas tecnologias de banco de dados, cache e mensageria (**RabbitMQ**), além da integração externa com a API de produtos. Seguem os detalhes da solução:

**Ao adicionar um favorito:**

- Se o produto não existe no cache (cache miss), os seus dados são recuperados da API de produtos. Em seguida, caso o produto tenha sido retornado pela API, o seu ID é adicionado na lista de favoritos do cliente no banco e os seus dados são inseridos no cache com um tempo para se tornarem obsoletos. Esse tempo é configurável pela variável de ambiente **CACHE_STALE_TIME**.
- Se o produto existe no cache (cache hit), o ID desse produto é adicionado na lista de favoritos do cliente no banco. Se esse produto está obsoleto no cache, um evento **stale-product** é publicado.

**Ao buscar favoritos:**

- Para cada ID de produto na lista de favoritos do cliente no banco, os dados desses produtos são recuperados do cache e retornados. Para cada produto obsoleto no cache, um evento **stale-product** é publicado.
- Como a lista de favoritos é ilimitada, os dados podem ser paginados através dos parâmetros _page_ e _limit_.

**Ao consumir evento "stale-product":**

- Esse evento, ao ser consumido, inicia um processo em background para atualizar os dados do produto no cache, fazendo uma nova chamada a API de produtos. Se por acaso, esse produto deixou de existir e não foi retornado pela API, um evento **removed-product** é publicado.

**Ao consumir evento "removed-product":**

- Esse evento, ao ser consumido, inicia um processo em background para remover os dados do produto do cache e remover seu ID das listas de favoritos dos clientes no banco.

**Conclusão:**

- Com essa solução, na maioria das vezes, os dados dos produtos são extraídos do cache em memória, o que é extremamente benéfico para a performance. Mesmo assim, se houvesse muito cache miss, as chamadas externas a API para atualização do cache poderiam trazer prejuízos a performance se fossem feitas durante a solicitação do cliente. Por conta disso, quando um produto está obsoleto no cache, ele é retornado "desatualizado", o cliente é liberado e o processo de atualização dos dados desse produto no cache é feito em background via mensageria. Na próxima solicitação do cliente, os dados mais atuais já estarão disponíveis.
- Dessa forma, temos uma **solução muito performática, eventualmente consistente e consideravelmente resiliente**, já que se a API de produtos estiver indisponível durante a atualização em background, a mensagem será enviada para a dead letter e reprocessada num intervalo de tempo configurável pela variável de ambiente **DLQ_RETRY_INTERVAL**.

**Observações:**

- Conforme a restrição do desafio, o banco de dados e o cache estão em estruturas de dados em memória, mas poderiam ser facilmente substituídos por tecnologias reais, como **MongoDB/PostgreSQL** e **Redis**, respectivamente.
- Caso as variáveis **CACHE_STALE_TIME** e **DLQ_RETRY_INTERVAL** não sejam configuradas, será utilizado o valor default de 10 segundos. Esse valor foi definido apenas para facilitar os testes e não necessariamente reflete a realidade.

---

## 📋 Melhorias e evoluções

Algumas melhorias e evoluções que poderiam ser implementadas com mais tempo:

#### 🧪 Melhoria dos testes integrados

- Substituir os **mocks** de **fila (AMQP)** e **API externa** por containers reais nos testes de integração, garantindo maior fidelidade ao ambiente de produção.

#### 📊 Observabilidade e Monitoramento

- Adicionar **logs estruturados** com correlação entre requisições.
- Implementar **métricas técnicas** (ex: tempo de resposta, taxa de erros) e **de negócio** (ex: novos cadastros de clientes).
- Configurar **alertas automáticos** em caso de falhas.
- Em caso de múltiplos serviços, introduzir **tracing distribuído** para acompanhar o fluxo entre módulos.

#### 🔀 Processo de versionamento

- Estruturar o fluxo de trabalho com **GitFlow**, incluindo branches padronizadas (`master`, `qa`, `develop`, `feature/*`, `hotfix/*`, `release/*`).

#### 🚀 Implantação

- Criar pipeline de **CD automatizado** com deploy em ambiente real.
- Suporte a **rollback automático** em caso de falhas.
