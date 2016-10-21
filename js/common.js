function Admin() {
    _that = this;
}
Admin.prototype = {
    constructor: Admin,
    init: function() {
        localStorage.clear(); //缓存清除
        this.getData("", "mallBackControlAction!getLoginSession", function(data) {
            if (data && data.MENU_MAP && data.MENU_MAP.responseData && data.MENU_MAP.responseData.data && !$.isEmptyObject(data.MENU_MAP.responseData.data)) {
                _that.readInfoRender(data.MENU_MAP.responseData.data);
                $(".EV-nickName").text(data.USER_NAME);
                $(".EV-roleName").text(data.ROLE_NAME_LIST)
            } else {
                // 未成功返回数据,跳转至登录页
                window.location.href = '../admin/login.html';
            }
        });
        initCalendar(); //首页日历加载
        refreshDate(); //首页星期
        this.logOut();
        //站点信息配置
        this.setSites();
        this.resizeTable();
    },
    //获取数据,并执行回调
    getData: function(params, url, fn) {
        $.ajax({
            url: url,
            type: 'post',
            data: params,
            async: false,
            beforeSend: function(XHR) {
                $("#uploadingBox").show();
            },
            error: function(xhr) {
                console.log("错误提示： " + xhr.status + " " + xhr.statusText);
            },
            success: function(data) {
                if (typeof fn == "function") {
                    fn(data);
                }
                $("#uploadingBox").hide();
            },
            complete: function(XMLHttpRequest, textStatus) {

            }
        });
    },
    // 退出
    logOut: function() {
        $("#EV-logOut").click(function() {
            if (confirm('您确定要退出系统吗？')) {
                localStorage.clear();
                window.parent.location = "mallBackControlAction!logout"
            }
        });
    },
    //表格配置
    config: {
        "pageOperation": {}
    },
    //对应的方法配置
    fnConfig: {},
    setSites: function() {
        var sitesInfo = sites.map(function(element, index) {
            return ' <option value="' + element.id + '">' + element.siteName + '</option>'
        });
        localStorage.setItem("sitesSelsctOptions", sitesInfo);
    },
    // 配置菜单选项
    readInfoRender: function(menuMap) {
        var menuDiv = "";
        var i = 0;
        //菜单图标
        var menuIcon = ['fa-user-md', 'fa-medkit', 'fa-ambulance', 'fa-h-square', 'fa-plus-square', ' fa-hospital-o', 'fa-stethoscope'];
        for (x in menuMap) {
            menuDiv += '<li class="treeview"><a href="#" title="' + menuMap[x].oneTree.systemCode + '"><i class="fa ' + menuIcon[i++] + '"></i> <span>' + menuMap[x].oneTree.systemName + '</span><i class="fa fa-angle-left pull-right"></i></a>';
            if (menuMap[x].childMap) {
                menuDiv += '<ul class="treeview-menu" style="display: none;">';
                for (y in menuMap[x].childMap) {
                    menuDiv += '<li><a href="#"><i class="fa fa-ambulance"></i>' + menuMap[x].childMap[y].twoTree.menuName + '<i class="fa fa-angle-left pull-right"></i></a>';
                    if (menuMap[x].childMap[y].childMap) {
                        menuDiv += '<ul class="treeview-menu">';
                        for (z in menuMap[x].childMap[y].childMap) {
                            menuDiv += '<li data-role="menu-item" clickFlag=1  data-tab="' + menuMap[x].childMap[y].childMap[z].threeTree.menuId + '"><a href="javascript:;" data-url="' + menuMap[x].childMap[y].childMap[z].threeTree.moduleUrl + '"><i class="fa fa-hand-o-right"></i> ' + menuMap[x].childMap[y].childMap[z].threeTree.menuName + '</a></li>';
                            //权限写入
                            var pageOperationList = menuMap[x].childMap[y].childMap[z].threeTree.pageOperation;
                            //对应菜单且存在权限
                            if (pageOperationList != "") {
                                admin.config.pageOperation[menuMap[x].childMap[y].childMap[z].threeTree.menuId] = pageOperationList.substring(0, pageOperationList.length - 1).split(",");
                            }
                        }
                        menuDiv += '</ul>';
                    }
                    menuDiv += '</li>';
                }
                menuDiv += '</ul>';
            }
            menuDiv += '</li>';
        }
        $(".sidebar-menu", ".main-sidebar").html(menuDiv);
        this.getHtmlContent();
        return false;
    },
    //为表格添加有效或无效按钮,支持单选 多选
    //tableId   表格id
    //ajaxUrl   ajaxurl
    //isValid    1:有效 0: 无效
    //DataId    获取id对应的参数 如:"voteId", 默认为 "id"
    addValidBtn: function(tableId, ajaxUrl, isValid, DataId) {
        if (isValid == 1) {
            $("#t_" + tableId).append('<button type="button" data-tableid="' + tableId + '" class="btn btn-primary icon-btn-valid ctrl-icon btn-xs"><span class="fa fa-plus-square" style="vertical-align: middle;"></span><span style="vertical-align: middle;padding-left:5px">有效</span></button>');
            var ValidClass = "icon-btn-valid";
        } else if (isValid == 0) {
            $("#t_" + tableId).append('<button type="button" data-tableid="' + tableId + '" class="btn btn-primary icon-btn-invalid ctrl-icon btn-xs"><span class="fa fa-plus-square" style="vertical-align: middle;"></span><span style="vertical-align: middle;padding-left:5px">无效</span></button>');
            var ValidClass = "icon-btn-invalid";
        }
        $("." + ValidClass, "#t_" + tableId).click(function() {
            var ajaxData = {};
            //var ids = $("#"+tableId).jqGrid('getGridParam', 'selarrrow').join(",");
            var $table = $("#" + tableId);
            var isMultiselect = $table.jqGrid('getGridParam', 'multiselect'); //是否多选
            var id = DataId || "id";
            if (isMultiselect) { //多选
                var selarrrow = $table.jqGrid('getGridParam', 'selarrrow');
                var ids = [];
                for (x in selarrrow) {
                    var rowData = $table.jqGrid('getRowData', selarrrow[x]);
                    if (rowData[id]) {
                        ids.push(rowData[id])
                    }
                }
            } else { //单选
                var gsr = $table.jqGrid('getGridParam', 'selrow');
                var rowData = $table.jqGrid('getRowData', gsr);
                ids = rowData[id];
            }

            if (ids != "" && ids != null) {
                if (isMultiselect) { //多选
                    ajaxData.ids = ids.join(",");
                } else {
                    ajaxData.ids = ids;
                }
                ajaxData.isValid = isValid;
                admin.getData(ajaxData, ajaxUrl, function(data) {
                    admin.tipsPanel({
                        titleText: '成功',
                        contentText: '设置成功！'
                    });
                    if (isMultiselect) {
                        ids = [];
                    } //多选
                    $("#" + tableId).trigger('reloadGrid');
                });
            } else {
                admin.tipsPanel({
                    titleText: '警告',
                    contentText: '请选择一行！'
                });
            }
            return;
        });
    },
    //模态框自适应宽度
    autoModalFormWidth: function(id) {
        $('#' + id).on('shown.bs.modal', function(e) {
            var w = $(this).width() * 0.78;
            $(this).find(".ui-jqgrid-btable").setGridWidth(w);
        });
    },
    /*
     *@method 提示弹框
     * @param textObj object
     * titleText:标题文本内容 string
     * contentText:主文本内容 string
     */
    tipsPanel: function(textObj) {
        var ele = $(".tips-panel");
        ele.addClass("show");
        ele.find(".panel-title").html(textObj.titleText);
        ele.find(".panel-body").html(textObj.contentText);

        window.setTimeout(function() {
            ele.removeClass("show");
        }, 5000);

        $(".closeBtn").on("click", function(event) {
            event.stopPropagation();
            ele.removeClass("show");
        });
    },
    //如果表格为空,清空空白行 //添加在loadComplete事件内
    delEmptyLine: function(id) {
        var ids = $("#" + id).jqGrid('getDataIDs');
        var rowData = $("#" + id).jqGrid('getRowData', ids[0]);
        var isEmpty = true;
        for (x in rowData) {
            if (rowData[x]) {
                isEmpty = false;
                break;
            }
        }
        if (isEmpty) {
            $("#" + id).jqGrid("clearGridData");
        }
    },
    //@method:uiBtnTips 表格底部按钮hover显示提示语
    uiBtnTips: function() {
        var tipsBox, title;
        $(".ui-pg-button").each(function(index, element) {
            title = $(this).attr("title");
            tipsBox = $("<span class='uiBtn-tips'></span>");
            if (typeof($(this).attr("title")) === "undefined") {
                return;
            } else {
                tipsBox.html(title);
                tipsBox.appendTo($(this));
            }
            $(this).removeAttr("title");
        });
    },
    // 仅能输入数字
    isNumber: function(keyCode) {
        // 数字
        if (keyCode >= 48 && keyCode <= 57) return true;
        // 小数字键盘
        if (keyCode >= 96 && keyCode <= 105) return true;
        // Backspace, del, 左右方向键
        if (keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39) return true;
        return false
    },
    //动态获取html内容
    getEle: function(id, dataUrl) {
        var info = "";
        $.ajax({
            url: "../admin/content/" + id + ".html",
            type: 'post',
            async: false,
            error: function(xhr) {
                info = '<div class="row row-content" data-tab=' + id + '>' +
                    '<div class="col-md-12">' +
                    '<div class="tab-pane active" id="tab_' + id + '">' +
                    '<iframe width=100% height=900 frameborder=0 scrolling=auto src="' + domain.getRootPath() + '/' + dataUrl + '"></iframe>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            },
            success: function(data) {
                info = data;
            }
        });
        return $(info);
    },
    //为表格添加删除按钮
    addDelBtn: function(tableId, ajaxUrl, isValid) {
        if (isValid == 1) {
            $("#t_" + tableId).append('<button type="button" data-tableid="' + tableId + '" class="btn btn-primary icon-btn-valid ctrl-icon btn-xs"><span class="fa fa-plus-square" style="vertical-align: middle;"></span><span style="vertical-align: middle;padding-left:5px">有效</span></button>');
            var ValidClass = "icon-btn-valid";
        } else if (isValid == 0) {
            $("#t_" + tableId).append('<button type="button" data-tableid="' + tableId + '" class="btn btn-primary icon-btn-invalid ctrl-icon btn-xs"><span class="fa fa-plus-square" style="vertical-align: middle;"></span><span style="vertical-align: middle;padding-left:5px">删除</span></button>');
            var ValidClass = "icon-btn-invalid";
        }
        $("." + ValidClass, "#t_" + tableId).click(function() {
            var ajaxData = {};
            //var ids = $("#"+tableId).jqGrid('getGridParam', 'selarrrow').join(",");
            var $table = $("#" + tableId);
            var selarrrow = $table.jqGrid('getGridParam', 'selarrrow');
            var ids = [];
            for (x in selarrrow) {
                var rowData = $table.jqGrid('getRowData', selarrrow[x]);
                if (rowData["id"]) {
                    ids.push(rowData["id"])
                }
            }
            if (ids != "" && ids != null) {
                ajaxData.id = ids.join(",");
                ajaxData.isValid = isValid;
                admin.getData(ajaxData, ajaxUrl, function(data) {
                    admin.tipsPanel({
                        titleText: '成功',
                        contentText: '设置成功！'
                    });
                    ids = [];
                    $("#" + tableId).trigger('reloadGrid');
                });
            } else {
                admin.tipsPanel({
                    titleText: '警告',
                    contentText: '请选择一行！'
                });
            }
            return;
        });
    },
    //@method:chooseLastSave(@param1,@param2,@param3)操作后选中新增的数据
    //@param1:tableId(string) 表格的ID
    //@param2:postData(Object)搜索发送数据
    //@param3:loadCompleteFn(function)默认的加载完成的函数

    chooseLastSave: function(tableId, postData, loadCompleteFn) {
        $("#" + tableId).jqGrid('setGridParam', {
            postData: postData, //发送数据
            page: 1,
            loadComplete: function(data) {
                $(this).jqGrid('setSelection', $(this).jqGrid('getDataIDs')[0]);
            }
        }).trigger('reloadGrid').trigger('reloadGrid').jqGrid('setGridParam', {
            loadComplete: loadCompleteFn
        });
    },
    getHtmlContent: function() {
        $("li[data-role] a").on("click", function() {
            var that = $(this);
            var dataTab = $(this).parent().attr('data-tab');
            var dataUrl = $(this).attr("data-url");
            //var htmlResult = htmlList(dataTab, dataUrl);
            var tabText = $(this).text();
            var lastTab;
            if ($(this).parent().attr("clickFlag") === "0") {
                $("#Ev-ContentBox .row-content[data-tab=" + dataTab + "]").remove();
                $("#Ev-NavbarTab li[data-tab=" + dataTab + "]").remove();
            }
            $(this).tabsCreate({
                tabs: {
                    box: $("#Ev-NavbarTab"),
                    ele: $('<li class="" data-tab=' + dataTab + ' id="'+ dataTab +'"><a href="##" data-toggle="tab" aria-expanded="true"><i class="tabCloseBtn fa fa-close (alias)"></i>' + tabText + '</a></li>'),
                    createCallback: function() {
                        $("#Ev-NavbarTab li").removeClass('active');
                        $("#Ev-NavbarTab li[data-tab=" + dataTab + "]").addClass('active');

                        _that.tabsChange(that.parent());
                    },
                    deleteCallback: function() {
                        lastTab=$("#Ev-NavbarTab li:last-child").attr("data-tab");
                        $("#Ev-NavbarTab li:last-child").addClass("active");
                    }
                },
                contentList: {
                    box: $("#Ev-ContentBox"),
                    ele: admin.getEle(dataTab, dataUrl),
                    createCallback: function() {
                        if (admin.config.hasOwnProperty(dataTab)) {
                            //表格的初始化
                            for (x in admin.config[dataTab]) {
                                $("#" + admin.config[dataTab][x].tableID).jqGrid(admin.config[dataTab][x].tableConfig).jqGrid('navGrid', "#" + admin.config[dataTab][x].tableConfig.pager, admin.config[dataTab][x].pagerConfig).jqGrid("setGridParam", {
                                    "dataTab": dataTab
                                });
                            }
                            //主表的权限的读取,按钮添加,按照权限表的顺序
                            for (x in ToolBarList) {
                                if (admin.config.pageOperation[dataTab].indexOf(x)> -1) {
                                    //自定义按钮添加
                                    $("#t_" + admin.config[dataTab].tableMain.tableID).append('<button type="button" data-tableid="' + admin.config[dataTab].tableMain.tableID + '" class="btn btn-primary ctrl-icon btn-xs ' + ToolBarList[x].buttonicon + '"><span class="fa fa-plus-square" style="vertical-align: middle;"></span><span style="vertical-align: middle;padding-left:5px">' + ToolBarList[x].text + '</span></button>');
                                }
                            }
                        }
                        //初始化方法配置
                        if (admin.fnConfig.hasOwnProperty(dataTab)) {
                            admin.fnConfig[dataTab](dataTab);
                        }
                        var activeId = $('#Ev-NavbarTab li.active').attr("data-tab");
                        $("#Ev-ContentBox .row-content").hide();
                        $("#Ev-ContentBox .row-content[data-tab=" + activeId + "]").show();

                        _that.tabsChange(that.parent());
                        //admin.autoModalFormWidth("myModal"); //模态框自适应
                    },
                    deleteCallback: function() {
                        $("#Ev-ContentBox .row-content[data-tab="+lastTab+"]").show().addClass('row-content-show');
                    }
                }
            });
            $("#Ev-NavbarTab li").on("click", function(e) {
                _that.tabsChange($(this));

            });
            _that.innerContentWidth(); // 内容区域表格宽度自适应
            _that.uiBtnTips(); //表格底部按钮hover显示提示语
            _that.timeRanger(); //日期插件
        });
    },

    //主内容部分tab切换时对表格宽度进行调整
    innerContentWidth: function() {
        var tabs = $(".inner-content .nav-tabs li");
        var contentId;
        tabs.on("click", function(e) {
            contentId = $(this).attr("data-tab");

            $("#" + contentId + " .ui-jqgrid-btable").setGridWidth($(".row-content-show .tab-inner-content").width());
        })
    },
    //tabs切换功能
    tabsChange: function(ele) {
        var tabId = ele.attr("data-tab");
        var contentContainer = $("#Ev-ContentBox .row-content[data-tab=" + tabId + "] .inner-content");
        var formContainer = $("#Ev-ContentBox .row-content[data-tab=" + tabId + "] [role='listBox-title']");
        var listPart = parseInt($("#Ev-ContentBox .row-content[data-tab=" + tabId + "] .inner-form").attr("data-listPart"));
        $("#Ev-ContentBox .row-content").hide().removeClass("row-content-show");
        $("#Ev-ContentBox .row-content[data-tab=" + tabId + "]").show().addClass("row-content-show");

        //宽度自适应
        if (listPart === 1) {
            $(".inner-form .ui-jqgrid-btable").setGridWidth(formContainer.width());
        } else {
            $(".inner-form .ui-jqgrid-btable").setGridWidth(formContainer.width());
        }

        $(".inner-content .ui-jqgrid-btable").setGridWidth(contentContainer.width());


    },
    //input点击显示微型日历
    timeRanger: function() {
        //加载小型日历
        var startTime, endTime,startTimeShort,endTimeShort,
            that = this;
        $(".resetBtn").on("click", function () {
            startTimeShort=undefined;
            endTimeShort=undefined;
            $('.startTimeShort').datetimepicker('remove');
            $('.endTimeShort').datetimepicker('remove');
            datetimepickerInit();
        });
        
        $(".resetBtnFull").on("click",function(){
        	startTime=undefined;
            endTime=undefined;
            $('.startTime').datetimepicker('remove');
            $('.endTime').datetimepicker('remove');
            fullDatetimepickerInit();
        });
        
        datetimepickerInit();
        function datetimepickerInit(){
            $(".startTimeShort,.endTimeShort").on("keydown",function(){
                return false;
            });
            $('.startTimeShort').datetimepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                startView:"month",
                minView: 'month',
                language: 'zh-CN'
            }).on("changeDate", function(e) {
                startTimeShort = e.date.valueOf();
                if (e.date.valueOf() > endTimeShort) {
                    that.tipsPanel({
                        titleText: "错误",
                        contentText: "结束日期不能小于开始日期！"
                    });
                    $(this).val("");
                    startTimeShort = undefined;
                    return false;
                }
            });
            $('.endTimeShort').datetimepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                startView:"month",
                minView: 'month',
                language: 'zh-CN'
            }).on("changeDate", function(e) {
                endTimeShort = e.date.valueOf();
                if (e.date.valueOf() < startTimeShort) {
                    that.tipsPanel({
                        titleText: "错误",
                        contentText: "结束日期不能小于开始日期！"
                    });
                    $(this).val("");
                    endTimeShort =undefined;
                    return false;
                }
            });
        }
        
        fullDatetimepickerInit();
        function fullDatetimepickerInit(){
        	$('.startTime').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN'
            }).on("changeDate", function(e) {
                startTime = e.date.valueOf();
                if (e.date.valueOf() > endTime) {
                    that.tipsPanel({
                        titleText: "错误",
                        contentText: "结束日期不能小于开始日期！"
                    });
                    $(this).val("");
                    startTime = undefined;
                    endTime = undefined;
                    return false;
                }
            });
        	$('.endTime').datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN'
            }).on("changeDate", function(e) {
                endTime = e.date.valueOf();
                if (e.date.valueOf() < startTime) {
                    that.tipsPanel({
                        titleText: "错误",
                        contentText: "结束日期不能小于开始日期！"
                    });
                    $(this).val("");
                    endTime = undefined;
                    return false;
                }
            });
        }
        //会议去掉秒
        conFullDatetimepickerInit();
        function conFullDatetimepickerInit(){
        	$('.startTime_con').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN'
            }).on("changeDate", function(e) {
                startTime = e.date.valueOf();
                if (e.date.valueOf() > endTime) {
                    that.tipsPanel({
                        titleText: "错误",
                        contentText: "结束日期不能小于开始日期！"
                    });
                    $(this).val("");
                    startTime = undefined;
                    endTime = undefined;
                    return false;
                }
            });
        	$('.endTime_con').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN'
            }).on("changeDate", function(e) {
                endTime = e.date.valueOf();
                if (e.date.valueOf() < startTime) {
                    that.tipsPanel({
                        titleText: "错误",
                        contentText: "结束日期不能小于开始日期！"
                    });
                    $(this).val("");
                    endTime = undefined;
                    return false;
                }
            });
        }
    },
    //@method:input select组合框 select值打印至对应的
    selectInputGroup: function() {
        var value = "",
            parentBox = $(".select-input-btnGroup");
        $(".select-input-btnGroup select").on('change', function(event) {
            value = $(this).find('option:selected').text();
            parentBox.find('input.form-control').val(value);
        });
    },
    //@method:selectedPush(@param1,@param2,@param3)获取下拉菜单中选中的值，并打印进目标textarea
    //@param1:pushSelect(jQuery Object)选中的下拉菜单
    //@param2:getTextarea(jQuery Object)接收选中内容的textarea
    //@param3:deleteBtn(jQuery Object)用以清空textarea内容的按钮
    selectedPush: function(pushSelect, getTextarea, deleteBtn) {
        var selected;
        var contentArr = [];
        pushSelect.on('change', function(event) {
            contentArr = getTextarea.val().split("\n");
            selected = $(this).find("option:selected").text();
            if (selected.length === 0) {
                return;
            }
            event.preventDefault();
            pushSelectedText(selected);
        });
        deleteBtn.on("click", function(e) {
            e.preventDefault();
            getTextarea.val("");
            contentArr = [];
            pushSelect.find("option:selected").removeAttr('selected');
        });

        function pushSelectedText(value) {
            for (var i = 0, len = contentArr.length; i < len; i++) {
                if (contentArr[i] === value) {
                    return;
                }
            }
            var nowValue = (getTextarea.val().length === 0) ? getTextarea.val() : getTextarea.val() + "\n";
            getTextarea.val(nowValue + value);
            contentArr = getTextarea.val().split('\n')
        }
    },

    //ztree 相关函数
    idList: [],
    queryParentInfoList: function(myPropertyTypeId, treeId) {
        var treeNodeMeds = [];
        var setting = {
            isSimpleData: true, //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id", //在isSimpleData格式下，当前节点id属性
            treeNodeParentKey: "pId",
            showLine: true, //是否显示节点间的连线
            checkable: true,
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {
                    "Y": "",
                    "N": ""
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            }, //每个节点上是否显示 CheckBox
            callback: {
                onCheck: function(e, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    var nodes = treeObj.getCheckedNodes(true);
                    var v = "";
                    _that.idList.length = 0;
                    for (var i = 0; i < nodes.length; i++) {
                        v += nodes[i].name + ",";
                        _that.idList.push(nodes[i].kId);
                    }
                }
            }
        };
        var propertyTypeId = $("#" + myPropertyTypeId).val();
        var propertyName = "";
        //var  propertyName = $("#propertyTypeId").find("option:selected").text();
        if (localStorage.getItem("propertyTypeId" + propertyTypeId) == null) {
            $.ajax({
                async: false,
                cache: false,
                type: 'POST',
                dataType: "json",
                //url:"commDataPropertyAction!getTreeId?propertyName=&propertyTypeId=2",
                url: "commDataPropertyAction!getTreeId?propertyName=" + propertyName + "&propertyTypeId=" + propertyTypeId, //请求的action路径
                error: function() { //请求失败处理函数
                    alert('查询条件不匹配或获取父类节点失败！');
                },
                //beforeSend:ajaxLoading("加载中,请稍候。。。"),//发送请求前打开进度条
                success: function(data) { //请求成功后处理函数。
                    //ajaxLoadEnd();// 任务执行成功，关闭进度条
                    newKid = data[0].total;
                    treeNodeMeds = data; //把后台封装好的简单Json格式赋给treeNodes
                    localStorage.setItem("propertyTypeId" + propertyTypeId, JSON.stringify(data)); //存放缓存数据
                }
            });
        } else {
            treeNodeMeds = JSON.parse(localStorage.getItem("propertyTypeId" + propertyTypeId));
        }

        $.fn.zTree.init($("#" + treeId), setting, treeNodeMeds);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        //移除多选父节点
        var zTree = $.fn.zTree.getZTreeObj(treeId);

    },
    // zTree 定位功能
    positionBut: function(myPropertyTypeId, myPropertyName, treeId) {
        var propertyTypeId = $("#" + myPropertyTypeId).val();
        var propertyName = $("#" + myPropertyName).val();
        if (propertyTypeId && propertyName != null && propertyName != "") {
            $.ajax({
                cache: false,
                type: 'POST',
                dataType: "text",
                url: "commDataPropertyAction!positionBut?propertyName=" + propertyName + "&propertyTypeId=" + propertyTypeId, //请求的action路径
                error: function() { //请求失败处理函数
                    admin.tipsPanel({
                        titleText: '警告',
                        contentText: '获取节点失败！'
                    });
                },
                success: function(data) { //请求成功后处理函数。
                    if (data == 'no') {
                        admin.tipsPanel({
                            titleText: '警告',
                            contentText: '定位失败，当前资源属性类型不存在该节点！'
                        });
                    } else {
                        _that.idList.length = 0;
                        var arr = data.split(",");
                        //默认展开选中
                        var zTree = $.fn.zTree.getZTreeObj(treeId);
                        //折叠所有节点
                        zTree.setting.view.expandSpeed = "";
                        zTree.expandAll(false);
                        zTree.setting.view.expandSpeed = "fast";
                        //取消选中
                        zTree.cancelSelectedNode();
                        for (var i = 0; i < arr.length; i++) {
                            zTree.selectNode(zTree.getNodeByParam("id", arr[i]), true);
                        }
                        //zTree.checkNode(zTree.getNodeByParam("id", data), true, true);
                        //idList.push(data);
                    }
                }
            });
        } else {
            admin.tipsPanel({
                titleText: "警告",
                contentText: "标签名称不能为空"
            });
        }
    },
    //查看全路径
    //propertyFullPathData    查询的数据
    //treeID                 html中ztee的ID
    queryParentInfo: function(propertyFullPathData, treeId) {
        var treeNodes = [];
        var setting = {
            isSimpleData: true, //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id", //在isSimpleData格式下，当前节点id属性
            treeNodeParentKey: "pId",
            showLine: true, //是否显示节点间的连线
            checkable: true,
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            } //每个节点上是否显示 CheckBox
        };
        var search = '';
        if (propertyFullPathData != null && propertyFullPathData != "") {
            search = propertyFullPathData;
        } else {
            admin.tipsPanel({
                titleText: '友好提示',
                contentText: '当前节点为空,父类节点不可查看！'
            });
            return;
        }

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            dataType: "json",
            url: "commDataPropertyAction!listForSelect?propertyFullPath=" + search, //请求的action路径
            error: function() { //请求失败处理函数
                alert('获取父类节点失败！');
            },
            success: function(data) { //请求成功后处理函数。
                treeNodes = data; //把后台封装好的简单Json格式赋给treeNodes
            }
        });

        $.fn.zTree.init($("#" + treeId), setting, treeNodes);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeObj.expandAll(true); //展开全部节点
        //
        //$("#case_ParentInfoTree").show();
        //$("#case_ParentInfoTree").dialog({
        //    title: '父类节点>>',
        //    height: 300,
        //    width: 200,
        //    modal: true
        //});
    },
    
 // 医栈 标签
    medIdList: [],
    medQueryParentInfoList: function(myPropertyTypeId, treeId) {
        var treeNodeMeds = [];
        var setting = {
            isSimpleData: true, //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id", //在isSimpleData格式下，当前节点id属性
            treeNodeParentKey: "pId",
            showLine: true, //是否显示节点间的连线
            checkable: true,
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: {
                    "Y": "",
                    "N": ""
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            }, //每个节点上是否显示 CheckBox
            callback: {
                onCheck: function(e, treeId, treeNode) {
                    var treeObj = $.fn.zTree.getZTreeObj(treeId);
                    var nodes = treeObj.getCheckedNodes(true);
                    var v = "";
                    _that.medIdList.length = 0;
                    for (var i = 0; i < nodes.length; i++) {
                        v += nodes[i].name + ",";
                        _that.medIdList.push(nodes[i].kId);
                    }
                }
            }
        };
        var propertyTypeId = $("#" + myPropertyTypeId).val();
        var propertyName = "";
        if (localStorage.getItem("medPropertyTypeId" + propertyTypeId) == null) {
            $.ajax({
                async: false,
                cache: false,
                type: 'POST',
                dataType: "json",
                url: "medCommPropertyAction!getTreeId?propertyName=" + propertyName + "&propertyType=" + propertyTypeId,
                error: function() { //请求失败处理函数
                	admin.tipsPanel({
                        titleText: '警告',
                        contentText: '查询条件不匹配或获取父类节点失败！'
                    });
                },
                success: function(data) { //请求成功后处理函数。
                    newKid = data[0].total;
                    treeNodeMeds = data; //把后台封装好的简单Json格式赋给treeNodes
                    localStorage.setItem("medPropertyTypeId" + propertyTypeId, JSON.stringify(data)); //存放缓存数据
                }
            });
        } else {
            treeNodeMeds = JSON.parse(localStorage.getItem("medPropertyTypeId" + propertyTypeId));
        }

        $.fn.zTree.init($("#" + treeId), setting, treeNodeMeds);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        //移除多选父节点
        var zTree = $.fn.zTree.getZTreeObj(treeId);

    },
    // zTree 定位功能
    medPositionBut: function(myPropertyTypeId, myPropertyName, treeId) {
        var propertyTypeId = $("#" + myPropertyTypeId).val();
        var propertyName = $("#" + myPropertyName).val();
        if (propertyTypeId && propertyName != null && propertyName != "") {
            $.ajax({
                cache: false,
                type: 'POST',
                dataType: "text",
                url: "medCommPropertyAction!positionBut?propertyName=" + propertyName + "&propertyType=" + propertyTypeId, //请求的action路径
                error: function() { //请求失败处理函数
                    admin.tipsPanel({
                        titleText: '警告',
                        contentText: '获取节点失败！'
                    });
                },
                success: function(data) { //请求成功后处理函数。
                    if (data == 'no') {
                        admin.tipsPanel({
                            titleText: '警告',
                            contentText: '定位失败，当前资源属性类型不存在该节点！'
                        });
                    } else {
                        _that.medIdList.length = 0;
                        var arr = data.split(",");
                        //默认展开选中
                        var zTree = $.fn.zTree.getZTreeObj(treeId);
                        //折叠所有节点
                        zTree.setting.view.expandSpeed = "";
                        zTree.expandAll(false);
                        zTree.setting.view.expandSpeed = "fast";
                        //取消选中
                        zTree.cancelSelectedNode();
                        for (var i = 0; i < arr.length; i++) {
                            zTree.selectNode(zTree.getNodeByParam("id", arr[i]), true);
                        }
                    }
                }
            });
        } else {
            admin.tipsPanel({
                titleText: "警告",
                contentText: "标签名称不能为空"
            });
        }
    },
    //查看全路径
    //propertyFullPathData    查询的数据
    //treeID                 html中ztee的ID
    medQueryParentInfo: function(propertyFullPathData, treeId) {
        var treeNodes = [];
        var setting = {
            isSimpleData: true, //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id", //在isSimpleData格式下，当前节点id属性
            treeNodeParentKey: "pId",
            showLine: true, //是否显示节点间的连线
            checkable: true,
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            } //每个节点上是否显示 CheckBox
        };
        var search = '';
        if (propertyFullPathData != null && propertyFullPathData != "") {
            search = propertyFullPathData;
        } else {
            admin.tipsPanel({
                titleText: '友好提示',
                contentText: '当前节点为空,父类节点不可查看！'
            });
            return;
        }

        $.ajax({
            async: false,
            cache: false,
            type: 'POST',
            dataType: "json",
            url: "medCommPropertyAction!listForSelect?propertyFullPath=" + search, //请求的action路径
            error: function() { //请求失败处理函数
            	admin.tipsPanel({
                    titleText: '友好提示',
                    contentText: '获取父类节点失败！'
                });
            },
            success: function(data) { //请求成功后处理函数。
                treeNodes = data; //把后台封装好的简单Json格式赋给treeNodes
            }
        });

        $.fn.zTree.init($("#" + treeId), setting, treeNodes);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeObj.expandAll(true); //展开全部节点
    },
    InitXMLData: function(url) { //图形报表访问
        var u = url;
        var b;
        $.ajax({
            type: "post",
            url: u,
            dataType: 'text',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function(req) {
                b = req;
            }
        });
        return b;
    },
    previewVideoInfo: function(tableId, gsr, URL) { //视频预览功能
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        var $table = $("#" + tableId);
        var rowData = $table.jqGrid('getRowData', gsr);
        if (rowData) {
            videoRow = rowData;
            var rowUrl = '';
            var reqUrl = '';
            if (URL != null && URL != "") {
                rowUrl = URL;
                var suffix = videoRow['videoAttFormat']; //视频格式
                if (suffix == 'avi' || suffix == 'wmv') {
                    admin.tipsPanel({
                        titleText: '友好提示',
                        contentText: '暂不支持avi、wmv格式，请在转码后的视频进行预览!'
                    });
                } else {
                    if (rowUrl.indexOf('http') < 0) {
                        reqUrl = 'http://v.allinmd.cn/' + rowUrl;
                    } else {
                        reqUrl = rowUrl;

                    }
                    $.ajax({
                        type: "post",
                        url: "videoAction!isValidVideoUrl?path=" + reqUrl,
                        dataType: 'text',
                        contentType: 'application/json;charset=utf-8',
                        success: function callback(req) {
                            if (req == 'yes') {
                                flowplayer(
                                    "my52player",
                                    projectName + "/js/3player_plug/flowplayer-3.2.12.swf", {

                                        clip: {
                                            url: reqUrl,
                                            autoPlay: false,
                                            autoBuffering: true
                                        }
                                    });
                                $("#videoDetailModal").modal();
                                admin.autoModalFormWidth("videoDetailModal");
                            } else if (req == 'no') {
                                admin.tipsPanel({
                                    titleText: '友好提示',
                                    contentText: '该视频地址，源文件不存在!'
                                });

                            }
                        }
                    });

                }
            } else {
                admin.tipsPanel({
                    titleText: '友好提示',
                    contentText: '没有对应的图片路径！'
                });
            }
        } else {
            admin.tipsPanel({
                titleText: '警告',
                contentText: '请先选择一条记录！'
            });
        }

    },
    isNotNull: function(parameter) {
        if (parameter != null && parameter != "") {
            return true;
        }
        return false;
    },
    //数据格式封装
    getTableConfig: function(search) {
        var postData = {};
        postData.queryJson = JSON.stringify(search);
        var tableConfig = {};
        tableConfig.postData = postData;
        return tableConfig;
    },
    //通用请求
    initData :function (url){
    	var u = url;
    	var b;
    	$.ajax({
    		url : u,
    		dataType : 'json',
    		async :false,
    		success : function(req) {
    			b =eval(req);
    		}
    	});
    	return b;
    },
    //jqgrid判断编辑行数据是否为object、undefined
    isNotUndefined: function(parameter) {
        if (typeof (parameter)!="object" && typeof (parameter) != "undefined" && parameter != null) {
            return true;
        }
        return false;
    },
    resizeTable:function(){
    	$(".sidebar-toggle").on("click",function(e){
    		var tabRole=$("#Ev-NavbarTab .active").data("tab");
        	console.log(tabRole);
        	var activeBox=$(".row-content[data-tab="+tabRole+"]");
        	$(".main-sidebar").on("transitionend",function(e){
        		activeBox.find(".ui-jqgrid-btable").setGridWidth(activeBox.find(".inner-form").width());
        	});
    	});
    	
    },
    // html字符 转化为 实体字符
    htmlTranslate:function(str){
        var c = document.createElement('div');
        c.innerHTML = str;
        str = c.innerHTML;
        c = null;
        return str;
    }
};

