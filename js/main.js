/*
 * showndown.js: change markdown text 2 html
 * javascript-micro-templating.js make htmlCode with help from tmpl, a simple front-end templating made by JohnResig
 * backbone.js: a mvc js lib, this blog use it's router function
 * maked by Toph-(github.com/toph-) on 2012-07-13
 *
 */

var blog = {};

blog.tool = {};
blog.tool.showdown = new Showdown.converter(); /* showndown */
blog.tool.tmpl = function($obj, tmpId, data) { /* javascript-micro-templating */
	$obj.html(tmpl(tmpId, data));
}

blog.data = {};

blog.view = {};
blog.view.initHeader = function() {
	blog.tool.tmpl($('header'), 'tmpl_header', blog.data.header);
}
blog.view.makeContent = function(_opt) {
	switch(_opt) {
		case 'home':
			$('title').html(blog.data.header.title);
			blog.tool.tmpl($('article'), 'tmpl_home', {post: blog.data.post});
			break;
		case 'msg':
			$('title').html('MSG' + blog.data.header.title); 
			($('#disqus').length == 0) && 
			$('article').
			break;
		case 'links':
			$.get('post/links.txt', function(data) {
				$('title').html('LINKS' + blog.data.header.title);
				var htmlCode = blog.tool.showdown.makeHtml(data);
				blog.tool.tmpl($('article'), 'tmpl_common', {content: htmlCode});
				$('article section').addClass('links_page');
			});
			break;
		case 'about':
			$.get('post/about.txt', function(data) {
				$('title').html('ABOUT' + blog.data.header.title); 
				var htmlCode = blog.tool.showdown.makeHtml(data);
				blog.tool.tmpl($('article'), 'tmpl_common', {content: htmlCode});
			});
			break;
		default:
			$.get('post/' + _opt + '.txt', function(data) {
				$('title').html(); 
				var htmlCode = blog.tool.showdown.makeHtml(data);
				blog.tool.tmpl($('article'), 'tmpl_article', {content: htmlCode, date: _opt.slice(0, 10)});
			});
			break;
	}
}

blog.router = Backbone.Router.extend({
	routes:{
		'': 'makeHomePage',
		'!about': 'makeAboutPage',
		'!links': 'makeFriendLinks',
		'!msg': 'makeMsgPage',
		'!post/:title': 'makeArticlePage'
	},
	makeHomePage: function() {
		blog.view.makeContent('home');
	},
	makeMsgPage: function() {
		blog.view.makeContent('msg');		
	},
	makeAboutPage: function() {
		blog.view.makeContent('about');
	},
	makeFriendLinks: function() {
		blog.view.makeContent('links');
	},
	makeArticlePage: function(title) {
		blog.view.makeContent(title);
	}
});

blog.extend = {};
blog.extend.init = function() {
	var _bA = false,
		_$mdDialog = $('.markdown_dialog');
	$('body').keydown(function(event) {
		switch(event.which) {
			case 65://a
				if(!_bA) {
					$('body').css({'font-size':'16px'});
					_bA = true;
				} else {
					$('body').css({'font-size':'14px'});
					_bA = false;
				}
				break;
			case 77://m
				//_$mdDialog.toggleClass('show');
				break;
			case 27://esc
				//_$mdDialog.removeClass('show');
				break;
			default:
				break;
		}
	});
};
(function() {
	$.getJSON('js/meta.js', function(_data) {
		blog.data = _data;
		blog.view.initHeader();
		new blog.router();
		//blog.extend.init()
		Backbone.history.start();
	});
})();
