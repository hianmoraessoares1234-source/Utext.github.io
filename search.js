(function(){
  const topics = [
    {title: 'Página Inicial', url: 'index.html', keywords: ['home','início','principal']},
    {title: 'Categorias', url: 'loja.html', keywords: ['categorias','loja','produtos','livros']},
    {title: 'Login', url: 'login.html', keywords: ['login','entrar','conta']},
    {title: 'Loja', url: 'loja.html', keywords: ['produto','livros','livraria']}
  ];

  const toggle = document.querySelector('.search-toggle');
  const searchbar = document.querySelector('.searchbar');
  const input = document.getElementById('site-search');
  const suggestions = document.getElementById('search-suggestions');
  const clearBtn = document.getElementById('clear-search');

  let current = -1;
  let filtered = [];

  function openSearch(){
    searchbar.classList.add('expanded');
    input.focus();
    renderSuggestions('');
  }
  function closeSearch(){
    searchbar.classList.remove('expanded');
    suggestions.classList.remove('show');
    input.value = '';
    current = -1;
  }

  toggle.addEventListener('click', ()=>{
    if(searchbar.classList.contains('expanded')) closeSearch(); else openSearch();
  });

  clearBtn.addEventListener('click', ()=>{ input.value=''; input.focus(); renderSuggestions(''); });

  function normalize(s){ return (s||'').toLowerCase(); }

  function matchTopics(q){
    const nq = normalize(q);
    if(!nq){
      const p = (typeof products !== 'undefined') ? products.slice(0,6).map(p=>({title:p.title,url:'book.html?id='+p.id,meta:(p.author||'')+' · '+(p.category||'')})) : [];
      return p.concat(topics.slice(0,6).map(t=>({title:t.title,url:t.url,meta:(t.keywords||[]).slice(0,3).join(' · ')})));
    }

    const prodMatches = (typeof products !== 'undefined') ? products
      .filter(p=> normalize(p.title).includes(nq) || (p.author && normalize(p.author).includes(nq)) || (p.category && normalize(p.category).includes(nq)))
      .map(p=>({title:p.title,url:'book.html?id='+p.id,meta:(p.author||'')+' · '+(p.category||'')})) : [];

    const topicMatches = topics
      .map(t=>({t,score: Math.max(...[t.title, ...(t.keywords||[])].map(txt => (normalize(txt).includes(nq) ? 1 : 0)))}))
      .filter(x=>x.score>0)
      .map(x=>({title:x.t.title,url:x.t.url,meta:(x.t.keywords||[]).slice(0,3).join(' · ')}));

    return prodMatches.concat(topicMatches);
  }

  function highlight(text, q){
    if(!q) return text;
    const idx = normalize(text).indexOf(normalize(q));
    if(idx === -1) return text;
    return text.slice(0,idx) + '<strong>' + text.slice(idx, idx+q.length) + '</strong>' + text.slice(idx+q.length);
  }

  function renderSuggestions(q){
    filtered = matchTopics(q);
    suggestions.innerHTML = '';
    if(filtered.length===0){ suggestions.classList.remove('show'); return; }
    filtered.forEach((item,i)=>{
      const li = document.createElement('li');
      li.setAttribute('role','option');
      li.setAttribute('data-url', item.url);
      li.innerHTML = '<span class="title">'+ highlight(item.title, q) +'</span><span class="meta">'+ (item.meta||'') +'</span>';
      li.addEventListener('click', ()=>{ location.href = item.url; });
      li.addEventListener('mouseenter', ()=>{ setSelected(i); });
      suggestions.appendChild(li);
    });
    suggestions.classList.add('show');
    current = -1;
  }

  function setSelected(index){
    const items = suggestions.querySelectorAll('li');
    items.forEach((el,idx)=> el.setAttribute('aria-selected', idx===index ? 'true' : 'false'));
    current = index;
  }

  input.addEventListener('input', (e)=>{
    renderSuggestions(e.target.value);
  });

  input.addEventListener('keydown', (e)=>{
    const items = suggestions.querySelectorAll('li');
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(items.length===0) return;
      setSelected(Math.min(current+1, items.length-1));
      items[current].scrollIntoView({block:'nearest'});
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(items.length===0) return;
      setSelected(Math.max(current-1, 0));
      items[current].scrollIntoView({block:'nearest'});
    } else if(e.key === 'Enter'){
      e.preventDefault();
      if(current >= 0 && items[current]){
        const url = items[current].getAttribute('data-url');
        if(url) location.href = url;
      } else if(input.value.trim()){
        const qv = input.value.trim().toLowerCase();
        if(typeof products !== 'undefined'){
          const found = products.find(p=> (p.title && p.title.toLowerCase().includes(qv)) || (p.author && p.author.toLowerCase().includes(qv)) );
          if(found){ location.href = 'book.html?id=' + found.id; return; }
        }
        location.href = 'loja.html?q=' + encodeURIComponent(input.value.trim());
      }
    } else if(e.key === 'Escape'){
      closeSearch();
    }
  });

  document.addEventListener('click', (ev)=>{
    if(!searchbar.contains(ev.target) && !toggle.contains(ev.target)){
      closeSearch();
    }
  });

  document.addEventListener('DOMContentLoaded', ()=>{
  });
})();

    const products = [
      {
        id: 1,
        title: 'Como se tornar o melhor professor de TMA do Mundo',
        price: 10.00,
        img: 'img/tcb1.png',
        images: ['img/tcb1.png'],
        author: 'Tiago Careta',
        category: 'Educação',
        site: '#',
        buy: '#',
        publisher: 'Editora Utext',
        pages: 224,
        isbn: '978-85-0000-001-1',
        rating: 4.6,
        genres: ['Educação','Didática'],
        description: 'Abordagens práticas, exemplos de atividades e estratégias para melhorar o ensino de TMA em diferentes contextos escolares.',
        excerpt: 'Este é um trecho de demonstração do livro: "Ensinar é criar espaço para a descoberta..."',
        authorBio: 'Tiago Careta é professor com 15 anos de experiência e autor de diversos manuais pedagógicos.',
        reviews: [
          {name:'Ana',text:'Muito útil e prático. Melhorei minhas aulas.',rating:5},
          {name:'Carlos',text:'Boas ideias, recomendo para formadores.',rating:4}
        ]
      },
      {
        id: 2,
        title: 'Cartas Ridículas',
        price: 10.00,
        img: 'img/cartasridiculas.jpg',
        images: ['img/cartas estupidas site 1.png','img/ajeitar contracapa.jpg'],
        author: 'Maria Oliveira',
        category: 'Poesia',
        site: '#',
        buy: '#',
        publisher: 'CriaEditions',
        pages: 312,
        isbn: '978-85-0000-002-8',
        rating: 4.2,
        genres: ['Cartas','Amor','Poemas'],
        description: '“As páginas deste livro nasceram de cartas de amor enviadas por diferentes pessoas — palavras sinceras, guardadas no tempo, que agora se unem para contar histórias de afeto, saudade e sentimentos que mereciam ser partilhados.”',
        excerpt: 'Trecho: "O processo criativo começa por ouvir com atenção o problema..."',
        authorBio: 'Maria é designer e professora universitária, com foco em projetos sociais e inovação.',
        reviews: [
          {name:'Beatriz',text:'Visualmente belo e inspirador.',rating:5},
          {name:'Rui',text:'Conteúdo denso, vale a leitura.',rating:4}
        ]
      },
      {
        id: 3,
        title: 'Ratito',
        price: 10.00,
        img: 'img/ratito2.png',
        images: ['img/ratito2.png', 'img/rt1.jpg', 'img/projeto Simone.png'],
        category: 'Banda desenhada',
        rating: 4.0,
        description: '“Ratito é um livro que reúne contos e poemas entrelaçados por uma atmosfera de melancolia e beleza. As histórias exploram temas como a solidão, a perda e a busca por sentido, sempre com uma escrita sensível e envolvente.”',
        excerpt: 'Trecho: "Naquela noite a cidade parecia respirar mais devagar..."',
        authorBio: 'Clara Mendes é contista e editora, premiada em festivais literários.',
        reviews: [
          {name:'João',text:'Histórias tocantes e bem escritas.',rating:4},
          {name:'Lara',text:'Leitura leve e emocionante.',rating:4}
        ]
      },
      {
        id: 4,
        title: 'Boa Noite Primeira Edição',
        price: 10.00,
        img: 'img/bnd.png',
        images: ['img/bnd1.png','img/boa noite livro.jpg','img/bnd2.png','img/bnd3.png'],
        category: 'Poesia',
        site: 'BoaNoite/index.html',
        pages: 38,
        genres: ['Poemas','Proza'],
        description: '“Boa noite — que estas páginas sejam um lugar onde os sentimentos encontram palavras e onde cada leitor possa reconhecer um pouco de si.”',
        authorBio: 'Autor Exemplo é engenheiro de software e instrutor em bootcamps.',
        reviews: [
          {name:'Paulo',text:'Bom para iniciantes.',rating:4},
          {name:'Sofia',text:'Poderia ter mais exemplos práticos.',rating:3}
        ]
      },
      {
        id: 5,
        title: 'Bolsa Boa Noite Azul',
        price: 55.00,
        img: 'img/totebag boa noite azul montanha.png',
        images: ['img/totebag boa noite azul montanha.png', 'img/Tote Bag Mockup poesias.png'],
        category: 'Poesia',
        site: 'BoNoite/index.html',
        description: 'Bolsa tematica do livro "Boa Noite Primeira Edição", com design exclusivo inspirado na capa e elementos visuais do livro, perfeita para os fãs levarem um pouco da poesia para o dia a dia.',
        excerpt: 'Trecho: "Começamos por configurar um ambiente leve e eficiente..."',
        authorBio: 'Autor Exemplo é engenheiro de software e instrutor em bootcamps.'
      },
      {
        id: 6,
        title: 'Bosa Boa Noite Preta',
        price: 55.00,
        img: 'img/totebag boa noite preta.png',
        images: ['img/totebag boa noite preta.png'],
        category: 'Poesia',
        description: 'Bolsa tematica do livro "Boa Noite Primeira Edição", com design exclusivo inspirado na capa e elementos visuais do livro, perfeita para os fãs levarem um pouco da poesia para o dia a dia.',
        excerpt: 'Trecho: "Começamos por configurar um ambiente leve e eficiente..."',
        authorBio: 'Autor Exemplo é engenheiro de software e instrutor em bootcamps.'
      },
       {
        id: 7,
        title: 'Canetas Utext',
        price: 5.00,
        img: 'img/utext canetas.png',
        images: ['img/utext canetas.png'],
        category: 'Papelaria',
        description: 'Use estas canetas da ediora Utext para escrever suas poesias, cartas ou qualquer coisa que queira colocar no papel. Com tinta de alta qualidade e design confortável, são perfeitas para inspirar sua criatividade.',
      },
      {
        id: 8,
        title: 'Bolsa Boa Noite Temática',
        price: 55.00,
        img: 'img/totebag i can feel brown.png',
        images: ['img/totebag i can feel brown.png'],
        category: 'Poesia',
        description: 'Bolsa tematica do poema "Boa Noite Primeira Edição", com design exclusivo inspirado na capa e elementos visuais do livro, perfeita para os fãs levarem um pouco da poesia para o dia a dia.',
      },
            {
        id: 9,
        title: 'Moleton Utext',
        price: 55.00,
        img: 'img/h1.png',
        images: ['img/h1.png', 'img/etiqueta 2.png'],
        category: 'Roupa',
        description: 'Moleton da editora Utext, com design exclusivo inspirado na capa e elementos visuais da logo, perfeito para os fãs levarem um pouco da poesia para o dia a dia.',
      },
            {
        id: 10,
        title: 'T-shirt Cantar a Lua',
        price: 10.00,
        img: 'img/1.png',
        images: ['img/1.png', 'img/etiqueta.png'],
        category: 'Roupa',
        description: 'T-shirt inspirada no poema "Cantar a Lua", com design exclusivo inspirado na capa e elementos visuais do livro, perfeita para os fãs levarem um pouco da poesia para o dia a dia.',
      },
              {
        id: 10,
        title: 'T-shirt Ser ou não ser nós mesmos',
        price: 10.00,
        img: 'img/2.png',
        images: ['img/2.png', 'img/etiqueta.png'],
        category: 'Roupa',
        description: 'T-shirt inspirada no poema "Ser ou não sermos", com design exclusivo inspirado na capa e elementos visuais do livro, perfeita para os fãs levarem um pouco da poesia para o dia a dia.',
      },
            {
        id: 11,
        title: 'T-shirt Utext',
        price: 10.00,
        img: 'img/3.png',
        images: ['img/3.png', 'img/etiqueta.png','img/3.1.png', 'img/etiqueta 2.png'],
        category: 'Roupa',
        description: 'Um design exclusivo inspirado na logo da editora Utext, perfeito para os fãs levarem um pouco da poesia para o dia a dia.',
      },
            {
        id: 12,
        title: 'Caderno de Notas Utext',
        price: 10.00,
        img: 'img/c1.png',
        images: ['img/c1.png', 'img/c2.png'],
        category: 'Papelaria',
        description: 'Caderno de notas da editora Utext, com design exclusivo inspirado na capa e elementos visuais da logo, perfeito para os fãs levarem um pouco da poesia para o dia a dia.',
      },
  
    ];

    let cart = JSON.parse(localStorage.getItem('cart')||'[]');

    function saveCart(){
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    function fmt(v){return '€ '+v.toFixed(2).replace('.',',');}

    function addToCart(id){
      const p = products.find(x=>x.id===id);
      const item = cart.find(x=>x.id===id);
      if(item) item.qty++;
      else cart.push({id:p.id,title:p.title,price:p.price,qty:1,img:p.img});
      updateCart();
    }

    function updateCart(){
      const el = document.getElementById('cart-items');
      el.innerHTML = '';
      let total = 0;
      cart.forEach(ci=>{
        total += ci.price*ci.qty;
        const d = document.createElement('div'); d.className='cart-item';
        d.innerHTML = `<img src="${ci.img}" alt=""><div style=\"flex:1\"><div>${ci.title}</div><div style=\"font-size:13px;color:var(--muted)\">Qtd: ${ci.qty}</div></div><div style=\"text-align:right\">${fmt(ci.price*ci.qty)}<div style=\"margin-top:6px\"><button class=\"btn secondary\" onclick=\"dec(${ci.id})\">-</button> <button class=\"btn\" onclick=\"inc(${ci.id})\">+</button></div></div>`;
        el.appendChild(d);
      });
      document.getElementById('cart-total').textContent = fmt(total);
      document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
      saveCart();
    }

    function inc(id){const it=cart.find(x=>x.id===id); if(it){it.qty++; updateCart();}};
    function dec(id){const it=cart.find(x=>x.id===id); if(it){it.qty--; if(it.qty<=0) cart = cart.filter(x=>x.id!==id); updateCart();}};

    function toggleCart(){
      const c = document.getElementById('cart');
      const o = document.getElementById('cart-overlay');
      const open = c.classList.toggle('open');
      if(open){ o.classList.add('show'); document.body.style.overflow = 'hidden'; }
      else { o.classList.remove('show'); document.body.style.overflow = ''; }
    }
    function clearCart(){cart=[];updateCart();}
    function checkout(){ if(cart.length===0){alert('Carrinho vazio'); return;} alert('Simulação: finalizando compra. Total: '+document.getElementById('cart-total').textContent); }

    function renderProducts(){
      const container = document.getElementById('products');
      container.innerHTML = '';

      const q = document.getElementById('q').value.trim().toLowerCase();
      const author = document.getElementById('author').value.trim().toLowerCase();
      const category = document.getElementById('category').value;
      const pmin = parseFloat(document.getElementById('price-min').value) || 0;
      const pmax = parseFloat(document.getElementById('price-max').value) || Infinity;
      const sort = document.getElementById('sort').value;

      let list = products.filter(p=>{
        if(q && !(p.title.toLowerCase().includes(q) || (p.author && p.author.toLowerCase().includes(q)))) return false;
        if(author && !(p.author && p.author.toLowerCase().includes(author))) return false;
        if(category && category!="" && p.category!==category) return false;
        if(p.price < pmin || p.price > pmax) return false;
        return true;
      });

      if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);

      if(list.length===0){ container.innerHTML = '<p style="padding:20px">Nenhum produto encontrado.</p>'; return; }

      list.forEach(p=>{
        const d = document.createElement('div'); d.className='product'; d.setAttribute('data-id',p.id);
        d.innerHTML = `<a href="book.html?id=${p.id}" style="color:inherit;text-decoration:none"><img src="${p.img}" alt="${p.title}"></a>
          <div class="info">
          <h3><a href="book.html?id=${p.id}" style="color:inherit;text-decoration:none">${p.title}</a></h3>
            <p style="margin:0;font-size:14px;color:var(--muted)">Autor: ${p.author || ''}</p>
            <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">
              <div class="price">${fmt(p.price)}</div>
              <button class="btn" onclick="addToCart(${p.id})">Adicionar</button>
            </div>
          </div>`;
        container.appendChild(d);
      });
    }

    document.addEventListener('DOMContentLoaded',()=>{
      document.getElementById('apply').addEventListener('click',renderProducts);
      document.getElementById('reset').addEventListener('click',()=>{
        document.getElementById('q').value='';
        document.getElementById('author').value='';
        document.getElementById('category').value='';
        document.getElementById('price-min').value='';
        document.getElementById('price-max').value='';
        document.getElementById('sort').value='default';
        renderProducts();
      });
      document.getElementById('q').addEventListener('input',renderProducts);
      document.getElementById('author').addEventListener('input',renderProducts);
      document.getElementById('category').addEventListener('change',renderProducts);
      document.getElementById('sort').addEventListener('change',renderProducts);
      // preencher categorias dinamicamente (se o select existir na página de loja)
      const catEl = document.getElementById('category');
      if(catEl && catEl.tagName && catEl.tagName.toLowerCase() === 'select'){
        const cats = Array.from(new Set(products.map(p=>p.category).filter(Boolean))).sort();
        catEl.innerHTML = '<option value="">Todas</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
      }
      renderProducts();
      updateCart();
    });

