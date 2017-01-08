
function createBubbles(n){
	const bubbles = [];
	for(let i = 0; i < n; i++){
		bubbles[i] = document.createElement('div');
		bubbles[i].className = 'bubble';
		bubbles[i].style.backgroundColor = `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())},${Math.random().toFixed(1)})`;
		document.body.appendChild(bubbles[i]);
	}
	return bubbles;
}

const bubbles = createBubbles(8);