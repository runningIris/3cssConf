(function(){

	const beards = document.getElementsByClassName('beard');
	document.addEventListener('mousemove', (e) => {
		let x = e.clientX;
		let y = e.clientY;
		console.log(`(${x}, ${y})`);
		if(y>150 && y<450){
			beards[0].style.transform = `translate(600px, 300px) rotate(${(y-300) * 0.2}deg)`;
			beards[1].style.transform = `translate(450px, 300px) scaleX(-1) rotate(${(y-300) * 0.2}deg)`;
		}
	})

})();