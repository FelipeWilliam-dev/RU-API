document.addEventListener('DOMContentLoaded', () => {
    initLikesChart();
    setupEventListeners();
});

async function initLikesChart() {
    const ctx = document.getElementById('likesChart');
    if (!ctx) return;

    try {
        const response = await fetch('/api/chart-data');
        const chartData = await response.json();

        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Número de Curtidas',
                    data: chartData.data,
                    backgroundColor: 'rgba(0, 74, 145, 0.7)',
                    borderColor: 'rgba(0, 74, 145, 1)',
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

    } catch (error) {
        console.error('Erro ao inicializar o gráfico:', error);
    }
}

function setupEventListeners() {
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const commentForm = document.getElementById('comment-form');

    if (likeBtn) {
        likeBtn.addEventListener('click', async (e) => {
            const pratoId = e.currentTarget.dataset.id;
            const response = await fetch(`/api/like/${pratoId}`, { method: 'POST' });
            const result = await response.json();
            if (result.success) {
                document.getElementById('like-count').innerText = result.novasCurtidas;
            }
        });
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', async (e) => {
            const pratoId = e.currentTarget.dataset.id;
            const response = await fetch(`/api/dislike/${pratoId}`, { method: 'POST' });
            const result = await response.json();
            if (result.success) {
                document.getElementById('dislike-count').innerText = result.novasNaoCurtidas;
            }
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pratoId = e.target.pratoId.value;
            const comentario = e.target.comentario.value;
            if (!comentario.trim()) return;

            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pratoId, comentario })
            });
            const result = await response.json();
            if (result.success) {
                addCommentToDOM(result.novoComentario);
                e.target.comentario.value = '';
            }
        });
    }
}

function addCommentToDOM(comentario) {
    const commentList = document.getElementById('comment-list');
    const commentItem = document.createElement('div');
    commentItem.className = 'comentario-item';
    commentItem.innerHTML = `<strong>${comentario.usuario}:</strong><p>${comentario.texto}</p>`;
    commentList.insertBefore(commentItem, commentList.children[1]);
}