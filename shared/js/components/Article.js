class Article{

    constructor(config){

        this.header = config.article.querySelector('#gv-article-header')
        this.paragraph = config.article.querySelector('#gv-article-paragraph')
        this.colorScale = config.colorScale || null
    }

    setData(data){
        this.header.innerHTML = data.header
        this.paragraph.innerHTML = data.paragraph
    }
}

export default Article


