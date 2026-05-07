document.addEventListener('DOMContentLoaded', () => {
    // --- VARIÁVEIS GLOBAIS DO SISTEMA ---
    let totalItens = 0;
    let precoTotal = 0.0;
    const carrinho = {}; 

    window.alterarQtd = (botao, mudanca) => {
        const itemElement = botao.closest('.item-salgado');
        const nome = itemElement.getAttribute('data-nome');
        const preco = parseFloat(itemElement.getAttribute('data-preco'));
        const qtdElement = itemElement.querySelector('.qtd-numero');
        
        let qtdAtual = parseInt(qtdElement.innerText);
        qtdAtual += mudanca;

        if (qtdAtual >= 0) {
            qtdElement.innerText = qtdAtual;
            
            if (qtdAtual > 0) {
                carrinho[nome] = { qtd: qtdAtual, preco: preco };
            } else {
                delete carrinho[nome];
            }
            atualizarResumo();
        }
    };

    function atualizarResumo() {
        totalItens = 0;
        precoTotal = 0;

        for (const item in carrinho) {
            totalItens += carrinho[item].qtd;
            precoTotal += carrinho[item].qtd * carrinho[item].preco;
        }

        document.getElementById('total-itens').innerText = totalItens;
        document.getElementById('preco-total').innerText = precoTotal.toFixed(2).replace('.', ',');
    }

    window.enviarPedido = () => {

    const divDados = document.getElementById('dados-entrega');
    const botao = document.getElementById('btn-finalizar');

    if (!divDados.classList.contains('ativo')) {
        divDados.classList.add('ativo');
        botao.innerText = "Confirmar e Enviar Pedido";
        botao.style.backgroundColor = "#25D366";
        return;
    }
    const nome = document.getElementById('nome-cliente').value.trim();
    const rua = document.getElementById('endereco-cliente').value.trim();
    const numero = document.getElementById('numero-casa').value.trim();
    const bairro = document.getElementById('bairro-cliente').value.trim();
    const referencia = document.getElementById('ponto-referencia').value.trim();
    const pagamento = document.getElementById('pagamento').value;

    if (!nome || !rua || !numero || !bairro) {
        alert("Por favor, preencha nome, rua, número e bairro!");
        return;
    }
    let mensagem = `*Novo Pedido - D'Borges Salgados*\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `👤 *Cliente:* ${nome}\n`;
    mensagem += `📍 *Endereço:* ${rua}, Nº ${numero}\n`; // ADICIONADO NÚMERO
    mensagem += `🏘️ *Bairro:* ${bairro}\n`;
    if(referencia) mensagem += `🔍 *Ref:* ${referencia}\n`;
    mensagem += `💳 *Pagamento:* ${pagamento}\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (const item in carrinho) {
        mensagem += `✅ ${carrinho[item].qtd}x ${item}\n`;
    }
    mensagem += `\n*TOTAL: R$ ${precoTotal.toFixed(2)}*`;

    const fone = "5574999624765"; 
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(mensagem)}`, '_blank');
};
    const secoes = document.querySelectorAll('.secao-categoria');
    const linksMenu = document.querySelectorAll('.menu-categorias a');

    linksMenu.forEach(link => {
        link.addEventListener('click', function() {
            linksMenu.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            this.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const linkAtivo = document.querySelector(`.menu-categorias a[href="#${id}"]`);
                if (linkAtivo) {
                    linksMenu.forEach(l => l.classList.remove('active'));
                    linkAtivo.classList.add('active');
                }
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    secoes.forEach(secao => observer.observe(secao));
});