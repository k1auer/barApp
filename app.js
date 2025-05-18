
    let total = 0;
    let items = {};

    function updateTotal() {
        document.getElementById('total').textContent = `Gesamt: ${total.toFixed(2)} €`;
    }

    function addItem(name, price, color) {
        total += price;
        if (!items[name]) {
            items[name] = {count: 1, price: price, color: color};
        } else {
            items[name].count++;
        }
        renderItems();
        updateTotal();
    }

    function resetAll() {
        total = 0;
        items = {};
        updateTotal();
        renderItems();

        renderReceipt();
    }

    function renderItems() {
        const container = document.getElementById('items');
        container.innerHTML = '';
        for (let name in items) {
            const item = items[name];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.style.backgroundColor = item.color;
            itemDiv.textContent = name;

            itemDiv.addEventListener('click', () => {
                total -= item.price;
                if (total < 0) total = 0;

                item.count--;
                if (item.count <= 0) {
                    delete items[name];
                }
                renderItems();
                updateTotal();
            });

            if (item.count > 1) {
                const countDiv = document.createElement('div');
                countDiv.className = 'count';
                countDiv.textContent = item.count;
                itemDiv.appendChild(countDiv);
            }

            container.appendChild(itemDiv);
        }
        renderReceipt();
    }

    function renderReceipt() {
        const receiptDiv = document.getElementById('receipt-content');
        receiptDiv.innerHTML = '';

        if (Object.keys(items).length === 0) {
            receiptDiv.innerHTML = '<em>Keine Artikel ausgewählt.</em>';
            return;
        }

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        let totalSum = 0;

        for (let name in items) {
            const item = items[name];
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = `${item.count} x ${name}`;
            nameCell.style.padding = '4px';

            const priceCell = document.createElement('td');
            priceCell.textContent = `${item.price.toFixed(2)} €`;
            priceCell.style.padding = '4px';
            priceCell.style.textAlign = 'right';

            const totalCell = document.createElement('td');
            const itemTotal = item.count * item.price;
            totalCell.textContent = `${itemTotal.toFixed(2)} €`;
            totalCell.style.padding = '4px';
            totalCell.style.textAlign = 'right';

            totalSum += itemTotal;

            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(totalCell);
            table.appendChild(row);
        }

        // Summenzeile hinzufügen
        const sumRow = document.createElement('tr');
        sumRow.style.fontWeight = 'bold';
        sumRow.style.borderTop = '1px solid #aaa';

        const sumLabelCell = document.createElement('td');
        sumLabelCell.textContent = 'Gesamt';
        sumLabelCell.style.padding = '6px';

        const emptyCell = document.createElement('td');
        emptyCell.textContent = '';
        emptyCell.style.padding = '6px';

        const sumValueCell = document.createElement('td');
        sumValueCell.textContent = `${totalSum.toFixed(2)} €`;
        sumValueCell.style.padding = '6px';
        sumValueCell.style.textAlign = 'right';

        sumRow.appendChild(sumLabelCell);
        sumRow.appendChild(emptyCell);
        sumRow.appendChild(sumValueCell);

        table.appendChild(sumRow);
        receiptDiv.appendChild(table);
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => console.log('Service Worker registriert:', reg.scope))
                .catch(err => console.error('Service Worker Fehler:', err));
        });
    }