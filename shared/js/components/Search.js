import autoComplete from "@tarekraafat/autocomplete.js"

class Search{

    constructor(config) {
        this.selector = config.selector;
        this.input = config.input;
        this.data = config.data;
        this.keys = config.keys;
        this.placeHolder = config.placeHolder;
        this.callback = config.callback;
        this.errorMessage = config.errorMessage;
        this.search = null;

        this.autoComplete;
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
                        this.errorMessage.innerHTML = 'No results'
                        this.callback({type:'search', value:null})
                    }
                    else{
                        this.errorMessage.innerHTML = ''
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

        this.autoComplete.input.addEventListener("selection", (event) => {

            this.input.value = event.detail.selection.value.areaCode

            this.search = {type:'search', value:event};
            
            this.callback(this.search)

        })

        // const action = (action) => {
        //     const title = document.querySelector("h1");
        //     const mode = document.querySelector(".mode");
        //     const selection = document.querySelector(".selection");
        //     const footer = document.querySelector(".footer");
          
        //     if (action === "dim") {
        //       title.style.opacity = 1;
        //       mode.style.opacity = 1;
        //       selection.style.opacity = 1;
        //     } else {
        //       title.style.opacity = 0.3;
        //       mode.style.opacity = 0.2;
        //       selection.style.opacity = 0.1;
        //     }
        //   };

        // Blur/unBlur page elements on input focus
        // ["focus", "blur"].forEach((eventType) => {
        //     this.autoComplete.input.addEventListener(eventType, () => {
        //     // Blur page elements
        //     if (eventType === "blur") {
        //         action("dim");
        //     } else if (eventType === "focus") {
        //         // unBlur page elements
        //         action("light");
        //     }
        //     });
        // });
    }

    getSearch(){
        return this.search
    }
}

export default Search