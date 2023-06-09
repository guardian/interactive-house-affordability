const isMobile = window.matchMedia('(max-width: 600px)').matches;

if(isMobile){
    let times = document.querySelectorAll('#gv-color-key-table__house-price')

    times.forEach(d => {

        let txt = d.innerHTML.replace(' times', 'x')
        d.innerHTML = txt
    })
}