//siteid 后期需要改为动态获取 //写入下拉框中
var sites = [{
    id: 1,
    siteName: '唯医官网'
}, {
    id: 2,
    siteName: '唯医手机'
}, {
    id: 3,
    siteName: 'CAOS'
}, {
    id: 4,
    siteName: 'CAOS手机'
}, {
    id: 5,
    siteName: 'IOS-APP'
}, {
    id: 6,
    siteName: 'Android'
}, {
    id: 7,
    siteName: 'CAOS-EN'
}, {
    id: 8,
    siteName: 'MED-IOS'
}, {
    id: 9,
    siteName: 'MED-Android'
}, {
    id: 10,
    siteName: ''
}, {
    id: 11,
    siteName: 'MED-H5'
}];

//双击事件写入下拉框
var sitesToString = "";
for (var i = 0; i < sites.length; i++) {
	if(sites[i].id!=10){
		sitesToString = sitesToString + sites[i].id + ":" + sites[i].siteName + ";";
	}
}
if (sitesToString.length > 0) {
    sitesToString = sitesToString.substring(0, sitesToString.length - 1);
}

//频道 栏目 推荐类型
var products = [{
    productid: 1,
    name: '推荐会员'
}, {
    productid: 2,
    name: '推荐视频'
}, {
    productid: 3,
    name: '推荐新闻'
}, {
    productid: 4,
    name: '推荐链接'
}, {
    productid: 5,
    name: '推荐文库'
}, {
    productid: 6,
    name: '推荐CAOS会员'
}, {
    productid: 7,
    name: '推荐病例'
}, {
    productid: 8,
    name: '推荐话题'
}, {
    productid: 9,
    name: '推荐TAG'
}, {
    productid: 10,
    name: '推荐会议'
}, {
    productid: 11,
    name: '推荐品牌（欧创）'
}, {
    productid: 12,
    name: '推荐产品（欧创）'
}, {
    productid: 13,
    name: '推荐广告位'
}];

var allImgFormat=new Array("jpg","png","jpeg");

var admin = new Admin();