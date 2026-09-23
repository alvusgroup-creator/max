# Maxilimpo — site

Landing page de uma página da **Maxilimpo · Limpezas em Geral** (Barcelos e região).
Site estático: HTML + CSS + JS, sem frameworks nem passo de build.

## Como publicar na Hostinger

O repositório está preparado para ser clonado **diretamente para `public_html`**:
o `index.html` está na raiz, por isso o site abre sem configuração adicional.

1. hPanel → **Avançado → Git**
2. Repositório: `https://github.com/alvusgroup-creator/max.git`
3. Ramo: `main`
4. Diretório: deixar vazio (instala em `public_html`)
5. **Implementar**. Nas publicações seguintes, basta carregar em *Implementar* outra vez.

Não há nada para compilar nem dependências para instalar.

## Estrutura

```
index.html            a página
css/styles.css        sistema de design (paleta no :root)
js/main.js            menu, carrosséis, animações, validação e popup
assets/fonts/         Poppins 600 + Inter, self-hosted (.woff2)
assets/img/           logótipos, ícones e fotografias (.webp)
  fotos/              hero, "quem somos" e mapa de Barcelos
  servicos/           uma foto por serviço
  galeria/            carrossel de trabalhos
favicon.ico
robots.txt            bloqueia /docs à indexação
.htaccess             HTTPS, cache, compressão e bloqueio de /docs
docs/                 material de trabalho — não é servido
  LEIA-ME.md          pendências e decisões do projeto (ler primeiro)
  CONTEXTO.txt        dados que a cliente forneceu
  maxilimpo-copy.md   copy aprovada, com os pontos por confirmar
  MODELO-SITE.md      padrão de design da agência
  marca/              logótipos originais em alta resolução
```

## Antes de publicar

Ver **[docs/LEIA-ME.md](docs/LEIA-ME.md)**. Em resumo, falta:

- substituir as fotografias de banco (Pexels) por fotografias reais;
- ligar o envio dos formulários a um serviço (hoje abre o WhatsApp preenchido);
- Política de Privacidade, Política de Cookies e Livro de Reclamações;
- confirmar com a cliente os pontos assinalados com ⚠️ na copy.

## Desenvolvimento local

As fontes falham em `file://` por CORS, por isso convém servir por HTTP:

```bash
python -m http.server 8000
# abrir http://localhost:8000
```
