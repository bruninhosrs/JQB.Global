

// Para desabilitar o botão de acordo com os campos obrigatórios
function validateForm() {
    const name = document.querySelector("#name").value.trim();
    const price = document.querySelector("#price").value;
    const stock = document.querySelector("#stock").value;
    const btnSubmit = document.querySelector("#btnSubmit");

    if (name && price && stock) {
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = "1";
        btnSubmit.style.cursor = "pointer";
    } else {
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = "0.5";
        btnSubmit.style.cursor = "not-allowed";
    }
}

document.querySelector("#name").addEventListener("input", validateForm);
document.querySelector("#price").addEventListener("input", validateForm);
document.querySelector("#stock").addEventListener("input", validateForm);

document.addEventListener("DOMContentLoaded", () => {
    validateForm();
});

document.querySelector("#productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const product = {
        name: document.querySelector("#name").value,
        price: Number(document.querySelector("#price").value),
        stock: Number(document.querySelector("#stock").value),
        description: document.querySelector("#description").value
    };

    function showMessage(message, type) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.padding = "15px";
        messageDiv.style.marginTop = "15px";
        messageDiv.style.textAlign = "center";
        messageDiv.style.fontSize = "14px";

        if (type === "success") {
            messageDiv.style.color = "#155724";
        } else {
            messageDiv.style.color = "#721c24";
        }

        const form = document.querySelector("#productForm");

        const existingMessage = form.nextElementSibling;
        if (existingMessage && existingMessage.tagName === "DIV") {
            existingMessage.remove();
        }

        form.after(messageDiv);
        setTimeout(() => messageDiv.remove(), 5000);
    }

    try {
        const request = await fetch("http://localhost:3000/product/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        if (request.ok) {
            showMessage("Produto cadastrado com sucesso!", "success");
            document.querySelector("#productForm").reset();
            validateForm();
        } else {
            showMessage("Erro ao cadastrar produto", "error"); // o HTML ja limita os dados inseridos nos campos, então não vi necessidade de uma mensagem de erro personalizada com base no retorno do back, visto que não vão ser disparadas - jordan
        }
    } catch (error) {
        showMessage("Erro de conexão com o servidor", "error");
    }
});
