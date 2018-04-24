var app = {
	sound: null,
	now: [],
	mouseDown: false,
	currenPT: 0,
	widthApp: 0,
	index: 0,
	slide: {
		array: []
	},
	config: {
		repeat: false,
		random: false,
		volume: 100,
		server:
		[
			'https://mp3.zing.vn/xhr/media/get-source?type=',
			'&key='
		]
	},
	firstMT: true,
	stepType: '',
	vActive: false,
	vLast: 0
};
var playlist = {
			type: 'album',
			code: [
				'LHJmyZHuNVLugdzyHyFHkGtLQbAWlkdEa',
				'ZGcGtkmapAZpRNQymyFnLntZpLbRadJaB',
				'ZGcGtLHsQzcvNmRyHtFHLHykQZDRNBVZC',
				'kGcnTLHsWpGXJzvymybGLnyZQLbiadFEN'
			]
		}
$(document).ready(function () {
	app.widthApp = $('.music-player').width();
	$('.progress-duration').click(function (e) {
		var pt = e.offsetX / app.widthApp * 100;
			app.sound.currentTime = pt * app.sound.duration / 100;
			$('.play-progress-current')[0].style.width = pt + '%';
	});
	$('.wrapper-info').mousedown(function (e) {
		app.mouseDown = true;
		app.currentPT =  (e.offsetX / app.widthApp * 100);
	});
	$('.wrapper-info')[0].addEventListener('touchmove', function (e) {
		if (app.firstMT) {
			currentX = e.changedTouches[0].clientX / app.widthApp * 100;
			app.firstMT = false;
		}
		app.slide.slide(currentX, e.changedTouches[0].clientX)
	});
	
	$('body')[0].addEventListener('touchend', function () {
		app.firstMT = true;
		app.slide.done();
	})

	$('body').mouseup(function (e) {
		app.mouseDown = false;
		app.slide.done();
	})
	$('.wrapper-info').mousemove(function (e) {
		if (app.mouseDown) {
			app.slide.slide(app.currentPT, e.offsetX);
		}
	});
	$('.btn-play-pause').click(function () {
		if (app.sound.src) {
			if (app.isPlay() == true) {
				app.sound.pause();
			} else {
				app.sound.play();
			}
		}
	});
	$('.fa-step-forward').click(function () {
		app.stepType = 'forward';
		app.step();

	});
	$('.fa-step-backward').click(function () {
		app.stepType = 'backward';
		app.step();
	})
	$('.fa-repeat').click(function () {
		$('.fa-repeat').toggleClass('active-color');
	})
	$('.fa-random').click(function () {
		$('.fa-random').toggleClass('active-color');
	});
	$('.volume-btn').hover(function (e) {
		if (e.type == 'mouseenter') {
			app.vActive = true;
			$('.volume-control').css({
				'left': e.currentTarget.offsetLeft + (e.currentTarget.offsetWidth / 2 - 7) + 'px',
				'display': 'block'
			})
		} else {
			app.vActive = false;
			setTimeout(function () {
				if (app.vActive) return false;
				$('.volume-control').css({
					'display': 'none'
				});
			},1000)
		}
	});
	$('.volume-control').hover(function (e) {
		if (e.type == 'mouseenter') {
			app.vActive = true;
		} else {
			app.vActive = false;
			setTimeout(function () {
				if (app.vActive) return false;
				$('.volume-control').css({
					'display': 'none'
				});
			},1000)
		}
	});
	$('.wrapper-volume-control').click(function (e) {
		var y = e.pageY - $(this).offset().top;
		var w = $(this).height();
		if (y <= 0) return false;
		if (y >= w)  return false;
		var py = (y / w * 100) - $('.circle-progress').height() / 2;
		var pt = ((y / w * 100) - 100) * -1;
		$('.circle-progress').css({
			'top': py + '%'
		})
		app.sound.volume = app.constraint(pt/100, 0, 99);
	});
	$('.volume-btn').click(function (e) {
		if ($(this).hasClass('fa-volume-up')) {
			app.vLast = app.sound.volume;
			app.sound.volume = 0;
			$('.circle-progress').css({
				'top': '100%'
			})
			$(this)[0].className = 'fa fa-volume-off volume-btn';
		} else {
			app.sound.volume = app.vLast;
			$('.circle-progress').css({
				'top': 100 - (app.vLast * 100) + '%'
			})
			$(this)[0].className = 'fa fa-volume-up volume-btn';
		}
	});
	$('.circle-progress').mousedown(function (e) {
		var y = e.pageY
		console.log(y);
	})
	app.init();
});
//  format time 
app.formatTime = function(secs) {
	var minutes = Math.floor(secs / 60) || 0;
	var seconds = (secs - minutes * 60) || 0;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// Initialize App when document ready
app.init = function () {
	if (playlist) {
		this.sound = $('.myAudio')[0];
		this.get(this.index);
	}
	var e = $('.slider').children();
	for (var i = 0; i < e.length; i++) {
		if ($(e[i]).hasClass('main-slide')) {
			this.slide.main = i;
		}
		this.slide.array.push($(e[i]));
	}
	app.slide.render();

}
// to source play change
app.step = function () {
	var len = 0;	
	if (playlist.type == 'audio')
		len = playlist.code.length;
	else
		len = this.now.length;
	if (this.stepType == 'forward') {
		if (this.index == len -1) return false;
		if ($('.fa-random').hasClass('active-color')) {
			this.index = Math.floor(Math.random() * len);
		} else{
			this.index += 1;			
		}

	} else {
		if (this.index == 0) return false;
		if ($('.fa-random').hasClass('active-color')) {
			this.index = Math.floor(Math.random() * len);
		} else{
			this.index -= 1;			
		}
	}
	if (playlist.type == 'audio')
		this.get(this.index);
	else
		this.run(this.index);
}
// Get data from Zing Mp3
app.get = function (i) {
	var i = i;
	$.get(this.config.server[0] + playlist.type + this.config.server[1] + playlist.code[i]).done(function (e) {
		if (playlist.type == 'audio') {
		 	app.now.push(e.data);
		} else {
			app.now = e.data.items;
		}
		app.run(i);
	});
}
// Run audio and initialize UI
app.run = function (i) {
	this.sound.src = 'https:' + this.now[i].source['128'];
	this.sound.onloadeddata = function () {
		app.sound.play();
	}
	this.sound.onplay = function () {
		$('.btn-play-pause')[0].className = 'btn-play-pause fa fa-pause';
	},
	this.sound.onpause = function () {
		$('.btn-play-pause')[0].className = 'btn-play-pause fa fa-play';
	}
	this.sound.onplaying = function () {
		$('.end-time').text(app.formatTime(Math.floor(app.sound.duration)));
		document.title = app.now[i].name + ' - ' + app.now[i].performer;
		$('.title-song').text(app.now[i].name);
		$('.singer').text(app.now[i].performer);
		$('.background-player').css({
			backgroundImage: 'url('+ app.now[i].artist.thumbnail +')'
		})
		requestAnimationFrame(app.playing);
	}
	this.sound.onended = function () {
		var index = 0;
		if ($('.fa-repeat').hasClass('active-color')) {
			app.sound.play();
		} else {
			if ($('.fa-random').hasClass('active-color')) {
				if (playlist.type == 'audio'){
					index = Math.floor(Math.random() * playlist.code.length -1);
					app.index = index;
					app.get(index);
				}
				else
					index = Math.floor(Math.random() * app.now.length - 1);
					app.index = index;
					app.run(index);
			} else {
				app.stepType = 'forward';
				app.step();				
			}

		}
	},
	this.sound.onabort = function () {
		// $('.btn-play-pause')[0].className = 'btn-play-pause fa fa-play';
	}
	
}
app.skip = function (i) {
	
}
// When plaing todo
app.playing = function () {
	var seek = app.sound.currentTime || 0;
	var duration = app.sound.duration;
	$('.play-progress-current')[0].style.width = (((seek / duration) * 100) || 0) + '%';
	$('.current-time').text(app.formatTime(Math.round(seek)));
	if (app.isPlay()) {
		requestAnimationFrame(app.playing);
	}
}
// check playing
app.isPlay = function () {
	return !this.sound.paused;
}

app.constraint = function (c, i, a) {
	var r = c;
	if (c < i)
		r =  i;
	if (c > a)
		r =  a;
	return r;
}

app.slide.slide = function (c, x) {
	var pt = ((x) / app.widthApp * 100);
		pt = Math.floor(pt - c);
		this.array.forEach(function (item, i) {
			// item.css({
			// 	'left': ((pt * (app.slide.main))) + '%'
			// })
			// console.log((pt + app.slide.main));
		})
		
}
app.slide.done = function () {
	// $('.song-info')[0].style.left = '0%';
	// $('.liric')[0].style.left = '100%';
}
app.slide.render = function () {
	this.array.forEach(function (item, i) {
		console.log((i - app.slide.main) * 100);
		item.css({
			'left': ((i - app.slide.main) * 100) + '%'
		})
	})
}
