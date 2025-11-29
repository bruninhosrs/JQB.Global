const API_URL = 'http://localhost:3000/product';

window.onload = fetchProdutos;

async function fetchProdutos() {
    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();
        
        const tbody = document.getElementById('listaProdutos');
        tbody.innerHTML = '';

        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.dataset.id = produto._id; // Identificador para feedback
            
            const nome = produto.name || 'Sem nome';
            
            tr.innerHTML = `
                <td>${nome}</td>
                <td>${produto.description || '-'}</td>
                <td>R$ ${produto.price ? parseFloat(produto.price).toFixed(2).replace('.', ',') : '0,00'}</td>
                <td>${produto.stock}</td>
                <td>
                    <button class="btn-editar">Editar</button>
                </td>
            `;
            
            const btnEditar = tr.querySelector('.btn-editar');
            btnEditar.addEventListener('click', () => iniciarEdicao(produto));

            tbody.appendChild(tr);
        });

        document.getElementById('loading').style.display = 'none';
        document.getElementById('tabelaProdutos').style.display = 'table';
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        document.getElementById('loading').innerText = 'Erro ao carregar produtos.';
    }
}

function iniciarEdicao(produto) {
    document.getElementById('editId').value = produto._id;
    document.getElementById('editNome').value = produto.name || '';
    document.getElementById('editDescricao').value = produto.description || '';
    document.getElementById('editPreco').value = produto.price;
    document.getElementById('editEstoque').value = produto.stock;

    document.getElementById('modalOverlay').style.display = 'flex';
}

function cancelarEdicao() {
    document.getElementById('modalOverlay').style.display = 'none';
}

async function salvarEdicao(event) {
    event.preventDefault(); // Impede o reload do form

    const id = document.getElementById('editId').value;
    const nome = document.getElementById('editNome').value;
    const descricao = document.getElementById('editDescricao').value;
    const preco = parseFloat(document.getElementById('editPreco').value);
    const estoque = parseInt(document.getElementById('editEstoque').value);

    if (!id) return;

    const dados = {
        name: nome,
        description: descricao,
        price: preco,
        stock: estoque
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        //Feedback na Própria linha
        if (response.ok) {
            cancelarEdicao();
            await fetchProdutos();

            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.classList.add('row-success');
                setTimeout(() => row.classList.remove('row-success'), 4000);
            }
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        cancelarEdicao();
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.classList.add('row-error');
            setTimeout(() => row.classList.remove('row-error'), 4000);
        }
    }
}

document.getElementById('formEditarProduto').addEventListener('submit', salvarEdicao);
window.cancelarEdicao = cancelarEdicao;

