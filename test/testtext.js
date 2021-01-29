const canvas = document.getElementById('c');
const text = document.getElementById('t');
let W = document.body.clientWidth;
let H = document.body.clientHeight;

let mouseSpeed = 10;
let autoMouse = true;
let direction = -mouseSpeed;
const mouse = {
    x: W / 2,
    y: H / 2,
    r: 100,
}
console.log(mouse)

function automaticMouse(mouse, normalizedPercent) {
    if (!autoMouse) return;
    const xMovement = (W / 2) * normalizedPercent;
    const minX = W / 2 - xMovement;
    const maxX = W / 2 + xMovement;
    if (mouse.x <= minX) {
        direction = mouseSpeed;
    }
    if (mouse.x >= maxX) {
        direction = -mouseSpeed;
    }
    let distanceFromCenter = Math.abs(mouse.x - W / 2);
    let addedVelocity = (distanceFromCenter / xMovement) * 30;
    mouse.x += direction + (Math.sign(direction) * addedVelocity);
}

let resolution = 1;
let fps = 0;
var ctx = canvas.getContext('2d');
var ttx = text.getContext('2d');
const colors = ['#5D2E8C', '#CCFF66', '#2EC4B6', '#D0DB97', '#69B578'];
let rAF = null;
let pixels = [];
let pushers = [];
let word = 'Click Me';
let raf = null;

function Pusher(x, y) {
    this.x = ~~x;
    this.y = ~~y;
    this.r = 30;
    this.d = this.r / 2;
    this.xVel = ~~(Math.random() * 40);
    this.yVel = ~~(Math.random() * 40);
    this.move = () => {
        const d = this.d;
        const xVel = this.xVel;
        const x = this.x;
        const yVel = this.yVel;
        const y = this.y

        if (x + d + xVel >= W || x - d + xVel <= 0) {
            this.xVel = -xVel;
            this.x += -xVel;
        } else {
            this.x += xVel;
        }
        if (y + d + yVel >= H || y - d + yVel <= 0) {
            this.yVel = -yVel;
            this.y += -yVel;
        } else {
            this.y += yVel;
        }
    }
}
// 0 - 1 max
const distanceFromCenterMultiplier = 0;

const PY = (x, y) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2), 2);

function Pixel(x, y, r, g, b) {
    this.homeX = x + distanceFromCenterMultiplier * (x - (W / 2));
    this.homeY = y + distanceFromCenterMultiplier * (y - (H / 2));
    this.x = x;
    this.y = y;
    this.a = 255;
}
Pixel.prototype.arrive = function () {
    const hx = this.homeX;
    const hy = this.homeY;
    const x = this.x;
    const y = this.y;
    var hvx = 0,
        hvy = 0;
    if (x !== hx || y !== hy) {
        const desiredX = hx - x;
        const desiredY = hy - y;
        const d = PY(desiredX, desiredY);
        const homeForce = d * 0.03;
        const homeAngle = Math.atan2(desiredY, desiredX);
        hvx = homeForce * Math.cos(homeAngle);
        hvy = homeForce * Math.sin(homeAngle);
    }
    var pusherD2 = 0,
        pusherF = 0,
        pusherAngle = 0,
        pvx = 0,
        pvy = 0,
        pusher = 0,
        pusherX = 0,
        pusherY = 0;
    for (let i = pushers.length - 1; i >= 0; i--) {
        pusher = pushers[i];
        pusherX = x - pusher.x;
        pusherY = y - pusher.y;
        if (pusherX > 50 || pusherY > 50 || pusherY < -50 || pusherX < -50) continue;
        pusherD2 = Math.pow(PY(pusherX, pusherY), 2);
        pusherF = Math.min(8000 / pusherD2, 5000);
        pusherAngle = Math.atan2(pusherY, pusherX);
        pvx += pusherF * Math.cos(pusherAngle);
        pvy += pusherF * Math.sin(pusherAngle);
    }
    //  If you dont restart mvx/mvy funny things happen
    // declaring these variables outside the function actually makes them slower
    var mvx = 0,
        mvy = 0,
        mouseX, mouseY, mouseAngle, mouseF, mouseH;
    // mvx = 0, mvy = 0;
    mouseX = x - mouse.x;
    mouseY = y - mouse.y;
    mouseH = PY(mouseX, mouseY);
    var radius = mouse.r;
    if (mouseH < radius) {
        mouseAngle = Math.atan2(mouseY, mouseX);
        mouseF = (radius - mouseH) * 0.2;
        mvx = mouseF * Math.cos(mouseAngle);
        mvy = mouseF * Math.sin(mouseAngle);
    }

    const vx = (hvx + pvx + mvx) * 0.9;
    const vy = (hvy + pvy + mvy) * 0.9;
    this.x = x + 1 + vx > hx && x + vx - 1 < hx ? hx : x + vx;
    this.y = y + 1 + vy > hy && y + vy - 1 < hy ? hy : y + vy;
}
var dpID, dpImageData, dpIndex, dpCenterX, dpCenterY, dpX, dpY, dpEndX, dpEndY, dpImageDataIndex, dpDiameter, dpColor;

