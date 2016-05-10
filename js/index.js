/**
 * @Author: hlp47
 * @Date:   2015-05-02
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-05-10 11:48:02
 *
 * use: $('.J_progressbar').ceateProcessBar({
 *       billingStatus: 22, 
 *       id: 401,
 *       partnerId: 115
 *   });
 */
;
(function($, window, document, undefined) {

    //生成流程图html
    var stepContent = '<a href="javascript:;" class="btn check-btn">检查资料</a>';

    var firstBtnContent = '<a href="{{checkDataUrl}}" target="_blank" class="check-data">查看资料</a>';

    var completeHtml = '<p class="progress-info">完成</p>';

    var fileInputHtml = '<input type="file" class="uploadMemo">';

    var _html = '<li class="{{stepClass}}">' +
        '<div>' +
        '<h3>{{stepName}}</h3>' +
        '<span class="stepContent">' +
        '<p class="progress-info">等待</p>' +
        '</span>' +
        '</div>' +
        '<p class="progressLine"></p>' +
        '</li>';

    var CeateProcessBar = function(ele, options) {
        this.$ele = ele;
        this.defaults = {
            'stateArr': [
                { 'stateName': '资料审核', 'stepClass': 'yunyinshenhe', 'defaultState': 2 },
                { 'stateName': '费用审核', 'stepClass': 'duizhangdan', 'defaultState': 3 },
                { 'stateName': '财务审核', 'stepClass': 'caiwushenhe', 'defaultState': 22 },
                { 'stateName': '银行转账', 'stepClass': 'yinhangzhuanzhuang', 'defaultState': 23 },
                { 'stateName': '上传水单', 'stepClass': 'shangchuanshuidan', 'defaultState': 24 }
            ],
            'billingStatus': 2, //第n步，默认第一步
            'checkDataUrl': 'aaa/bbb/ccc',
            'activeClass': 'active' //默认className
        };
        this.settings = $.extend(this.defaults, options);

        //用state转化billingStatus，state为第几步
        this.settings.state = this.settings.billingStatus;
    };

    CeateProcessBar.prototype = {

        init: function() {
            this.createBar();

            this.bindEvent();
        },

        createBar: function() {
            var html = this.getDom();
            this.$ele.html(html);

            this.initStepBar();
        },

        initStepBar: function(n) {

            var state = n || this.getInitState();

            while (state > -1) {
                this.$ele.find('.stepContent:eq(' + state + ')').html(completeHtml);
                state--;
            }
            var index = (n + 1) || this.getInitState();
            this.$ele.find('.stepContent:eq(' + index + ')').html(stepContent);

            this.initcheckDataBtn();
        },

        initcheckDataBtn: function() {
            var url = this.settings.checkDataUrl + '?id=' + this.settings.id;
            var _firstBtnContent = firstBtnContent.replace(/{{checkDataUrl}}/ig, url);
            this.$ele.find('.stepContent:eq(0)').append(_firstBtnContent);
        },

        getDom: function() {
            var stateObj = this.settings.stateArr,
                html = '';
            for (var i = 0, len = stateObj.length; i < len; i++) {
                if (stateObj[i]) {
                    html += _html.replace(/{{stepName}}/ig, stateObj[i].stateName)
                        .replace(/{{stepClass}}/ig, stateObj[i].stepClass)
                }
            };
            return html;
        },

        getInitState: function() {
            var stateArr = this.settings.stateArr,
                currentState = this.settings.state;
            for (var i = 0, len = stateArr.length; i < len; i++) {
                if (stateArr[i].defaultState == currentState) {
                    return i
                }
            };
            return 0 //映射关系不存在应该返回-1，但这里返回0默认第一步
        },

        setState: function(index) {
            if (0 < index || index <= this.settings.stateArr.length) {
                this.initStepBar(index);
            }
        },

        synState: function(index) {
            if (index >= this.settings.stateArr.length - 1) {
                return
            }
            this.settings.state = this.settings.stateArr[index + 1].defaultState;
        },

        bindEvent: function() {
            var me = this;

            $(document).on('click', '.check-btn', function() {
                var index = me.getInitState();
                // if(index == 4){ //最后一个弹出上传文件窗口

                // }else{
                	me.PopWindow(index);
               // }
            });
        },

        getPopHtml: function(index) {
            switch (index) {
                case 0:
                    return '<table>' +
                        '<caption>用户资料不完整</caption>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>渠道分成比例</td>' +
                        '<td>5%</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>渠道分成比例</td>' +
                        '<td>5%</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td>渠道分成比例</td>' +
                        '<td>5%</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>';
                case 1:
                    return '';
                default:
                    return '';
            }
        },

        PopWindow: function(index) {
            var me = this;
            switch (index) {
                case 0:
                    var ziliaoshenhe_html = this.getPopHtml(index);
                    new Dialog({
                        title: '操作确认',
                        bodyHtml: ziliaoshenhe_html,
                        btnLeft: '确认',
                        btnRight: '点错了',
                        leftBtnCallBack: function() { //确定
                            me.saveChange(index);
                        },
                        rightBtnCallBack: function() { //留在当前页
                            //todo...
                        }
                    });
                    break;
                case 1:
                    if (confirm('审核无误？')) {
                        me.saveChange(index);
                    }
                    break;
                case 2:
                    if (confirm('审核无误？')) {
                        me.saveChange(index);
                    }
                    break;
                case 3:
                    if (confirm('已转账')) {
                        me.saveChange(index);
                    }
                    break;
                case 4:
                    me.saveChange(index);
                    break;
                default:
                    console.log('Error!');
                    break;
            }

        },

        saveChange: function(index) {
            // TODO 模拟保存步骤
            var me = this;
            $.ajax({
                    url: 'partnerBilling/opPartnerBillingWorkflow.action',
                    type: 'GET',
                    data: {
                        'id': this.settings.id,
                        'billingStatus': this.settings.billingStatus,
                        'op': 1
                    }
                })
                .done(function(data) {
                    console.log("success");

                    // if(data.state == 0){

                    // }
                })
                .fail(function(data) {
                    console.log("error");
                })
                .always(function(data) {
                    console.log("complete");

                    // TODO
                    me.setState(index);
                    me.synState(index);
                    console.log("current state is:" + me.settings.state);
                });

        }
    };

    $.fn.ceateProcessBar = function(options) {
        var myProcessBar = new CeateProcessBar(this, options);

        return myProcessBar.init();
    };

})(jQuery, window, document);

$(function() {
    $(document).on('click', '.createBarBtn', function() {
        $('.J_progressbar').ceateProcessBar({
        	billingStatus: 2,
            id: 401,
            partnerId: 115
        });
    });

    // 2, "资料审核"
    // 3, "费用审核"
    // 22, "财务审核"
    // 23, "银行转账"
    // 24, "上传水单"
    // $('.J_progressbar').ceateProcessBar({
    //     billingStatus: 2,
    //     id: 401,
    //     partnerId: 115
    // });
});
