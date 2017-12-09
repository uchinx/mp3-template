var app = {
	sound: null,
	now: null,
	mouseDown: false,
	currenPT: 0,
	widthApp: 0,
	index: 0
};
var config = {
	repeat: false,
	random: false,
	volume: 100,
	server: 'https://mp3.zing.vn/xhr/media/get-source?type=audio&key='
}
var playlist = 
		[
			'LGxHyZHNlSzldRstmybmkmtZWZbJkQNGR',
			'kGcmyLHsCzvlVSVynTvmkGyLWLbxnJXdJ',
			'kHJGyLHNhSdlHdLtnyFHZHtZpkvxmJaVN'

		]
var firstMT = true;
$(document).ready(function () {
	app.widthApp = $('.music-player').width();
	$('.progress-duration').click(function (e) {
		var phantram = e.offsetX / app.widthApp * 100;
			app.sound.currentTime = phantram * app.sound.duration / 100;
			$('.play-progress-current')[0].style.width = phantram + '%';
	});
	$('.wrapper-info-song').mousedown(function (e) {
		app.mouseDown = true;
		app.currentPT =  (e.offsetX / app.widthApp * 100);
	});
	$('.wrapper-info-song')[0].addEventListener('touchmove', function (e) {
		if (firstMT) {
			currentX = e.changedTouches[0].clientX / app.widthApp * 100;
			firstMT = false;
		}
		var phantram = ((e.changedTouches[0].clientX) / app.widthApp * 100);
			phantram = phantram - currentX;
			$('.wrapper-info-song')[0].style.left = Math.floor(phantram) +  '%';
	});
	
	$('body')[0].addEventListener('touchend', function () {
		firstMT = true;
		$('.wrapper-info-song')[0].style.left = '0%';
	})

	$('body').mouseup(function (e) {
		app.mouseDown = false;
		$('.wrapper-info-song')[0].style.left = '0%';
	})
	$('.wrapper-info-song').mousemove(function (e) {
		if (app.mouseDown) {
			var phantram = (e.offsetX / app.widthApp * 100);
			phantram = phantram - app.currentPT;
			$('.wrapper-info-song')[0].style.left = Math.floor(phantram) +  '%';
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
		if (app.index == playlist.length - 1) return false;
		app.index += 1;
		app.get(app.index);

	});
	$('.fa-step-backward').click(function () {
		if (app.index == 0) return false;
		app.index -= 1;
		app.get(app.index);
	})
	app.init();
})

app.formatTime = function(secs) {
	var minutes = Math.floor(secs / 60) || 0;
	var seconds = (secs - minutes * 60) || 0;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
app.step = function () {
	var seek = this.seek() || 0;
	$('.play-progress-current')[0].style.width = (((seek / sound.duration()) * 100) || 0) + '%';
	$('.current-time').text(this.formatTime(Math.round(seek)));
	if (this.sound.playing()) {
		requestAnimationFrame(this.step.bind(app));
	}
}
app.init = function () {
	if (playlist) {
		this.sound = $('.myAudio')[0];
		this.get(this.index);
	}
}
app.get = function (i) {
	$.get(config.server + playlist[i]).done(function (e) {
		app.now = e.data;
		app.run();
	});
}
app.run = function () {
	this.sound.src = this.now.source['128'];
	this.sound.play();
	this.sound.onplay = function () {
		$('.btn-play-pause')[0].className = 'btn-play-pause fa fa-pause';
	},
	this.sound.onpause = function () {
		$('.btn-play-pause')[0].className = 'btn-play-pause fa fa-play';
	}
	this.sound.onplaying = function () {
		$('.end-time').text(app.formatTime(Math.floor(app.sound.duration)));
		$('.title-song').text(app.now.name);
		$('.singer').text(app.now.performer);
		$('.background-player').css({
			backgroundImage: 'url('+ app.now.artist.thumbnail +')'
		})
		requestAnimationFrame(app.playing);
	}
	this.sound.onended = function () {
		if (config.repeat) {

		}
	}
	
}
app.skip = function (i) {
	
}
app.playing = function () {
	var seek = app.sound.currentTime || 0;
	var duration = app.sound.duration;
	$('.play-progress-current')[0].style.width = (((seek / duration) * 100) || 0) + '%';
	$('.current-time').text(app.formatTime(Math.round(seek)));
	if (app.isPlay()) {
		requestAnimationFrame(app.playing);
	}
}
app.isPlay = function () {
	return !this.sound.paused;
}
//"//zmp3-mp3-s1.zadn.vn/0115d71e0c5ae504bc4b/4205179650957840805?authen=exp=1512885419~acl=/0115d71e0c5ae504bc4b/*~hmac=04171a76e714e64f33276425a3561bdf"