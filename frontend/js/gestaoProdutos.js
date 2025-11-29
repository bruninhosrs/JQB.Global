const API_URL = 'http://localhost:3000/product';

window.onload = fetchProdutos;

// Para remover a mensagem de erro de quando o valor esta fora do limite
function removeErrorMessage(row) {
    const existingTooltip = row.querySelector('.error-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// Exibe a tabela
async function fetchProdutos() {
    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();
        
        const tbody = document.getElementById('listaProdutos');
        tbody.innerHTML = '';

        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.dataset.id = produto._id;
            
            const nome = produto.name || 'Sem nome';
            const preco = produto.price ? parseFloat(produto.price).toFixed(2).replace('.', ',') : '0,00';
            
            tr.innerHTML = `
                <td>${nome}</td>
                <td>${produto.description || '-'}</td>
                <td>R$ ${preco}</td>
                <td class="stock-cell">${produto.stock}</td>
                <td>
                    <button class="btn-editar">Editar</button>
                </td>
            `;
            
            const btn = tr.querySelector('.btn-editar');
            btn.addEventListener('click', () => toggleEdicao(btn, produto));

            tbody.appendChild(tr);
        });

        document.getElementById('loading').style.display = 'none';
        document.getElementById('tabelaProdutos').style.display = 'table';
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        document.getElementById('loading').innerText = 'Erro ao carregar produtos.';
    }
}

async function toggleEdicao(btn, produto) {
    const row = btn.closest('tr');
    const stockCell = row.querySelector('.stock-cell');
    const isSaving = btn.classList.contains('btn-salvar');

    removeErrorMessage(row);

    // Modo de edição
    if (!isSaving) {

        const tbody = row.parentNode;
        tbody.classList.add('editing-active');

        // Foca a linha em edição
        row.classList.add('row-editing');

        const currentStock = stockCell.innerText;
        row.dataset.originalStock = currentStock; // Store original value
        stockCell.innerHTML = `
            <div class="input-wrapper" style="display: flex; align-items: center;">
                <input type="number" class="input-estoque-edit" value="${currentStock}" required min="0" max="99999">
            </div>
        `;

        const input = stockCell.querySelector('.input-estoque-edit');
        input.focus();

        //Enter salva e esc cancela e retorna ao valor anterior
        input.addEventListener('keydown', (event) => {

            if (event.key === 'Enter') {
                event.preventDefault();
                btn.click();
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                removeErrorMessage(row);

                stockCell.innerHTML = row.dataset.originalStock;
                produto.stock = parseInt(row.dataset.originalStock);

                btn.textContent = 'Editar';
                btn.classList.remove('btn-salvar');
                btn.classList.add('btn-editar');

                row.classList.remove('row-editing');
                const tbody = row.parentNode;
                tbody.classList.remove('editing-active');
            }
        });

        // Altera o botao de editar para salvar
        btn.textContent = 'Salvar';
        btn.classList.remove('btn-editar');
        btn.classList.add('btn-salvar');

    } else {
        const input = stockCell.querySelector('.input-estoque-edit');
        const inputWrapper = stockCell.querySelector('.input-wrapper');
        const newStock = parseInt(input.value);

        // Feedback do botao em caso de erro
        if (isNaN(newStock) || newStock < 0 || newStock > 99999) {
            btn.classList.add('btn-error');
            setTimeout(() => btn.classList.remove('btn-error'), 400);
            input.focus();
            
            const errorMessage = document.createElement('span');
            errorMessage.classList.add('error-tooltip');
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '0.8em';
            errorMessage.style.marginLeft = '10px';
            errorMessage.style.whiteSpace = 'nowrap';
            errorMessage.innerHTML = 'O valor deve ser entre <br> 0 e 99999.';
            
            inputWrapper.appendChild(errorMessage);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${produto._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stock: newStock })
            });

            if (response.ok) {
                removeErrorMessage(row);
                stockCell.innerHTML = newStock;
                produto.stock = newStock;
                delete row.dataset.originalStock;

                // Reseta o botao ao estado padrao
                btn.textContent = 'Editar';
                btn.classList.remove('btn-salvar');
                btn.classList.add('btn-editar');

                // Desativa o modo de edição e dispara o feedback
                row.classList.remove('row-editing');
                row.classList.add('row-success');
                const tbody = row.parentNode;
                tbody.classList.remove('editing-active');

                setTimeout(() => row.classList.remove('row-success'), 1500);
            }

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao atualizar o estoque no servidor.');
        }
    }
}


