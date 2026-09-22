# Maxilimpo — site (one page)

Stack estática: HTML + CSS + JS, sem frameworks. Fontes self-hosted (Poppins 600 + Inter).
Layout próprio da Maxilimpo: **hero com foto em arco** (header flutuante, título com bloco
de destaque, benefícios sobrepostos), serviços em carrossel, ondas entre dobras e brilhos
flutuantes nas margens. CSS e JS escritos de raiz para este site — do projeto Silhueta só
se mantém a direção geral de estilo (ver `../MODELO-SITE.md`).

## Estrutura

```
site/
  index.html
  css/styles.css        sistema de design (paleta Maxilimpo no :root)
  js/main.js            menu, carrossel, marquee, brilhos, validação e popup
  assets/fonts/         woff2 self-hosted
  assets/img/           logótipos, ícones, fotos (+ CREDITOS.txt por pasta)
```

Dobra a dobra: hero em arco → benefícios (4 cards sobrepostos) → serviços (carrossel de 6 cards) →
quem somos → como funciona (linha do tempo, faixa azul-marinho) → trabalhos (carrossel contínuo de
fotos) → para quem (4 perfis) → onde estamos (mapa de Barcelos) → CTA + formulário (fundo
claro, formulário em cartão branco) → rodapé azul-marinho.
Todas as dobras terminam com um botão de ação. Conversão: formulário do CTA final + popup de
orçamento, WhatsApp flutuante e barra fixa no telemóvel (escondidos no hero e no contacto).

## Paleta (derivada do logótipo)

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#01264D` | hero, texto de títulos, estrutura |
| `--green` | `#2F7D06` | verde da marca escurecido para AA — botões e links |
| `--green-hi` | `#3D8E01` | verde do logótipo — fundos e números dos passos |
| `--water` | `#1B84DE` | azul-água decorativo |
| `--tint` / `--tint-2` | `#E8F1F9` / `#F1F7FB` | pílulas e faixas suaves |
| `--navy-deep` | `#011D3C` | rodapé |
| `--bg` | `#FFFFFF` | fundo geral |

## A tratar antes de publicar

**Conteúdo em falta (cliente)**
- [x] **Zona de atuação: Barcelos.** Já está no title, meta description, H1, schema, mapa e rodapé.
      Falta confirmar o raio exato de deslocação (freguesias / concelhos vizinhos) — ver o TODO na
      secção "Onde estamos".
- [ ] **Fotos reais.** Todas as imagens são de banco (Pexels) — ver `CREDITOS.txt` em cada pasta.
      Substituir mantendo nome de ficheiro e proporção.
- [ ] **Secção "Trabalhos"** está em modo demonstração (selo "Fotos ilustrativas"). Apresentar
      fotos de banco como trabalhos próprios é publicidade enganosa: ou entram fotos reais, ou a
      secção esconde-se no lançamento.
- [ ] **Testemunhos reais** (prints de WhatsApp com autorização servem). A dobra de testemunhos
      foi retirada até haver material real.
- [ ] **Nome e foto da fundadora** — recomendado; em limpeza, uma cara real converte.
- [ ] E-mail profissional com domínio próprio, em vez do Gmail pessoal.

**Afirmações a validar (marcadas com ⚠️ em `../maxilimpo-copy.md`)**
- [ ] O orçamento é gratuito / sem compromisso? (a frase foi retirada do site até confirmar)
- [ ] Tempo médio de resposta; a equipa leva produtos e equipamento?
- [ ] Horários fora de horas para comércio e escritórios; visita técnica antes de orçamentar?
- [ ] Serviços extra: mudanças, fim de arrendamento, Alojamento Local?

**Obrigações legais**
- [ ] Política de Privacidade e de Cookies (e ativar o checkbox RGPD no popup — já preparado em comentário).
- [ ] Link para o Livro de Reclamações Eletrónico.
- [x] Custo da chamada indicado junto ao número (hero e rodapé).

**Técnico**
- [ ] Ligar o envio dos formulários a um serviço real (Formspree, Web3Forms ou endpoint próprio):
      ver `sendQuote()` em `js/main.js`. Até lá, o pedido abre o WhatsApp com todos os campos
      já preenchidos — funciona, mas não deixa registo no e-mail da cliente.
- [ ] Domínio: acrescentar `<link rel="canonical">` e `og:url`.
- [ ] Atenção ao nome: existe uma concorrente **Maxilimpe** (maxilimpe.pt). Ancorar sempre a marca
      na localidade e verificar registo no INPI.

## Notas

- Servir por HTTP (as fontes falham em `file://` por CORS).
- Verificado sem scroll horizontal em 390 / 768 / 1280 / 1440 (incluindo durante as animações de
  entrada); o popup cabe sem scroll a partir de 360×640; validação dos formulários testada.
- Animações: o hero e o cabeçalho entram ao carregar; as restantes dobras entram ao chegar ao ecrã
  (a foto do "Quem somos" pela esquerda, o texto pela direita; cards escalonados a 80ms).
  Na linha do tempo, o fio desenha-se, os marcadores entram com salto (160ms entre cada), os
  ícones têm animação própria em ciclo e um brilho percorre a linha no desktop.
  Tudo desligado com o modo de movimento reduzido do sistema — verificado que nada fica invisível.
