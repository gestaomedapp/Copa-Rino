# Copa Rino — app instalável (PWA)

Esta pasta é o app inteiro. Não precisa compilar nada: são arquivos estáticos
que qualquer hospedagem gratuita serve.

## O que tem aqui

```
index.html              o app
dados.json              os jogos e resultados  ← é o único arquivo que muda no dia a dia
manifest.webmanifest    nome, ícone e cores do app instalado
sw.js                   guarda o app para funcionar offline
icons/                  ícones da tela de início
escudos/                os 8 escudos das turmas + o rinoceronte da AAAMC
.nojekyll               arquivo vazio; impede o GitHub de processar a pasta
```

O `.nojekyll` é invisível no Finder e no Explorer. Se ele sumir na hora de
enviar, tudo continua funcionando — ele só evita um comportamento antigo do
GitHub Pages que não afeta esses arquivos.

## Publicar no GitHub Pages (gratuito, tudo pelo navegador)

Não precisa instalar git nem usar terminal.

1. Em **github.com**, clique em **New repository**.
2. Nome: `copa-rino`. Marque **Public** — o GitHub Pages só é gratuito em
   repositório público. Não marque nenhuma das caixas de "Initialize".
   Clique em **Create repository**.
3. Na tela que aparece, clique no link **uploading an existing file**.
4. Arraste **o conteúdo desta pasta** (os arquivos e as pastas `escudos` e
   `icons`, não a pasta de fora). Espere terminar e clique em
   **Commit changes**.
5. Vá em **Settings → Pages**. Em *Source*, escolha **Deploy from a branch**;
   em *Branch*, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
6. Espere cerca de um minuto e recarregue a página de Pages. O endereço
   aparece lá, no formato `https://SEU-USUARIO.github.io/copa-rino/`.

HTTPS vem ligado, e sem ele o app não instala no celular.

## Atualizar os resultados — direto pelo site do GitHub

Essa é a grande vantagem de estar no GitHub: dá para editar pelo celular, sem
mexer em arquivo nenhum no computador.

1. Abra o repositório e clique em **dados.json**.
2. Clique no ícone de lápis (*Edit this file*).
3. Preencha a lista `partidas` e clique em **Commit changes**.
4. Em torno de um minuto o GitHub republica sozinho.

O app relê os dados a cada 30 segundos, então ninguém precisa fechar e abrir.
Na prática: alguém da organização com acesso ao repositório vira o
administrador dos resultados, e isso já funciona hoje, sem a gente construir
painel nenhum.

Formato de cada partida:

```json
{
  "fase": "grupos",
  "rodada": 1,
  "casa": "t15",
  "fora": "t20",
  "golsCasa": 2,
  "golsFora": 1,
  "status": "encerrado",
  "dataHora": "2026-09-27T09:00:00-03:00",
  "local": "Quadra 1"
}
```

- **ids das turmas:** `t15` `t18` `t19` `t20` `t21` `t23` `t24` `t25`
- **status:** `agendado` · `encerrado` · `wo` — não existe estado ao vivo
- **golsCasa / golsFora:** só aparecem no app quando `status` for `encerrado`
- **fase:** `grupos` · `quartas` · `semi` · `final` · `terceiro`

Enquanto `partidas` estiver vazio, o app mostra uma simulação da fase de
grupos, sinalizada na tela com uma faixa vermelha. A faixa some sozinha no
instante em que a primeira partida de verdade for gravada.

## Se um dia quiserem resultado mais rápido

Editar o `dados.json` pelo GitHub leva cerca de um minuto até o ar. Para
placar minuto a minuto isso pode incomodar. Quando chegar a hora, o
**Firebase Firestore** atualiza na hora, é gratuito nesse volume e é a base
natural para a conta de administrador com tela própria.

A troca é de uma linha: preencha `FONTE_REMOTA` no `index.html` com a URL da
nova fonte. Procure por `const FONTE_REMOTA = ""` no arquivo. Nada mais no app
muda.

## Ao mexer no código do app

Se editar `index.html`, `sw.js` ou os escudos, troque o número em
`const VERSAO = "copa-rino-v5"` no `sw.js` (v2, v3...). Sem isso, quem já tem o
app instalado continua vendo a versão antiga, guardada no cache.

Trocar só o `dados.json` não exige isso — ele nunca é servido do cache.

## Como as turmas instalam

**iPhone:** abrir o link no Safari → botão de compartilhar → *Adicionar à Tela
de Início*. Precisa ser o Safari; no Chrome do iPhone a opção não aparece.

**Android:** abrir o link no Chrome → menu de três pontos → *Instalar app* (ou
*Adicionar à tela inicial*).

Depois disso o app abre em tela cheia, com o ícone do rinoceronte, sem barra de
endereço — e continua abrindo mesmo sem internet, mostrando os últimos
resultados que baixou.
