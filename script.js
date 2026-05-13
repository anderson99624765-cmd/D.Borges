document.addEventListener('DOMContentLoaded', () => {
    let totalItens = 0;
    let precoTotalProdutos = 0.0;
    let taxaEntregaAtual = 0.0;
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
        precoTotalProdutos = 0;
        for (const item in carrinho) {
            totalItens += carrinho[item].qtd;
            precoTotalProdutos += carrinho[item].qtd * carrinho[item].preco;
        }
        const totalItensElement = document.getElementById('total-itens');
        if (totalItensElement) totalItensElement.innerText = totalItens;
        atualizarTotalGeral();
    }

    window.calcularFrete = () => {
        const seletor = document.getElementById('bairro');
        if (!seletor || seletor.value === "") return;

        taxaEntregaAtual = parseFloat(seletor.value);
        const bairroNome = seletor.options[seletor.selectedIndex].text;
        const divTaxa = document.getElementById('exibicao-taxa');
        const textoTaxa = document.getElementById('texto-taxa');

        if (divTaxa) divTaxa.style.display = 'block';

        if (taxaEntregaAtual === 0) {
            if (textoTaxa) {
                textoTaxa.innerHTML = `<strong>✅ Entrega Grátis</strong> para ${bairroNome}`;
                textoTaxa.style.color = "#27ae60";
            }
        } else {
            if (textoTaxa) {
                textoTaxa.innerHTML = `<strong>🛵 Taxa: R$ ${taxaEntregaAtual.toFixed(2).replace('.', ',')}</strong> (${bairroNome})`;
                textoTaxa.style.color = "#e67e22";
            }
        }
        atualizarTotalGeral();
    };

    const campoBairro = document.getElementById('bairro');
    if (campoBairro) {
        campoBairro.addEventListener('change', function() {
            const nomeDoBairro = this.options[this.selectedIndex].text;
            if (nomeDoBairro.trim().toLowerCase() !== "novo oeste" && precoTotalProdutos < 18.00 && this.value !== "") {
                alert("Atenção: Para entregas no bairro " + nomeDoBairro + ", o valor mínimo é R$ 18,00.");
                this.value = "";
                if (document.getElementById('exibicao-taxa')) document.getElementById('exibicao-taxa').style.display = 'none';
                taxaEntregaAtual = 0;
                atualizarTotalGeral();
            }
        });
    }

    function atualizarTotalGeral() {
        const totalFinal = precoTotalProdutos + taxaEntregaAtual;
        const display = document.getElementById('preco-total');
        if (display) display.innerText = totalFinal.toFixed(2).replace('.', ',');
    }

    window.enviarPedido = () => {
        if (totalItens === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const divDados = document.getElementById('dados-entrega');
        const botao = document.getElementById('btn-finalizar');

        if (!divDados.classList.contains('ativo')) {
            divDados.classList.add('ativo');
            botao.innerText = "Confirmar e Enviar Pedido";
            botao.style.backgroundColor = "#25D366";
            document.getElementById('btn-voltar').style.display = "block";
            return; 
        }

        const seletorBairro = document.getElementById('bairro');
        if (!seletorBairro || seletorBairro.value === "") {
            alert("Selecione um bairro!");
            return;
        }

        const nome = document.getElementById('nome-cliente').value.trim();
        const rua = document.getElementById('endereco-cliente').value.trim();
        const numero = document.getElementById('numero-casa').value.trim();
        const pagamento = document.getElementById('pagamento').value;
        const bairroNome = seletorBairro.options[seletorBairro.selectedIndex].text;

        if (!nome || !rua || !numero) {
            alert("Preencha todos os dados de entrega!");
            return;
        }

        let mensagem = `*Novo Pedido - D'Borges Salgados*\n━━━━━━━━━━━━━━━━━━━━\n`;
        mensagem += `👤 *Cliente:* ${nome}\n📍 *Endereço:* ${rua}, Nº ${numero}\n🏘️ *Bairro:* ${bairroNome}\n💳 *Pagamento:* ${pagamento}\n━━━━━━━━━━━━━━━━━━━━\n\n`;

        for (const item in carrinho) {
            mensagem += `✅ ${carrinho[item].qtd}x ${item}\n`;
        }
        
        mensagem += taxaEntregaAtual > 0 ? `\n🛵 *Frete:* R$ ${taxaEntregaAtual.toFixed(2).replace('.', ',')}` : `\n🛵 *Frete:* Grátis`;
        mensagem += `\n*TOTAL FINAL: R$ ${(precoTotalProdutos + taxaEntregaAtual).toFixed(2).replace('.', ',')}*`;

        window.open(`https://wa.me/557498105859?text=${encodeURIComponent(mensagem)}`, '_blank');
    };

    window.fecharDadosEntrega = () => {
        document.getElementById('dados-entrega').classList.remove('ativo');
        const btn = document.getElementById('btn-finalizar');
        btn.innerText = "Finalizar via WhatsApp";
        btn.style.backgroundColor = "";
        document.getElementById('btn-voltar').style.display = "none";
    };
});

function monitorarStatusLoja() {
    if (typeof firebase === 'undefined') return;
    firebase.database().ref('configuracoes/statusLoja').on('value', (snapshot) => {
        const estaAberta = snapshot.val();
        const overlay = document.getElementById('overlay-fechado');
        if (!overlay) return;
        if (estaAberta) {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        }
    });
}
monitorarStatusLoja();

const SENHA_CORRETA = "1234";
document.addEventListener('keydown', (event) => {
    if (event.altKey && (event.key === 'a' || event.key === 'A')) {
        const modal = document.getElementById('modal-admin');
        if (modal) {
            modal.style.display = 'block';
            modal.style.pointerEvents = 'auto';
        }
    }
});

window.verificarSenha = function() {
    const campoSenha = document.getElementById('senha-admin');
    if (campoSenha.value === SENHA_CORRETA) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-controles').style.display = 'block';
    } else {
        alert("Senha incorreta!");
    }
};

window.alternarLoja = function(status) {
    if (typeof firebase !== 'undefined') {
        firebase.database().ref('configuracoes/statusLoja').set(status)
            .then(() => {
                alert(status ? "Loja Aberta! ✅" : "Loja Fechada! 🔒");
                document.getElementById('modal-admin').style.display = 'none';
                document.getElementById('admin-login').style.display = 'block';
                document.getElementById('admin-controles').style.display = 'none';
                document.getElementById('senha-admin').value = "";
            });
    }
};