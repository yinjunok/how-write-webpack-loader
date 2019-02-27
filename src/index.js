import './deep/deep';
import img from './demo.png';
import bigPic from './big-pic.png';
import md from './test.md';

const app = document.getElementById('app');

app.innerHTML = md;

const imgEle = document.createElement('img');
imgEle.src = img;

app.appendChild(imgEle);
