(function () {

    'use strict'


    var Allen = {}

    Allen.canvas = document.getElementById('canvas')
    Allen.ctx    = Allen.canvas.getContext('2d')
    Allen.input  = document.getElementById('input')
    Allen.submit = document.getElementById('submit')

    Allen.init = function () {
        this.fontSize = 88
        this.fontGap  = 10

        // register event listeners
        this.submit.addEventListener('click', this._onSubmit.bind(this))
    }

    Allen._draw = function (text) {
        this._loadImages(['./images/bg.jpg', './images/main.png'])
            .then(this._drawLayer1.bind(this))
            .then(this._drawText.bind(this, text))
            .then(this._drawLayer2.bind(this))
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
        this.ctx.fillStyle = "white"
        this.ctx.font = '900 ' + this.fontSize + 'px "Noto Sans T Chinese", "Hiragino Sans GB", sans-serif';
        text.split('\n').forEach((sentence, index) => {
            sentence.split('').forEach((word, _index) => {
                let x = 143 - (index * this.fontSize + (index * this.fontGap))
                let y = 110 + (_index * this.fontSize)
                this.ctx.fillText(word, x, y)
            })
        })

    }


    Allen._drawLayer2 = function () {
        this.ctx.drawImage(this.image2, 0, 396)
    }


    Allen._onSubmit = function (event) {

        event.preventDefault()

        if (!this.input.value) {
            alert('請輸入文字！！！')
        }
        else {
            this._draw.call(this, this.input.value)
        }

    }

    Allen.init()


    // expose
    window.Allen = Allen


})()