function drawPixels() {
    dpID = ctx.createImageData(W, H);
    dpImageData = dpID.data;
    for (dpIndex = pixels.length - 1; dpIndex >= 0; dpIndex--) {
        dpCenterX = ~~pixels[dpIndex].x;
        dpCenterY = ~~pixels[dpIndex].y;
        dpColor = pixels[dpIndex].a;
        if (resolution === 1) {
            dpImageDataIndex = (dpCenterY * W + dpCenterX) * 4;
            dpImageData[dpImageDataIndex] = 0;
            dpImageData[dpImageDataIndex + 1] = 0;
            dpImageData[dpImageDataIndex + 2] = 0;
            dpImageData[dpImageDataIndex + 3] = dpColor;
            continue;
        }
        for (dpY = dpCenterY - ~~(resolution / 2), dpEndY = dpCenterY + Math.ceil(resolution / 2); dpY <= dpEndY && dpY >= 0 && dpY < H; dpY++)
            for (dpX = dpCenterX - ~~(resolution / 2), dpEndX = dpCenterX + Math.ceil(resolution / 2); dpX < dpEndX && dpX >= 0 && dpX < W; dpX++) {
                dpImageDataIndex = (dpY * W + dpX) * 4;
                dpImageData[dpImageDataIndex] = 0;
                dpImageData[dpImageDataIndex + 1] = 0;
                dpImageData[dpImageDataIndex + 2] = 0;
                dpImageData[dpImageDataIndex + 3] = dpColor;
            }

    }
    for (dpIndex = pushers.length - 1; dpIndex >= 0; dpIndex--) {
        dpCenterX = Math.floor(pushers[dpIndex].x);
        dpCenterY = Math.floor(pushers[dpIndex].y);
        dpDiameter = pushers[dpIndex].r / 2;
        if (dpCenterX > 0 && dpCenterY > 0)
            for (dpY = dpCenterY - Math.floor(dpDiameter), dpEndY = dpCenterY + Math.ceil(dpDiameter); dpY <= dpEndY && dpY >= 0 && dpY < H; dpY++)
                for (dpX = dpCenterX - Math.floor(dpDiameter), dpEndX = dpCenterX + Math.ceil(dpDiameter); dpX < dpEndX && dpX >= 0 && dpX < W; dpX++) {
                    dpImageDataIndex = (dpY * W + dpX) * 4;
                    dpImageData[dpImageDataIndex + 3] = 255;
                }

    }
    // Draw pushers
    ctx.putImageData(dpID, 0, 0);
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.font = '800 25px sans-serif bold';
    ctx.fillStyle = "#8484A0";
    ctx.fillText(fps, 10, 35);
    ctx.textBaseline = "bottom";
    ctx.font = '800 12px/25px sans-serif bold';
    ctx.fillStyle = "#747488";
    ctx.fillText('FPS', 45, 32);
}

function getFontSize() {
    if (W > 1280) return W / 5;
    if (W > 800) return W / 5;
}
var img, fontSize;

