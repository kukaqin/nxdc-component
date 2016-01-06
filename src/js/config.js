require.config({
    urlArgs:"rnd="+(new Date()).getTime(),
    paths:{
        'jquery':'../../lib/jquery/jquery.min',
        'bootstrap':'../../lib/bootstrap/dist/js/bootstrap.min',
		'alert':'./components/alert',
		'progressbar':'./components/progressbar',
		'confirm':'./components/confirm',
		'prompt':'./components/prompt',
		'drop':'./components/drop',
		'search':'./components/search',
		'utils':'./Compatibility/utils'
		
    },
    shim:{
		bootstrap:{
			deps:['jquery']
		},
		drop:{
			deps:['jquery']	
		},
		alert:{
			deps:['bootstrap']	
		},
		confirm:{
			deps:['bootstrap']
		},
		prompt:{
			deps:['bootstrap']
		}
    }
});