function getParam(name){ return new URL(location.href).searchParams.get(name); }

document.addEventListener('DOMContentLoaded',()=>{
  const idRaw = getParam('id');
  const id = idRaw ? (isNaN(idRaw) ? idRaw : Number(idRaw)) : null;
  const product = (typeof products !== 'undefined') ? products.find(p=>p.id===id) : null;

  if(!product){
    document.getElementById('title').textContent = 'Livro não encontrado';
    document.getElementById('description').textContent = 'Verifique o id na URL.';
    return;
  }

  document.getElementById('title').textContent = product.title;
  document.getElementById('price').textContent = product.price ? ('€ '+product.price.toFixed(2).replace('.',',')) : '';
  document.getElementById('description').textContent = product.description || '';
  const buyEl = document.getElementById('buyLink');
  buyEl.href = '#';
  buyEl.removeAttribute('target');
  buyEl.removeAttribute('rel');
  buyEl.onclick = (e)=>{ e.preventDefault(); addToCart(product.id); toggleCart(); };
  document.getElementById('siteLink').href = product.site || '#';
  document.getElementById('category').textContent = product.category || '';
  document.getElementById('publisher').textContent = product.publisher || '';
  document.getElementById('pages').textContent = (product.pages? product.pages + ' págs' : '—');

  // rating
  const rVal = product.rating || 0;
  document.getElementById('ratingValue').textContent = rVal ? ('(' + rVal.toFixed(1) + ')' ) : '';
  const stars = Math.round(rVal);
  const starContainer = document.getElementById('ratingStars');
  starContainer.innerHTML = '';
  for(let s=0;s<5;s++){
    const sp = document.createElement('span'); sp.className = 'star'; sp.textContent = s<stars? '★' : '☆'; starContainer.appendChild(sp);
  }


  // related books (same category)
  const related = document.getElementById('relatedBooks'); related.innerHTML='';
  (products.filter(p=>p.id!==product.id && p.category===product.category).slice(0,6)).forEach(rb=>{
    const a = document.createElement('a'); a.href = 'book.html?id='+rb.id; a.className='related-item';
    a.innerHTML = `<img src="${rb.img}" alt="${rb.title}"><h4>${rb.title}</h4><div style="color:var(--muted);font-size:13px">${rb.author||''}</div>`;
    related.appendChild(a);
  });

  const imgs = Array.isArray(product.images) && product.images.length ? product.images : [product.img];
  const main = document.getElementById('mainImage');
  const thumbs = document.getElementById('thumbnails');
  let idx = 0;

  function show(i){
    idx = (i + imgs.length) % imgs.length;
    main.src = imgs[idx];
    Array.from(thumbs.querySelectorAll('img')).forEach((el,j)=> el.classList.toggle('active', j===idx));
  }

  thumbs.innerHTML = '';
  imgs.forEach((s,i)=>{
    const im = document.createElement('img'); im.src = s; im.alt = product.title + ' ' + (i+1);
    im.addEventListener('click', ()=> show(i));
    thumbs.appendChild(im);
  });

  document.getElementById('prev').addEventListener('click', ()=> show(idx-1));
  document.getElementById('next').addEventListener('click', ()=> show(idx+1));
  document.addEventListener('keydown', e=>{ if(e.key==='ArrowLeft') show(idx-1); if(e.key==='ArrowRight') show(idx+1); });

  show(0);
});

 const image = document.getElementById('mainImage');

        const lens = document.getElementById('lens');

 

        image.addEventListener('mousemove', moveLens);

        image.addEventListener('mouseenter', () => lens.style.display = "block");

        image.addEventListener('mouseleave', () => lens.style.display = "none");

 

        function moveLens(e) {

            const rect = image.getBoundingClientRect();

           

            // Calcula a posição do cursor relativa à imagem

            let x = e.pageX - rect.left - window.pageXOffset;

            let y = e.pageY - rect.top - window.pageYOffset;

 

            // Define a imagem de fundo da lente

            lens.style.backgroundImage = `url('${image.src}')`;

           

            // Configura o tamanho do zoom (ex: 3x o tamanho original)

            const zoomLevel = 3;

            lens.style.backgroundSize = (image.width * zoomLevel) + "px " + (image.height * zoomLevel) + "px";

 

            // Posiciona a lente centrada no cursor

            let posX = x - (lens.offsetWidth / 2);

            let posY = y - (lens.offsetHeight / 2);

 

            lens.style.left = posX + "px";

            lens.style.top = posY + "px";

 

            // Move o "fundo" da lente para criar o efeito de zoom no lugar certo

            lens.style.backgroundPosition = `-${(x * zoomLevel) - (lens.offsetWidth / 2)}px -${(y * zoomLevel) - (lens.offsetHeight / 2)}px`;

        }