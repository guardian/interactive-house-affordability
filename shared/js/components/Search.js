import autoComplete from "@tarekraafat/autocomplete.js"

class Search{

    constructor(config) {
        this.selector = config.selector;
        this.placeHolder = config.placeHolder;
        this.data = config.data;
        this.errorMessage = config.errorMessage;
        this.input = config.input;
        this.keys = config.keys;
        this.resetBtn = config.resetBtn;
        this.callback = config.callback || null;
        this.search = null;
        this.autoComplete = null;

        this.autoCompleteJs()
        
        this.resetBtn.addEventListener('click',() => this.reset())
        
    }

    autoCompleteJs() {



        this.autoComplete = new autoComplete({
            selector: this.selector,
            placeHolder: this.placeHolder,
            data: {
                src: this.data,
                keys: this.keys
            },
            resultItem: {
                highlight: true,
            },
            resultsList: {
                element: (list, data) => {
                    if (!data.results.length) {
       
                        if(this.errorMessage)this.errorMessage.innerHTML = 'No results'
                        if(this.callback)this.callback({type:'search', value:null})
                        this.hideResetBtn()
                    }
                    else{
                        if(this.errorMessage)this.errorMessage.innerHTML = ''
                    }
                },
                noResults: true,
                maxResults: 10
            },
            resultItem: {
                element: (item, data) => {
                    //this.callback({type:'search', value:data})
                },
                highlight: {
                    render: true
                }
            },
            searchEngine: "strict",
            diacritics: true,
            highlight: {
                render: true,
            }
        });

        this.autoComplete.input.addEventListener('input', (event) => {
            
            this.search = {type:'search', value:null};

            if(this.callback)this.callback(this.search)

            this.hideResetBtn()
        })

        this.autoComplete.input.addEventListener("selection", (event) => {

            this.input.value = event.detail.selection.value.areaCode

            this.search = {type:'search', value:event};
            
            if(this.callback)this.callback(this.search)

            this.showResetBtn()

        })

    }

    hideResetBtn(){
        this.resetBtn.style.visibility = 'hidden'
    }

    showResetBtn(){
        this.resetBtn.style.visibility = 'visible'
    }

    getSearch(){
        return this.search
    }

    reset(){
        this.search = null
        this.input.value = ''
        this.hideResetBtn()
        this.callback()
    }

    disable(){
        this.input.disabled = true;
    }
}

export default Search