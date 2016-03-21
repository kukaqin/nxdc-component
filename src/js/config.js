require.config({
    // urlArgs:"rnd="+(new Date()).getTime(),
    paths:{
        'jquery':'../../lib/jquery/jquery.min',
        'bootstrap':'../../lib/bootstrap/dist/js/bootstrap.min',
		'utils':'./Compatibility/utils',
		'tabs':'./components/tabs',
		'bread':'./components/bread',
		'alert':'./components/alert',
		'confirm':'./components/confirm',
		'prompt':'./components/prompt',
		'drop':'./components/drop',
		'search':'./components/search',
		'gallery':'./components/gallery',
		'progressbar':'./components/progressbar',
		'drop2':'./components/drop2',
		'drop3':'./components/drop3',
		'treable':'./components/treable',
		'sutable':'./components/sutable',
		'timerange':'./components/timerange',
		'blend':'./components/blend',
		'vList3':'./components/vList3',
		'bubble':'./components/bubble'
    },
    shim:{
		bootstrap:{
			deps:['jquery']
		},
		drop:{
			deps:['jquery']
		},
		drop2:{
			deps:['bootstrap']
		},
		alert:{
			deps:['bootstrap']
		},
		confirm:{
			deps:['bootstrap']
		},
		prompt:{
			deps:['bootstrap']
		},
		gallery:{
			deps:['bootstrap']
		},
		treable:{
			deps:['bootstrap','tabs','drop2']
		},
		sutable:{
			deps:['bootstrap']
		},
		bubble:{
			deps:['bootstrap']
		},
		timerange:{
			deps:['drop']
		},
		vList3:{
			deps:['search']
		},
		blend:{
			deps:['vList3','bread','drop3']
		}
    }
});
