const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 获取音频元素
const buttonSound = document.getElementById('buttonSound');

// 获取音效开关元素
const soundToggle = document.getElementById('soundToggle');

// 获取页面上的所有按钮，并为它们添加点击事件监听器
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        // 根据音效开关的状态决定是否播放音效
        if (soundToggle.checked) {
            buttonSound.currentTime = 0.2; // 重置音频时间以便立即播放
            buttonSound.play();
        }
    });
});
// 初始化游戏参数
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};
let direction;

let score = 0;
const scoreDisplay = document.getElementById('scoreDisplay');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const foodImg = new Image();
foodImg.src = 'food.png'; // 确保图片路径正确

// 添加按键事件监听器
document.getElementById('up').addEventListener('click', () => { if(direction != 'DOWN') direction = 'UP'; });
document.getElementById('down').addEventListener('click', () => { if(direction != 'UP') direction = 'DOWN'; });
document.getElementById('left').addEventListener('click', () => { if(direction != 'RIGHT') direction = 'LEFT'; });
document.getElementById('right').addEventListener('click', () => { if(direction != 'LEFT') direction = 'RIGHT'; });

// 双击得分区域保存得分到txt
scoreDisplay.addEventListener('dblclick', () => {
    saveScoreToFile();
});

// 获取设置相关的元素
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const snakeColorPicker = document.getElementById('snakeColorPicker');

let snakeColor = '#00FF00'; // 默认蛇的颜色为绿色

// 设置按钮点击事件：切换设置面板显示状态
settingsButton.addEventListener('click', () => {
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
    } else {
        settingsPanel.style.display = 'none';
    }
});

function applySettings() {
    snakeColor = snakeColorPicker.value;
    settingsPanel.style.display = 'none'; // 隐藏设置面板
    
    // 如果音效被关闭，则暂停当前播放的音效
    if (!soundToggle.checked && !buttonSound.paused) {
        buttonSound.pause();
        buttonSound.currentTime = 0;
    }
}

// 监听音效开关的变化
soundToggle.addEventListener('change', () => {
    if (!soundToggle.checked && !buttonSound.paused) {
        buttonSound.pause();
        buttonSound.currentTime = 0;
    }
});
function draw() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    const newHead = { x: snakeX, y: snakeY, snakeColor};

    // 检查是否撞墙或自撞
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {

        clearInterval(game);
        restartButton.style.display = 'inline-block';
        return;
    }

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        updateScore();

        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }
        snake.unshift(newHead)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? snakeColor : snakeColorPicker.value;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(foodImg, food.x, food.y, box, box);
}

function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function updateScore() {
    scoreDisplay.textContent = `得分: ${score}`;
}

function restartGame() {
    clearInterval(game); // 清除旧的游戏循环
    pauseButton.style.display = 'none';

    snake = [{ x: 9 * box, y: 10 * box }];
    direction = undefined;
    score = 0;
    updateScore();
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    restartButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';

    game = setInterval(draw, 200);
}

function togglePause() {
    const pauseBtn = document.getElementById('pauseButton');
    const icon = pauseBtn.querySelector('img');

    if (game) {
        clearInterval(game);
        game = null;
        pauseBtn.innerHTML = '<img src="pause2.png" alt="继续图标" width="20" height="20"><span>继续</span>';
    } else {
        game = setInterval(draw, 200);
        pauseBtn.innerHTML = '<img src="pause1.png" alt="暂停图标" width="20" height="20"><span>暂停</span>';
    }
}

function saveScoreToFile() {
    const now = new Date().toLocaleString();
    const content = `[${now}] 得分: ${score}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Snake.txt';

    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); // Clean up and remove the link
}

// 确保食物不在蛇身上
while (collision(food, snake)) {
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

// 初始显示暂停按钮
pauseButton.style.display = 'inline-block';

let game = setInterval(draw, 200);