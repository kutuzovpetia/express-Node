const priceAll = document.querySelectorAll('.price');

//Табы
var tabs = M.Tabs.init(document.querySelectorAll('.tabs'));

// Боковое меню
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {edge: 'right'});
});

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
        }
    ).format(new Date(date))
}

document.querySelectorAll('.date').forEach(d => {
    d.textContent = toDate(d.textContent);
    toDate(d.textContent);
})

const toCurrency = price =>{
    return new Intl.NumberFormat('ua-Ua', {
        currency: 'UAH',
        style: 'currency'
    }).format(price);
}

priceAll.forEach(item=>{
    item.textContent = toCurrency(item.textContent)
});

const $card = document.getElementById('card');
if($card){
    $card.addEventListener('click', (e)=>{
        if(e.target.classList.contains('js-remove')){
            const id = e.target.dataset.id;
            const csrf = e.target.dataset.csrf;
            fetch('/card/remove/' + id, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
                .then(res => res.json())
                .then(card=>{
                    if(card.courses.length){
                        const html = card.courses.map(c=>{
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>${c.price}</td>
                                <td>
                                <button 
                                class="btn btn-primary js-remove" 
                                data-id="${c.id}"
                                data-csrf="${csrf}"
                                >Удалить</button>
                                </td>
                            </tr>
                        `
                        }).join('')
                        document.querySelector('tbody').innerHTML = html;
                        document.querySelector('.price').textContent = toCurrency(card.price);
                    }else{
                        $card.innerHTML = '<h2>Корзина пуста</h2>';
                    }
                })
        }
    })
}
