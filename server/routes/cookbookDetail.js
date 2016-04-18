'use strict';
var vueServer = require("vue-server");
var fs = require('fs');
var request = require('request'); //第3方http请求的插件
var queryString = require('querystring'); //转换get参数的插件
var env_1 = require('../../env');
var Vue = new vueServer.renderer();
function index(req, res) {
    var cookbook_id = req.params.id;
    var vm, b, options;
    options = {
        method: 'GET',
        url: 'http://apis.baidu.com/tngou/cook/show?' + queryString.stringify({
            id: cookbook_id
        }),
        headers: {
            //百度API的开放接口凭证
            'apikey': 'a369f43a6392605426433831e10765ec'
        }
    };
    request(options, function (err, resp, body) {
        //这个接口 没有返回这个ID的title
        if (!err && resp.statusCode == 200) {
            b = JSON.parse(body);
            console.log(b.img);
            vm = new Vue({
                replace: false,
                template: fs.readFileSync(env_1.config.PATH_COOKBOOK + '/states/cookbook/template.html', 'utf-8'),
                data: {
                    cookbookDetail: b
                }
            });
        }
        vm.$on('vueServer.htmlReady', function (html) {
            res.render('layout', {
                server_html: html,
                server_data: "\n                    window.cm_cookbookDetail = " + JSON.stringify(b)
            });
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=cookbookDetail.js.map