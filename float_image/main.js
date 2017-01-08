let img = document.querySelector('img');
let big = document.querySelector('.bigPic');
img.addEventListener('mouseover', function(){
	console.log('over');
	big.style.display = 'block';
})
img.addEventListener('mouseout', function(){

	console.log('left');
	big.style.display = 'none';
})
