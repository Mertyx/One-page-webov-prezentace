const playersGrid = document.getElementById('playersGrid');
const filter = document.getElementById('filter');
let players = [];

function makeCard(p) {
    const div = document.createElement('div');
    div.className = 'p-3 bg-white rounded card-shadow';
    div.innerHTML = `
    <div class="flex flex-col h-full">
        <img src="${p.photo}" alt="${p.name}" style="height:140px;object-fit:cover;border-radius:8px;"/>
        <h4 class="mt-2 font-semibold">${p.name} <span class="text-xs text-gray-500">(${p.position})</span></h4>
        <p class="text-sm text-gray-600">Věk: ${p.age}</p>
        <div class="mt-auto pt-2">
            <button class="openBtn px-3 py-1 rounded bg-blue-500 text-white" data-id="${p.id}">Detaily</button>
        </div>
    </div>
    `;
    return div;
}

function renderGrid(list) {
    playersGrid.innerHTML = '';
    if (list.length === 0) {
        playersGrid.innerHTML = '<p class="text-gray-500">Žádní hráči pro vybraný filtr.</p>';
        return
    }
    list.forEach(p => playersGrid.appendChild(makeCard(p)));

    document.querySelectorAll('.openBtn').forEach(b => b.addEventListener('click', ev => {
        const id = ev.target.dataset.id;
        const found = players.find(x => x.id == id);
        openModal(found);
    }));
}

function openModal(p) {
    const m = document.getElementById('modal');
    const content = document.getElementById('modalContent');
    content.innerHTML = `
    <h3 class="text-xl font-bold">${p.name}</h3>
    <p class="text-sm text-gray-600">Pozice: ${p.position}</p>
    <p class="mt-2">${p.description}</p>
    <img src="${p.photo}" alt="${p.name}" style="width:100%;margin-top:8px;border-radius:8px;"/>
    `;
    m.classList.remove('hidden');
    m.style.display = 'flex';
}

document.getElementById('modalClose').addEventListener('click', () => {
    const m = document.getElementById('modal');
    m.classList.add('hidden');
    m.style.display = 'none';
});

if (filter) {
    filter.addEventListener('change', () => {
        const v = filter.value;
        if (v === 'all') renderGrid(players);
        else renderGrid(players.filter(p => p.positionKey === v));
    });
}

function loadPlayers() {
    fetch('data/players.json')
        .then(response => {
            if (!response.ok) throw new Error("Chyba sítě");
            return response.json();
        })
        .then(data => {
            players = data;
            renderGrid(players);
        })
        .catch(err => {
            console.error("Chyba při načítání JSON:", err);
            playersGrid.innerHTML = '<p class="text-red-500">Chyba při načítání dat.</p>';
        });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const f = new FormData(this);
        const msg = document.getElementById('formMsg');
        msg.textContent = 'Odesílám...';

        fetch('send.php', {
            method: 'POST',
            body: f
        })
            .then(r => r.json())
            .then(json => {
                if (json.success) {
                    msg.textContent = 'Díky! Zpráva odeslána.';
                    this.reset();
                } else {
                    msg.textContent = 'Chyba při odesílání: ' + (json.error || 'neznámá');
                }
            })
            .catch(err => {
                msg.textContent = 'Nepodařilo se spojit se serverem.';
                console.error(err);
            });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    })
});

loadPlayers();
