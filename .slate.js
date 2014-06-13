/* global S:false, $:false, slate:false*/
"use strict";

S.log('Slate: loading config');

S.src('~/dev/forks/reslate/reslate.js');
// enable to see debug messages in Console.app
$.debug = true;

slate.alias('hyper', 'cmd;ctrl;alt');

// begin config
slate.configAll({
    defaultToCurrentScreen: true,
    nudgePercentOf: 'screenSize',
    resizePercentOf: 'screenSize',
    undoOps: [
    'active-snapshot',
    'chain',
    'grid',
    'layout',
    'move',
    'resize',
    'sequence',
    'shell',
    'push'
    ]
});


// Layouts - postitions

var rightLeft= S.op("move", {
    "screen" : 1,
    "x" : "screenOriginX",
    "y" : "screenOriginY",
    "width" : "screenSizeX/2",
    "height" : "screenSizeY"
});

var rightRight= S.op("move", {
    "screen" : 1,
    "x" : "screenOriginX + screenSizeX/2",
    "y" : "screenOriginY",
    "width" : "screenSizeX/2",
    "height" : "screenSizeY"
});

var leftLeft= S.op("move", {
    "screen" : 0,
    "x" : "screenOriginX",
    "y" : "screenOriginY",
    "width" : "screenSizeX/2",
    "height" : "screenSizeY"
});

var leftRight= S.op("move", {
    "screen" : 0,
    "x" : "screenOriginX + screenSizeX/2",
    "y" : "screenOriginY",
    "width" : "screenSizeX/2",
    "height" : "screenSizeY"
});

var leftLeftTop= S.op("move", {
    "screen" : 0,
    "x" : "screenOriginX",
    "y" : "screenOriginY",
    "width" : "screenSizeX/2",
    "height" : "screenSizeY/2"
});

var leftLeftBottom= S.op("move", {
    "screen" : 0,
    "x" : "screenOriginX",
    "y" : "screenOriginY + screenSizeY/2",
    "width" : "screenSizeX/2",
    "height" : "screenSizeY/2"
});


// Layouts
var twoScreenDevelopmentLayout = S.lay("twoScreenDev", {
    "PyCharm" : {
       "operations" : rightLeft,
       "ignore-fail" : true,
       "repeat" : false
    },
    "Google Chrome" : {
       "operations" : [rightRight, leftLeftTop],
       "ignore-fail" : true,
       "repeat" : true,
        "main-first": true
    },
    "iTerm" : {
       "operations" : leftRight,
       "ignore-fail" : true,
       "repeat" : false
    },
    "Sublime Text 2" : {
       "operations" : leftLeftBottom,
       "ignore-fail" : true,
       "repeat" : false
    }
});

S.def(2, twoScreenDevelopmentLayout);
var twoScreenDev = S.op("layout", {"name" : twoScreenDevelopmentLayout});

//bindings
slate.bindAll({
    hyper: {
        // Layouts
        d : function(win) {
            S.log('Running twoScreenDev layout');
            twoScreenDev.run();
        },

        // Move window to side/corner. (1/2 --> 2/3 --> 1/3 --> centered 1/3):
        //   u i o
        //   j k l
        //   m , . 

        u:   [$('corner', 'top-left', 2),
              $('corner', 'top-left', 1.5),
              $('corner', 'top-left', 3)],
        o:   [$('corner', 'top-right', 2),
              $('corner', 'top-right', 1.5),
              $('corner', 'top-right', 3)],
        m:   [$('corner', 'bottom-left', 2),
              $('corner', 'bottom-left', 1.5),
              $('corner', 'bottom-left', 3)],
        '.': [$('corner', 'bottom-right', 2),
              $('corner', 'bottom-right', 1.5),
              $('corner', 'bottom-right', 3)],

        j:   [$('barResize', 'left',  2),
              $('barResize', 'left',  1.5),
              $('barResize', 'left',  3),
              $('center', 'left', 3, 3)],
        l:   [$('barResize', 'right',  2),
              $('barResize', 'right',  1.5),
              $('barResize', 'right',  3),
              $('center', 'right', 3, 3)],
        i:   [$('barResize', 'top',  2),
              $('barResize', 'top',  1.5),
              $('barResize', 'top',  3),
              $('center', 'top', 3, 3)],
        ',': [$('barResize', 'bottom',  2),
              $('barResize', 'bottom',  1.5),
              $('barResize', 'bottom',  3),
              $('center', 'bottom', 3, 3)],

        k:  [ $('barResize','left',1),
              $('center', 'center', 3, 3),
              $('center', 'center', 2, 2)
            ],

        // Resize +10% - key determines which sides expands (Modal: hyper:h then j/l/i/,)
        h: {
             j:   $.op("resize", { "width" : "+10%", "height" : "+0", "anchor" :"top-right" }),
             l:   $.op("resize", { "width" : "+10%", "height" : "+0", "anchor" :"top-left"  }),
             i:   $.op("resize", { "width" : "+0",   "height" : "+10%", "anchor" :"bottom-left" }),
             ',':   $.op("resize", { "width" : "+0",   "height" : "+10%", "anchor" :"top-left" }),
        },

        //Resize -10% - key determines which sides contracts (Modal: hyper:h then j/l/i/,)
        shift: {
            h: {
                j: $.op("resize", { "width": "-10%", "height": "+0", "anchor": "top-right" }),
                l: $.op("resize", { "width": "-10%", "height": "+0", "anchor": "top-left"  }),
                i: $.op("resize", { "width": "+0", "height": "-10%", "anchor": "bottom-left" }),
                ',': $.op("resize", { "width": "+0", "height": "-10%", "anchor": "top-left" }),
            }
        },

    
        '`': ['throw 0 ',
              'throw 1 '],
        '1': $('toss', '0'),
        '2': $('toss', '1'),

        // direct focus 
        c: $.focus('Google Chrome'),
        s: $.focus('Sublime Text 2'),
        t: $.focus('iTerm'),
        f: $.focus('Finder'),
        n: $.focus('Sonos'),

        p: $.focus('PyCharm'),

        // utility functions
        f1: 'relaunch',
        z: 'undo',
        tab: 'hint',
    }
});


S.log('Slate: done loading config');