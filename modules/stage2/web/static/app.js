const form = document.getElementById('screamform')


window.addEventListener('load', e => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)

    if(urlParams.get('scream')){
        let div = document.createElement('div');
        div.id = 'message'
        div.innerHTML = urlParams.get('scream')
        form.remove()
        document.body.appendChild(div)

        setTimeout(() => {
            if (!div.classList.contains('heard')){
                div.innerHTML = "Nobody heard you"
            }
        }, 2000)

    }
})