function init() {
    if (raf) {
        cancelAnimationFrame(raf)
    }
    ttx.clearRect(0, 0, W, H);
    ctx.clearRect(0, 0, W, H);
    fontSize = window.innerWidth / 2;
    ttx.font = "800 " + fontSize + 'px Inter';
    ttx.textAlign = "center";
    ttx.textBaseline = "middle";
    ttx.fillText(word, W / 2, H / 2);
    ctx.fillText(word, W / 2, H / 2);
    //   img = new Image;

    //   img.crossOrigin = "Anonymous";
    //   img.src = "https://i.imgur.com/0m5Wbzd.png";
    //   ttx.drawImage(img, 500, 0);
    const imageData = ttx.getImageData(0, 0, W, H).data;
    let x, y, imageDataIndex, pixelIndex, gray;
    pixelIndex = 0;
    // let r, g, b;
    pixels = [];
    pushers = [];
    for (x = W - resolution - 1; x >= 0; x -= resolution) //var i=0;i<imageData.data.length;i+=4)
    {
        // r = Math.floor(Math.random() * 255);
        // g = Math.floor(Math.random() * 255);
        // b = Math.floor(Math.random() * 255);
        for (y = H - 1 - resolution; y >= 0; y -= resolution) {
            imageDataIndex = (y * W + x) * 4;
            gray = imageData[imageDataIndex + 3];
            if (gray > 0) {
                if (pixelIndex >= pixels.length) {
                    pixels[pixelIndex] = new Pixel(x, y);
                    pixels[pixelIndex].a = gray;
                } else {
                    pixels[pixelIndex].homeX = x;
                    pixels[pixelIndex].homeY = y;
                    pixels[pixelIndex].a = gray;
                }
                pixelIndex++;
            }
        }
    }
    timer();

}

window.addEventListener('resize', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    text.width = document.body.clientWidth;
    text.height = document.body.clientHeight;
    W = document.body.clientWidth;
    H = document.body.clientHeight;
    // _.debounce(init(), 500)();
});

canvas.addEventListener('mousemove', (e) => {
    if (autoMouse) {
        autoMouse = false;
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
canvas.addEventListener('touchend', (e) => {
    if (autoMouse) {
        autoMouse = false;
    }
    mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
    mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    
});
canvas.addEventListener('click', e => {
    // pushers.push(new Pusher(e.clientX, e.clientY));
    console.log('Pushers', pushers.length, '  Pixels:', pixels.length, '  Ammount of collission checks:', pushers.length * pixels.length);
})
const fpsFactory = function (onSecond) {
    let lastSec = Date.now();
    let frames = 0;
    let fps = 0;
    return {
        onFrame: () => {
            const elapsed = (Date.now() - lastSec) / 1000;
            if (elapsed > 1) {
                lastSec = Date.now();
                fps = frames;
                frames = 0;
                onSecond(fps);
            } else {
                frames += 1;
            }
        },
        getFPS: () => {
            return fps;
        }
    }
}
let calcfps = fpsFactory((f) => {
    fps = f
});

function timer() {
    automaticMouse(mouse, 0.5);
    calcfps.onFrame();
    let i;
    for (i = pushers.length - 1; i >= 0; i--) pushers[i].move();

    // if(pushers.length > 0)
    for (i = pixels.length - 1; i >= 0; i--) {
        pixels[i].arrive();
    }
    drawPixels();
    raf = requestAnimationFrame(timer);
}
// const input = document.getElementById('w');
// input.value = word;
// const debounceInit = _.debounce(init, 200);
const drawWord = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.font = (window.innerWidth / 5) + 'px arial';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, W / 2, H / 2);
}
const debounceChange = (e) => {
    word = e.target.value;
    if (raf) {
        cancelAnimationFrame(raf);
    }
    drawWord();
    debounceInit();
}
// input.onchange = debounceChange;
// input.oninput = debounceChange;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
text.width = document.body.clientWidth;
text.height = document.body.clientHeight;
W = document.body.clientWidth;
H = document.body.clientHeight;

init();