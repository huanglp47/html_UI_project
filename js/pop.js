/*
 * @Author: Administrator
 * @Date:   2016-05-09 14:12:54
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-05-09 15:47:00
 */

'use strict';
var maskHtml = '<div class="dialog-mask"></div>';
var html = '<div class="dialog">' +
    '<div class="dialog-head layout-box">' +
    '<span class="dialog-title box-cols">{title}</span>' +
    '<a class="dialog-close" title="关闭" href="javascript:;">X</a>' +
    '</div>' +
    '<div class="dialog-body clearfix layout-box">{bodyHtml}</div>' +
    '<div class="dialog-btn layout-box">' +
    '<div class="box-cols dialog-btn-left-div"><a href="javascript:;" class="dialog-btn-left">{btnLeft}</a></div>' +
    '<div class="box-cols dialog-btn-right-div"><a href="javascript:;" class="dialog-btn-right">{btnRight}</a></div>' +
    '</div>'
'</div>';
var settings = {
    title: '默认标题',
    closeBtn: true,
    mask: true,
    bodyHtml: '这里是中文',
    btnLeft: '左边按钮',
    btnRight: '右边按钮',
    isMaskClickClose: false, //默认点击遮罩不关闭
    isAutoClose: 0 // 3000ms关闭，0为不自动关闭（默认不关闭）
};

function Dialog(opts) {
    this.opts = opts || {};
    this.options = $.extend({}, settings, this.opts);
    this.init();
};
Dialog.prototype = {
    init: function() {
        this.creatElem();
        this.bindEvent();
    },
    creatElem: function() {
        var _html = '',
            $obj = $('.dialog'),
            $body = $('body');
        $obj.length && $obj.remove();
        _html = html.replace(/{title}/, this.options.title)
            .replace(/{bodyHtml}/, this.options.bodyHtml)
            .replace(/{btnLeft}/, this.options.btnLeft)
            .replace(/{btnRight}/, this.options.btnRight)
        $body.append(_html);
        if (this.options.mask) {
            $body.append(maskHtml);
        }
        if (this.options.closeBtn) {
            $('.dialog-close').show();
        }
        if (this.options.btnLeft == '') {
            $('.dialog-btn-left-div').hide();
        }
        if (this.options.btnRight == '') {
            $('.dialog-btn-right-div').hide();
        }
        this.dialog = $('.dialog');
        if (this.options.height) {
            this.dialog.css('height', this.options.height)
        }
        //this.setPosition();
        if (this.options.isAutoClose) {
            this.autoClose();
        }
    },

    setPosition: function() {
        var objWidth = parseInt(this.dialog.width(), 10),
            objHeight = parseInt(this.dialog.height(), 10);
        this.dialog.css({
            marginLeft: (-objWidth) / 2,
            marginTop: (-objHeight) / 2
        });
    },

    bindEvent: function() {
        var self = this;

        //手机使用tap (zepto.js)
        $('.dialog-mask').on('click', function(e) {
            if (self.options.isMaskClickClose) {
                self.close();
            };
        });
        //手机使用tap (zepto.js)
        this.dialog
            .on("click", '.dialog-close', function() {
                self.close();
            }).on('click', '.dialog-btn-left-div', function() {
                self.close();
                self.options.leftBtnCallBack && self.options.leftBtnCallBack();
            }).on('click', '.dialog-btn-right-div', function() {
                self.close();
                if (self.options.rightBtnCallBack) {
                    self.options.rightBtnCallBack();
                }
            })
    },
    close: function() {
        this.dialog.remove();
        $('.dialog-mask').remove();
    },
    autoClose: function() {
        var self = this;
        var time = parseInt(this.options.isAutoClose, 10);
        setTimeout(function() {
            self.close();
        }, time)
    },
    show: function() {
        this.dialog.show();
    }
};
