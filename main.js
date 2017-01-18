(function () {

    'use strict'


    var Allen = {}

    Allen.canvas = document.getElementById('canvas')
    Allen.ctx    = Allen.canvas.getContext('2d')
    Allen.input  = document.getElementById('input')
    Allen.submit = document.getElementById('submit')
    Allen.download = document.getElementById('download')

    Allen.init = function () {
        this.font = {
            color: 'white',
            weight: 900,
            size: 88,
            gap: 10,
            family: '"Noto Sans T Chinese", "Hiragino Sans GB", sans-serif'
        }

        // register event listeners
        this.submit.addEventListener('click', this._onSubmit.bind(this))
        this.canvas.addEventListener('drew',  () => this.download.style.display = 'block')
        this.canvas.addEventListener('reset', () => this.download.style.display = 'none')
        this.download.addEventListener('click', this._onDownload.bind(this))
    }

    Allen._draw = function (text) {
        this._loadImages(['./images/bg.jpg', './images/main.png'])
            .then(this._drawLayer1.bind(this))
            .then(this._drawText.bind(this, text))
            .then(this._drawLayer2.bind(this))
            .then(() => this.canvas.dispatchEvent(this._event('drew')))
    }


    Allen._loadImages = function (imagesURL) {

        let promises = imagesURL.map((imageURL) => {

            return new Promise((resolve, reject) => {
                let image = new Image()
                image.onload = () => resolve(image)
                image.src = imageURL
            })

        })

        return Promise.all(promises)
    }


    Allen._drawLayer1 = function (images) {
        [this.image1, this.image2] = images

        this.canvas.width  = this.image1.width
        this.canvas.height = this.image1.height
        this.ctx.drawImage(this.image1, 0, 0, this.canvas.width, this.canvas.height)
    }

    Allen._drawText = function (text) {
        this.ctx.fillStyle = this.font.color
        this.ctx.font = ([this.font.weight, (this.font.size + 'px'), this.font.family].join(' '))
        text.split('\n').forEach((sentence, index) => {
            sentence.split('').forEach((word, _index) => {
                let x = 143 - (index * this.font.size + (index * this.font.gap))
                let y = 110 + (_index * this.font.size)
                this.ctx.fillText(word, x, y)
            })
        })

    }


    Allen._drawLayer2 = function () {
        this.ctx.drawImage(this.image2, 0, 396)
    }


    Allen._onSubmit = function (event) {

        event.preventDefault()
        this._reset()

        let text = this.input.value
        let sentences = text.split('\n')

        try {
            this._validate(text, (text) => !text, '請輸入文字！！！')
            this._validate(sentences, (sentences) => Math.max.apply(Math, sentences.map((item) => item.length)) > 5, '一行不能超過 5 個字！！！')
            this._validate(sentences, (sentences) => sentences.length > 2, '不能超過 2 行！！！')

            this._draw.call(this, this.input.value)
        } catch(error) {
            alert(error.message);
        }
    }


    Allen._onDownload = function () {
        let link = document.createElement('a')
        link.download = 'allen.jpg'
        link.href = this.canvas.toDataURL('image/jpeg').replace("image/jpeg", "image/octet-stream")
        link.click()
    }


    Allen._validate = function (text, validator, message) {
        if (validator.call(null, text)) {
            throw new TypeError(message)
        }
    }


    Allen._reset = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvas.dispatchEvent(this._event('reset'))
    }


    Allen._event = function (name) {
        return new Event(name)
    }


    Allen.init()


    // expose
    window.Allen = Allen


})()
