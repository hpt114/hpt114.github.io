const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ��ȡ��ƵԪ��
const buttonSound = document.getElementById('buttonSound');

// ��ȡ��Ч����Ԫ��
const soundToggle = document.getElementById('soundToggle');

// ��ȡҳ���ϵ����а�ť����Ϊ������ӵ���¼�������
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        // ������Ч���ص�״̬�����Ƿ񲥷���Ч
        if (soundToggle.checked) {
            buttonSound.currentTime = 0.2; // ������Ƶʱ���Ա���������
            buttonSound.play();
        }
    });
});
// ��ʼ����Ϸ����
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
foodImg.src = 'food.png'; // ȷ��ͼƬ·����ȷ

// ��Ӱ����¼�������
document.getElementById('up').addEventListener('click', () => { if(direction != 'DOWN') direction = 'UP'; });
document.getElementById('down').addEventListener('click', () => { if(direction != 'UP') direction = 'DOWN'; });
document.getElementById('left').addEventListener('click', () => { if(direction != 'RIGHT') direction = 'LEFT'; });
document.getElementById('right').addEventListener('click', () => { if(direction != 'LEFT') direction = 'RIGHT'; });

// ˫���÷����򱣴�÷ֵ�txt
scoreDisplay.addEventListener('dblclick', () => {
    saveScoreToFile();
});

// ��ȡ������ص�Ԫ��
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const snakeColorPicker = document.getElementById('snakeColorPicker');

let snakeColor = '#00FF00'; // Ĭ���ߵ���ɫΪ��ɫ

// ���ð�ť����¼����л����������ʾ״̬
settingsButton.addEventListener('click', () => {
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
    } else {
        settingsPanel.style.display = 'none';
    }
});

function applySettings() {
    snakeColor = snakeColorPicker.value;
    settingsPanel.style.display = 'none'; // �����������
    
    // �����Ч���رգ�����ͣ��ǰ���ŵ���Ч
    if (!soundToggle.checked && !buttonSound.paused) {
        buttonSound.pause();
        buttonSound.currentTime = 0;
    }
}

// ������Ч���صı仯
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

    // ����Ƿ�ײǽ����ײ
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
    scoreDisplay.textContent = `�÷�: ${score}`;
}

function restartGame() {
    clearInterval(game); // ����ɵ���Ϸѭ��
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
        pauseBtn.innerHTML = '<img src="pause2.png" alt="����ͼ��" width="20" height="20"><span>����</span>';
    } else {
        game = setInterval(draw, 200);
        pauseBtn.innerHTML = '<img src="pause1.png" alt="��ͣͼ��" width="20" height="20"><span>��ͣ</span>';
    }
}

function saveScoreToFile() {
    const now = new Date().toLocaleString();
    const content = `[${now}] �÷�: ${score}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Snake.txt';

    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); // Clean up and remove the link
}

// ȷ��ʳ�ﲻ��������
while (collision(food, snake)) {
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

// ��ʼ��ʾ��ͣ��ť
pauseButton.style.display = 'inline-block';

let game = setInterval(draw, 200);