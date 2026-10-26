# HS Barber Club

Landing page institucional em HTML, CSS e JavaScript puro, sem dependências de produção. Abra `index.html` no navegador ou sirva esta pasta com um servidor estático. Fotografias e logo originais estão preservadas em `assets/img/`.

## Configuração antes de publicar

- **Domínio definitivo:** informar em `SITE_CONFIG.canonicalUrl`, em `assets/js/main.js`, com a URL completa e barra final. Para SEO independente de JavaScript, inserir também `<link rel="canonical" href="URL_CONFIRMADA">` e `<meta property="og:url" content="URL_CONFIRMADA">` no head de `index.html`. Substituir os caminhos de `og:image` e `twitter:image` pela URL absoluta de `assets/img/hs-ambiente.webp` nesse domínio. Não publicar valores fictícios. Criar `robots.txt` e `sitemap.xml` quando o domínio for definido.
- **Perfil da Empresa no Google:** inserir a URL exata em `SITE_CONFIG.googleReviewsUrl`. O botão “Ver no Google” permanece desativado até essa informação ser fornecida. Também pode receber `href`, `target="_blank"` e `rel="noopener noreferrer"` diretamente no HTML, removendo `aria-disabled`, para funcionar sem JavaScript.
- **Depoimentos reais:** preencher os três `data-review-slot` em `index.html` com textos e autores confirmados e remover `hidden` do contêiner. Estilizar conforme o volume real recebido. Nenhum nome ou depoimento foi inventado.
- **Equipe:** há comentários junto às fotografias indicando onde adicionar nome, cargo e Instagram confirmados. As imagens mostram atendimentos, sem identificação fictícia.
- **Planos:** todos os CTAs usam o link fornecido da Beacons. Valores e condições não foram informados.
- **Crédito:** “Desenvolvido por Filipe Assis” está preservado; adicionar link ao nome quando a URL profissional for fornecida.

## Comportamentos

Menu mobile em `dialog`, com foco contido, fechamento por Escape e bloqueio de rolagem; galeria ampliada com fotografias completas; âncoras compensadas pela altura do header; navegação ativa; reveal e parallax discretos; respeito a movimento reduzido; WhatsApp e retorno ao topo. Os tempos da notificação ficam em `SITE_CONFIG.whatsappNotice`. Fechar a notificação impede novas exibições durante a visita.

O conteúdo essencial e os links funcionam sem JavaScript. Sem JavaScript, a navegação também está disponível no rodapé; as fotos da galeria abrem diretamente.

SEO local: um H1, metadados sociais e JSON-LD HairSalon com dados fornecidos. A nota 5,0 e mais de 100 avaliações foram fornecidas no briefing; não há avaliações fictícias nem marcação de avaliação agregada no schema.

## Validação da primeira versão

Testes executados no Chrome local em 3 de outubro de 2026:

- Larguras de 320, 375, 390, 430, 768, 1024, 1440 e 1920 px: a largura de rolagem correspondeu à viewport em todas, sem overflow horizontal da página.
- Âncoras do menu posicionadas imediatamente abaixo do header, com compensação de 88 px no desktop e 72 px no mobile; também conferidas com scroll suave.
- Menu mobile: abertura, bloqueio de rolagem, `aria-expanded`, foco contido, fechamento por Escape e navegação para uma seção.
- Galeria: abertura, carregamento da fotografia completa, fechamento por Escape e retorno do foco ao link de origem.
- Notificação do WhatsApp: exibição após o intervalo configurado e dispensa pelo usuário. Em telas pequenas, a notificação é adiada quando cobriria um link; o botão de retorno ao topo é ocultado quando se sobrepõe a um link.
- Imagens: todos os caminhos usados carregaram, sem imagens quebradas. Dimensões originais verificadas. Logo e fotografias não foram editadas.
- JavaScript: sintaxe válida, nenhuma exceção ou mensagem de erro no console durante os testes. Reveal conferido; movimento reduzido respeitado.
- Estrutura: um H1, JSON-LD válido, destinos internos existentes e atributos de segurança dos links externos conferidos. Os URLs externos correspondem aos fornecidos; disponibilidade dos serviços externos não foi auditada.
- Conteúdo principal visível sem JavaScript. Revisão visual das seções em desktop e mobile, incluindo 320 px.

Ainda é recomendável conferir em Safari/iOS e em aparelhos físicos antes de publicar; esses ambientes não estavam disponíveis nesta sessão. Não foram medidos Core Web Vitals em produção.
