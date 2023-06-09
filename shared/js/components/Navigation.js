
class Navigation{
    constructor(config){

        this.steps = config.steps;
        this.next = config.next;
        this.prev = config.prev;
        this.callback = config.callback || null;

        this.hideBtn = config.hide;
        this.panel = config.panel;

        this.index = 0;

        this.next.addEventListener('click', () => this.prevNext(1))
        this.prev.addEventListener('click', () => this.prevNext(-1))
        this.hideBtn.addEventListener('click', () => this.hidePanel())

        this.cont = 0;

        this.hide(this.prev)

    }

    prevNext(direction){

        this.index += direction;

        if(this.index >= this.steps-1){
            this.index = this.steps-1;
            this.hide(this.next)
        }
        else if(this.index <= 0){

            this.index = 0;
            this.hide(this.prev)
        }
        else{
            this.show(this.prev)
            this.show(this.next)
        }

        this.callback(this.index)

    }

    reset(){
        this.index = 0;
        this.prevNext(0)
    }

    enable(button){
        button.disabled = false
    }

    disable(button){
        button.disabled = true
    }

    name(button,string){
        button.innerHTML = string;
    }

    hide(button){
        button.style.display = 'none'
    }

    show(button){
        button.style.display = 'block'
    }

    setStep(index){
        this.index = index;
    }

    getStep(){
        return this.index
    }

    hidePanel(){

        if(this.cont == 0){

            console.log('hide 0')
            this.panel.style.transform = `translateY(${this.panel.getBoundingClientRect().height}px)`;
            this.panel.querySelector('svg').style.transform = `rotate(180deg)`;
            this.hideBtn.querySelector('.gv-hide-panel__text').innerHTML = 'Show'
            this.cont ++
        }
        else{
            console.log('hide 1')
            this.panel.style.transform = `translateY(${0}px)`;
            this.panel.querySelector('svg').style.transform = `rotate(0)`;
            this.hideBtn.querySelector('.gv-hide-panel__text').innerHTML = 'Hide'
            this.cont = 0;
        }
    }

    showPanel(){
        this.cont = 1;
        this.hidePanel()
    }

    setCont(cont){
        this.cont = cont
    }
}

export default Navigation