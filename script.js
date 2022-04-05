const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image()

function uploadImage() {
    const uploadedImage = document.querySelector('#upload-image').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        image1.src = reader.result;
    }, false);

    if (uploadedImage) {
        reader.readAsDataURL(uploadedImage);
    }
}

image1.onload = function initialise() {
    canvas.width = image1.width;
    canvas.height = image1.height;
    ctx.drawImage(image1, 0, 0, image1.width, image1.height);
}

const inputSlider = document.getElementById('resolution')
const textSize = document.getElementById('text-size')
const inputLabel = document.getElementById('resolutionLabel')

inputSlider.addEventListener('change', handleSlider)
textSize.addEventListener('change', handleSlider)

function handleSlider() {
    if (inputSlider.value == 1) {
        inputLabel.innerHTML = 'Original image';
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
    } else {
        inputLabel.innerHTML = 'Change Resolution'
        ctx.font = parseInt(inputSlider.value) * textSize.value + 'px Verdana'
        effect.draw(parseInt(inputSlider.value))
    }
}

const colorSelector = document.getElementById('colorSelector')
// colorSelector.addEventListener('change', colorChange)
// function colorChange(e) {
//     ctx.fillStyle = colorSelector.value
// }

// const bgColor = document.getElementById('bgcolor')
// const bgCanvas = document.querySelector('canvas').style.backgroundColor
// bgColor.addEventListener('change', bgColorChange)
// function bgColorChange(e) {
//     bgCanvas = bgColor.value
// }


class Cell {
    constructor(x, y, symbol, color) {
        this.x = x
        this.y = y
        this.symbol = symbol
        this.color = color
    }
    draw(ctx) {
        ctx.fillStyle = "white"
        ctx.fillText(this.symbol, this.x + 0.2, this.y + 0.2)
        // ctx.fillStyle = this.color
        // ctx.fillStyle = colorSelector.value
        if (colorSelector.value == 0) {
            ctx.fillStyle = this.color
        } else {
            ctx.fillStyle = colorSelector.value
        }
        ctx.fillText(this.symbol, this.x, this.y)
    }
}

class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }
    #convertToSymbol(rgbValue) {
        if (rgbValue > 250) return '.';
        else if (rgbValue > 240) return '*'
        else if (rgbValue > 220) return '+'
        else if (rgbValue > 200) return '#'
        else if (rgbValue > 180) return '/'
        else if (rgbValue > 160) return '_'
        else if (rgbValue > 140) return ':'
        else if (rgbValue > 120) return '$'
        else if (rgbValue > 100) return '/'
        else if (rgbValue > 80) return 'U'
        else if (rgbValue > 60) return '|'
        else if (rgbValue > 40) return 'X'
        else if (rgbValue > 20) return 'O'
        else return ''
    }

    #scanImage(cellSize) {
        this.#imageCellArray = [];
        for (let y = 0; y < this.#pixels.height; y += cellSize) {
            for (let x = 0; x < this.#pixels.width; x += cellSize) {
                const pos = (y * 4 * this.#pixels.width) + (x * 4)

                if (this.#pixels.data[pos + 3] > 128) {
                    const rgb_R = this.#pixels.data[pos];
                    const rgb_G = this.#pixels.data[pos + 1];
                    const rgb_B = this.#pixels.data[pos + 2];
                    const averageColorValue = (rgb_R + rgb_G + rgb_B) / 3;
                    const color = `rgb(${rgb_R}, ${rgb_G}, ${rgb_B})`
                    const symbol = this.#convertToSymbol(averageColorValue)
                    if (rgb_R + rgb_G + rgb_B > 200) {
                        this.#imageCellArray.push(new Cell(x, y, symbol, color))
                    }
                }
            }
        }
    }
    #drawAscii() {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for (let i = 0; i < this.#imageCellArray.length; i++) {
            this.#imageCellArray[i].draw(this.#ctx)
        }
        // console.log(this.#imageCellArray)
    }
    draw(cellSize) {
        this.#scanImage(cellSize);
        this.#drawAscii()
    }
}

let effect;

image1.onload = function initialise() {
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height)
    handleSlider()
}


