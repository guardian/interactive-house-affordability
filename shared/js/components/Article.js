class Article{

    constructor(config){
        this.header = config.header
        this.paragraph = config.paragraph
    }

    setData(data){
        this.header.innerHTML = data.header
        this.paragraph.innerHTML = data.paragraph
    }
}

export default Article