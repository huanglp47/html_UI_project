/*
* @Author: Administrator
* @Date:   2016-05-10 11:31:32
* @Last Modified by:   Administrator
* @Last Modified time: 2016-05-10 11:45:58
*/

'use strict';
(function(){
    var Bcontroller = (function(){

        var initDom = {

            $monthSelcet: $('#month'),

            $yearSelect: $('#year'),

            'selectHtml': '<option value="{{num}}">{{num}}</option>',

            init: function(){
                this.initSelctYear();
                this.initSelctMonth();

                this.bindEvent();
            },

            initSelctYear: function(){
                var getCurrentYear = parseInt(this.getCurrentType('y')),
                    _html = '',
                    _i,
                    startYear = 2014,
                    me = this;
                for(var i=0; i<=getCurrentYear-startYear; i++){
                    _html += (me.selectHtml).replace(/{{num}}/ig, getCurrentYear-i);
                }
                me.$yearSelect.html(_html);
            },

            initSelctMonth: function(){
                var lastMonth = parseInt(this.getCurrentType('m'))-1;
                var currentYears = parseInt(this.getCurrentType('y'));
                var selectYearsVal = this.$yearSelect.val();
                var _html = '',
                    _i,
                    me = this,
                    loopNum=12;
                if(selectYearsVal == currentYears) {
                    loopNum = parseInt(lastMonth);
                };
                for(var i=0; i<loopNum; i++){
                    _i = me.isBelowTen(i+1);
                    _html += (me.selectHtml).replace(/{{num}}/ig, _i);
                }
                me.$monthSelcet.html(_html);
            },

            bindEvent: function(){
                var me = this;
                $(document).on('change', '#year', function(){
                    me.initSelctMonth();
                })
            },

            isBelowTen: function(i){
                return parseInt(i)<10 ? '0' + i : i;
            },

		    getCurrentType: function(n){
		        var now = new Date();
		        if(n =='y'){
		            return now.getFullYear();
		        }else if(n == 'm'){
		            return now.getMonth() + 1;
		        }else if(n == 'd'){
		            return now.getDate();
		        }
		    }
        };
        return initDom;
    })();
    Bcontroller.init();
})();