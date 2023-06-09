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

        this.input.addEventListener("keyup",  (event) => {
            if(event.key === 'Enter'){
                let match = config.data.find(f=> f.code.toLowerCase() === config.input.value.toLowerCase())
                if(match){
                    config.callback({type:'search', value:match.code})
                    this.disable()
                }
            }
        })
        
    }

    autoCompleteJs() {

        this.autoComplete = new autoComplete({
            selector: this.selector,
            placeHolder: this.placeHolder,
            data: {
                src: this.data,
                keys: this.keys,
                filter: (list) => {
                    const results = list.filter((item) => {

                        
                        const inputValue = this.autoComplete.input.value.toLowerCase();
                        const itemValue = item.value.code.toLowerCase();
                
                        if (itemValue.startsWith(inputValue)) {
                            return item.value;
                        }
                    });
                
                    return results;
                }
            },
            resultItem: {
                highlight: true,
            },
            resultsList: {
                tag: "ul",
                position: "afterend",
                tabSelect:true,
                element: (list, data) => {

                    if (!data.results.length) {
                        if(this.errorMessage)this.errorMessage.innerHTML = 'Only enter the first part of postcode (e.g. N1)'
                        if(this.callback)this.callback({type:'search', value:null})
                    }
                    else{
                        if(this.errorMessage)this.errorMessage.innerHTML = ''
                    }
                },
                noResults: true,
                maxResults:5
            },
            resultItem: {
                element: (item, data) => {
                    this.callback({type:'search', value:data})
                },
                highlight: {
                    render: true
                }
            },
            searchEngine: "strict",
            diacritics: true,
            highlight: {
                render: true
            },
            resultItem: {highlight:true}
        });

        this.autoComplete.input.addEventListener("selection", (event) => {

            this.input.value = event.detail.selection.value.code

            this.search = {type:'search', value:this.input.value};
            
            if(this.callback)this.callback(this.search)

            this.enableResetBtn()

        })

    }

    disableResetBtn(){
        this.resetBtn.classList.remove('enabled')
    }

    enableResetBtn(){
        this.resetBtn.classList.add('enabled')
    }

    getSearch(){
        return this.search
    }

    reset(){
        console.log('search reset')
        this.search = null
        this.input.value = ''
        this.disableResetBtn()
        this.callback()
        this.autoComplete.data.src = this.data;
        
    }

    restart(){
        this.autoComplete.data.src = this.data;
    }

    clean(){
        this.input.value = ''
    }

    disable(){
        this.autoComplete.close();
    }
}

export default Search