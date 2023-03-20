import autoComplete from "@tarekraafat/autocomplete.js"

class Search{

    constructor(config) {
        this.selector = config.selector;
        this.data = config.data;
        this.key = config.key;
        this.placeHolder = config.placeHolder;
        this.callback = config.callback;

        this.autoComplete;
    }

    autoCompleteJs() {

        this.autoComplete = new autoComplete({
            selector: this.selector,
            placeHolder: this.placeHolder,
            data: {
                src: this.data,
                keys: ["area", "code"]
            },
            resultItem: {
                highlight: true,
            },
            resultsList: {
                element: (list, data) => {
                    if (!data.results.length) {
                        // Create "No Results" message list element
                        const message = document.createElement("div");
                        message.setAttribute("class", "no_result");
                        // Add message text content
                        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                        // Add message list element to the list
                        list.appendChild(message);
                    }
                },
                noResults: true,
            },
            resultItem: {
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
            
            this.callback(event)

        })

        

    }




}

export default Search