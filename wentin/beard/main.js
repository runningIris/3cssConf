(function(){

	const beards = document.getElementsByClassName('beard');
	const move = 'ontouchmove' in document ? 'touchmove' : 'mousemove';
	document.addEventListener(move, (e) => {
		const ev = 'ontouchmove' in document ? e.touches[0] : e;
		let x = ev.pageX;
		let y = ev.pageY;
		console.log(`(${x}, ${y})`);
		if(y>150 && y<450){
			beards[0].style.transform = `translate(600px, 300px) rotate(${(y-300) * 0.2}deg)`;
			beards[1].style.transform = `translate(450px, 300px) scaleX(-1) rotate(${(y-300) * 0.2}deg)`;
		}
	})

})();