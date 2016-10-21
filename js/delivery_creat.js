/**
 * Created by ALLIN on 2016/10/11.
 */
var buildAdStep = {};
buildAdStep.config = {
    "sortId":null,
    "creativeNum":null
};
buildAdStep.method = {};
var methodFunction = buildAdStep.method;
methodFunction.creatAdPlan = function(showWhich,data){
    var positionTitleTargetObj = $("#_content_crtsize2 .piclist .tips");
    var positionPicTargetObj = $("#_creativesslides_2");
    var positionCreativeTarget = $("#_content_crtsize2 .updata-sucai");
    var positionPicTargetStr = "";
    positionTitleTargetObj.html("<i class=\'icon ico-tips\'><i></i></i>"+data.position+"").attr({"title":data.position});
    for(var picNum=0;picNum<data.positionList.length;picNum++){
        positionPicTargetStr+="<li style=\'float: left; list-style: none; position: relative; width: 190px; margin-right: 10px;\'><p title=\'个人中心左下角广告位\'>"+data.positionList[picNum].title+"</p><div class=\'imgarea\'><img src=\'"+data.positionList[picNum].imgSrc+"\' style=\'width: 188.083px; height: 205px;\'>.<a href=\'javascript:;\' class=\'enlarge\' opt=\'crtsizepreview\' data-src=\'http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/160x210_01.jpg\' title=\'查看大图\'>大图</a></div></li>"
    }
    positionPicTargetObj.html(positionPicTargetStr);
    var liDemoBox = $("#ad-creative-demo li");
    if(showWhich==1){
        positionCreativeTarget.html("").append(liDemoBox.eq(0).clone()).append(liDemoBox.eq(2).clone());
    }else{
        positionCreativeTarget.html("").append(liDemoBox.eq(1).clone()).append(liDemoBox.eq(2).clone());
    }
    return $("#_content_crtsize2").removeClass("none");


};
methodFunction.editAdCreative = function(){
    var targetObjBox = $("#_content_crtsize2 .updata-sucai [id^=cabinet]");
    targetObjBox.each(function(){
        $(this).attr({"editRight":false});
        console.log(typeof $(this).attr("editRight"));
        $(this).find("._tnameEdit").unbind("click").bind("click",function(e){
            $(this).parent().addClass("none");
            $(this).parent().next().removeClass("none");
            e.stopPropagation();
        });
        $(".sucai-wenan textarea").each(function(){
            $(this).unbind("click").bind("click",function(e){
                e.stopPropagation();
            });
        });
        $("._tnameTextarea textarea").each(function(e){
            $(this).bind("input  propertychange",function(){
                var num = $(this).val().length;
                if(num<41){
                    $(this).parent().find(".somets strong").html(num).css({"color":"#909090"});
                    $(this).parent().find("._errtips").hide();
                    $(this).attr({"editRight":false});
                }else{
                    $(this).parent().find(".somets strong").html(num).css({"color":"#e33244"});
                    $(this).parent().find("._errtips").show();
                    $(this).attr({"editRight":true});
                }
            });
            $(this).unbind("click").bind("click",function(e){
                e.stopPropagation();
            });
            $(this).unbind("blur").bind("blur",function(){

            });
        });
    });
};
methodFunction.creatAdId = function(element,sortId,creativeId){

};
methodFunction.creatAdCreative = function(creatWhich){
    var creatAdTargetObj = $("#_content_crtsize2 .sucai-list-add");
    creatAdTargetObj.unbind("click").bind("click",function(){
        var liDemoBox = $("#ad-creative-demo li");
        if(buildAdStep.config.creativeNum<5){

            switch (creatWhich){
                case "1":
                    $(this).before(liDemoBox.eq(0).clone().attr({
                        "data-sortId":buildAdStep.config.sortId,
                        "id":"cabinet_2_"+buildAdStep.config.sortId
                    }));
                    methodFunction.creatAdId($("#cabinet_2_"+buildAdStep.config.sortId,buildAdStep.config.sortId));
                    buildAdStep.config.sortId++;
                    methodFunction.editAdCreative();
                    break;
                case "2":
                    $(this).before(liDemoBox.eq(1).clone().attr({
                        "data-sortId":buildAdStep.config.sortId,
                        "id":"cabinet_71_"+buildAdStep.config.sortId
                    }));
                    buildAdStep.config.sortId++;
                    methodFunction.editAdCreative();
                    break;
                default:
                    break;
            }
            buildAdStep.config.creativeNum++;
        }

    });

};
methodFunction.simulateSelect = function(){
    var targetObj = $("#show-chosen-result");
    var data = [
        {
        createTime: "2016-09-14 17:21:41.0",
        deliveryPlanId: 1473844895190,
        deliveryPlanLimitation: 100,
        deliveryPlanName: "广告计划1",
        deliveryPlanPublisher: "1",
        deliveryPlanState: 0,
        deliveryPlanType: 1,
        firstResult: 0,
        id: 37,
        ids: null,
        isValid: 1,
        maxResult: null,
        page: null,
        pageSize: null,
        sortId: 0,
        sortType: 0
    },{
        createTime: "2016-09-14 17:21:41.0",
        deliveryPlanId: 1473844895191,
        deliveryPlanLimitation: 100,
        deliveryPlanName: "广告计划2",
        deliveryPlanPublisher: "1",
        deliveryPlanState: 0,
        deliveryPlanType: 1,
        firstResult: 0,
        id: 38,
        ids: null,
        isValid: 1,
        maxResult: null,
        page: null,
        pageSize: null,
        sortId: 0,
        sortType: 0
    },{
        createTime: "2016-09-14 17:21:41.0",
        deliveryPlanId: 1473844895191,
        deliveryPlanLimitation: 100,
        deliveryPlanName: "广告计划3",
        deliveryPlanPublisher: "1",
        deliveryPlanState: 0,
        deliveryPlanType: 1,
        firstResult: 0,
        id: 39,
        ids: null,
        isValid: 1,
        maxResult: null,
        page: null,
        pageSize: null,
        sortId: 0,
        sortType: 0
    },{
        createTime: "2016-09-14 17:21:41.0",
        deliveryPlanId: 1473844895193,
        deliveryPlanLimitation: 100,
        deliveryPlanName: "广告计划4",
        deliveryPlanPublisher: "1",
        deliveryPlanState: 0,
        deliveryPlanType: 1,
        firstResult: 0,
        id: 40,
        ids: null,
        isValid: 1,
        maxResult: null,
        page: null,
        pageSize: null,
        sortId: 0,
        sortType: 0
    }];
    var planList = "<li>请选择</li>";
    for(var creatNum = 0;creatNum<data.length;creatNum++){
        planList+="<li class=\'show-select-iteam\'  deliveryPlanId=\'"+data[creatNum].deliveryPlanId+"\'>"+data[creatNum].deliveryPlanName+"</li>";
    }
    var creativeObj = $("#chosen-list");
    creativeObj.html(planList);
    targetObj.unbind("click").bind("click",function(e){
        creativeObj.toggleClass("none");
        $(this).find(".select-sign").toggleClass("select-ico");
        $("#chosen-list li").each(function(){
            $(this).unbind("click").bind("click",function(e){
                $("#show-chosen-result").html($(this).html()+"<span class=\'select-sign\'></span>").attr({"selectPlan":$(this).attr("deliveryPlanId")});
                $("#chosen-list").toggleClass("none");
                e.stopPropagation();
            });
        });
        e.stopPropagation();
    });
    $(document).unbind("click").bind("click",function(){
        creativeObj.addClass("none");
    });
};
methodFunction.postData = function(mode){
    var postData = {};
    var preDataBox = null;
    postData.queryJson = {};
    switch (mode){
        case "creativePlan":
            var creativePlanData = null;
            var deliveryAdTimeType = null;
            var deliveryAdStartTime = null;
            var deliveryAdEndTime = null;
            var adPlanResultObj = $("#show-chosen-result");
            var id = null;
            var deliveryAdId = null;
            var deliveryAdType = null;
            if($("#daterangecheck").attr("checked")){
                deliveryAdType = 2;
            }else{
                deliveryAdType = 1;
            }
            if($("#alltime0").attr("checked")){
                deliveryAdTimeType = 1;
                deliveryAdStartTime = "";
                deliveryAdEndTime = "";
            }else{
                deliveryAdTimeType = 2;
                deliveryAdStartTime = $("#stime").val();
                deliveryAdEndTime = $("#etime").val();
            }
            if(adPlanResultObj.attr("isPlanId")){
                id = adPlanResultObj.attr("isPlanId");
                deliveryAdId=adPlanResultObj.attr("isAdId");
            }else{
                id = 0;
                deliveryAdId=0;
            }
              creativePlanData = {
                  "deliveryAdStartTime":deliveryAdStartTime,
                  "deliveryAdEndTime":deliveryAdEndTime,
                  "deliveryAdTimeType":deliveryAdTimeType,
                  "deliveryAdId":deliveryAdId,
                  "id":id,
                  "deliveryAdType":deliveryAdType,
                  "deliveryAdStartDate":$("#dateinfo").val(),
                  "deliveryAdEndDate":$("#dateinfohd").val(),
                  "deliveryPlanId":adPlanResultObj.attr("selectPlan"),
                  "deliveryAdName":$("#ordername").val(),
                  "deliveryAdUrl":$("#orderlink").val(),
                  "deliveryPublisher":"1"//则是发布者的id，也就是登录账号
              }
    }
};
methodFunction.jqgridInit = function(){

    var jqGridData = [
        {
            name: "这是一个广告",
            type: "1",
            description: "这是关于广告的描述",
            demoDescription:"这是关于广告示例的描述",
            height:'100',
            width:"100",
            demoTitle:"这是一个广告实例标题",
            demoUrl:'https://www.baidu.com/'

        },{
            name: "这是一个广告",
            type: "2",
            description: "这是关于广告的描述",
            demoDescription:"这是关于广告示例的描述",
            height:'100',
            width:"100",
            demoTitle:"这是一个广告实例标题",
            demoUrl:'https://www.baidu.com/'

        },{
            name: "这是一个广告",
            type: "1",
            description: "这是关于广告的描述",
            demoDescription:"这是关于广告示例的描述",
            height:'100',
            width:"100",
            demoTitle:"这是一个广告实例标题",
            demoUrl:'https://www.baidu.com/'

        },{
            name: "这是一个广告",
            type: "3",
            description: "这是关于广告的描述",
            demoDescription:"这是关于广告示例的描述",
            height:'100',
            width:"100",
            demoTitle:"这是一个广告实例标题",
            demoUrl:'https://www.baidu.com/'

        },{
            name: "这是一个广告",
            type: "2",
            description: "这是关于广告的描述",
            demoDescription:"这是关于广告示例的描述",
            height:'100',
            width:"100",
            demoTitle:"这是一个广告实例标题",
            demoUrl:'https://www.baidu.com/'

        },{
            name: "这是一个广告",
            type: "1",
            description: "这是关于广告的描述",
            demoDescription:"这是关于广告示例的描述",
            height:'100',
            width:"100",
            demoTitle:"这是一个广告实例标题",
            demoUrl:'https://www.baidu.com/'

        }];
    var grid_selector = "#grid-table0";
    var pager_selector = "#grid-pager0";
    $("#grid-table0").jqGrid({
        data: jqGridData, //当 datatype 为"local" 时需填写
        datatype: "local", //数据来源，本地数据（local，json,jsonp,xml等）
        colNames: ['广告位名称','广告类型','广告描述','广告示例描述',"广告高","广告宽","示例标题","示例路径"],
        colModel: [
            {
                name: 'name',
                index: 'name'

            },
            {
                name: 'type',
                index: 'type'
            },{
                name: 'description',
                index: 'description'
            },{
                name: 'demoDescription',
                index: 'demoDescription'
            },
            {
                name: 'height',
                index: 'height'
            },{
                name: 'width',
                index: 'width'
            },{
                name: 'demoTitle',
                index: 'demoTitle'
            },{
                name: 'demoUrl',
                index: 'demoUrl'
            }],
        gridComplete:function(){
            var jqGridTable = $("#grid-table0");
            jqGridTable.setGridWidth($(window).width()*0.97);
            jqGridTable.setGridWidth(document.body.clientWidth*0.97);
            $(window).resize(function(){

                jqGridTable.setGridWidth($(window).width()*0.97);
                jqGridTable.setGridWidth(document.body.clientWidth*0.97);
            });
        },
        onSelectRow: function (rowid, status) {
            if(status){
                var thisTable = $(this);
                var rowData = thisTable.jqGrid('getRowData', rowid);
                var thisRow = $("#"+rowid);
                var showWhich = rowData["type"];
                var data = {"positionList":[{"title":"个人中心左下角广告位","imgSrc":"http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/160x210_01x.jpg"},{"title":"应用中心首页及各分类页左下广告位","imgSrc":"http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/160x210_02x.jpg"},{"title":"空间_个人中心_左下 160*210悬挂","imgSrc":"http://qzonestyle.gtimg.cn/open_proj/img/displaybox/qzone_center_160x210x.jpg"},{"title":"应用中心首页及各分类页左下广告位","imgSrc":"http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/py160x210_01x.jpg"},{"title":"应用详情页左下广告位","imgSrc":"http://imgcache.qq.com/qzonestyle/sns/gdt/create/images/ad/py160x210_02x.jpg"}],"position":"您的广告将可能出现在以上示例广告位，但仅会出现在“QQ空间”投放平台"};
                thisRow.after(methodFunction.creatAdPlan(showWhich,data));
                methodFunction.editAdCreative();
                buildAdStep.config.sortId = 1;
                buildAdStep.config.creativeNum = 1;
                methodFunction.creatAdCreative(showWhich);
            }

        },
        loadComplete: function (data) {

        },
        viewrecords: true, //是否在浏览导航栏显示记录总数
        rowNum: 10, //每页显示记录数
        rowList: [10, 20, 30], //用于改变显示行数的下拉列表框的元素数组。
        pager: pager_selector, //分页、按钮所在的浏览导航栏
        altRows: true, //设置为交替行表格,默认为false
        multiselect: true, //是否多选
        multiboxonly: false, //是否只能点击复选框多选
        autowidth: true ,//自动宽
    });
    //浏览导航栏添加功能部分代码
    $(grid_selector).navGrid(pager_selector, {
        search: false, // 检索
        add: false, //添加 （只有editable为true时才能显示属性）
        edit: false, //修改（只有editable为true时才能显示属性）
        del: false, //删除
        refresh: true, //刷新
        pgbuttons:false,
    });

};
methodFunction.nowIndex = function(i){
    var targetObj = $(".toufang-main");
    var headCreatLine = $(".create-step-area li");
    targetObj.addClass("none").eq(i).removeClass("none");
    headCreatLine.each(function(){
        $(this).find(".create-step-dot").removeClass("create-step-dot-cirle").next().removeClass("create-step-dot-line");
    });
    for(var num = 0;num<headCreatLine.length;num++){
        headCreatLine.eq(num).find(".create-step-dot").addClass("create-step-dot-cirle").next().addClass("create-step-dot-line");
        if(num==i){
            break;
        }
    }

};
methodFunction.checkOneStep = function(){
    var selectOnOff = false;
    var nameOnOff = false;
    var selectTargetObj  = $("#show-chosen-result");
    var adPlanNameTargetObj = $("#ordername");
    var adLinkTargetObj = $("#orderlink");
    var errorDialog = {"selectError":$("#campaignid_chosen ._errtips"),"nameError":$("#ordernameItemsWrap ._errtips"),"linkError":$("#orderlinkItemsWrap ._errtips")};
    var adPlanName = (selectTargetObj.html().split('<span class="select-sign"></span>'))[0];
    if(adPlanName!="请选择"){
        selectOnOff = true;
        errorDialog.selectError.hide();
    }else{
        selectOnOff = false;
        errorDialog.selectError.show();
    }
    if(adPlanNameTargetObj.val()==""){
        nameOnOff = false;
        errorDialog.nameError.show();
    }else{
        if($("#ordername").val().length<41){
            nameOnOff = true;
            errorDialog.nameError.hide();
        }else{
            nameOnOff = false;
            errorDialog.nameError.show();
        }

    }
    var str = adLinkTargetObj.val();
    var reg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/;
    var linkOnOff = reg.test(str);
    if(linkOnOff){
        errorDialog.linkError.hide();
    }else{
        errorDialog.linkError.show();
    }
        return selectOnOff&&nameOnOff&&linkOnOff;
};
methodFunction.jedateInit = function(){
    var nowTime = new Date();
    var month = nowTime.getMonth()+1;
    jeDate({
        dateCell:"#dateinfo",
        format:"YYYY-MM-DD",
        isinitVal: true,
        isTime: false,
        minDate:nowTime.getFullYear()+"-"+month+"-"+nowTime.getDate()
    });
    jeDate({
        dateCell:"#dateinfohd",
        format:"YYYY-MM-DD",
        isinitVal: true,
        isTime: false,
        minDate:nowTime.getFullYear()+"-"+month+"-"+nowTime.getDate()
    });
};
methodFunction.checkTwoStep = function(){

};
methodFunction.checkThreeStep = function(){

};
methodFunction.checkNextOnOff = function(stepNum){
    switch (stepNum){
        case 0:
            return methodFunction.checkOneStep();
        case 1:
            return true;
        case 2:
            return true;
        case 3:
            return false;
    }

};
methodFunction.oneStep = function(){
    alert("这是第一个下一步");
    this.postData("creativePlan");
    /*queryJson:{"deliveryAdStartTime":"3:00","deliveryAdEndTime":"20:00","deliveryAdTimeType":2,"deliveryAdId":"1476757106313","id":"616","deliveryAdType":2,"deliveryAdStartDate":"2016-10-18","deliveryAdEndDate":"2016-10-20","deliveryPlanId":"1476669723400","deliveryAdName":"而非","deliveryAdUrl":"www.baidu.com","deliveryPublisher":"1"}*/
    console.log();
    this.showBehavior();
    this.jqgridInit();
};
methodFunction.twoStep = function(){
    alert("这是第二个下一步");
};
methodFunction.threeStep = function(){
    alert("这是第三个下一步");
    var submitBtn =$("#wrapButton .s-button-right");
    submitBtn.html("提交广告");
};
methodFunction.submit = function(){

    alert("广告提交");
};
methodFunction.changeIndex = function(){
    var targetObj = $("#wrapButton");
    var changeLen = $(".toufang-main").length;
    var nowIndex = 0;
    targetObj.find(".s-button-right").unbind("click").bind("click",function(){
        if(methodFunction.checkNextOnOff(nowIndex)){
            nowIndex++;
            if(nowIndex==changeLen){
                methodFunction.submit();
                nowIndex =  changeLen-1;
            }else if(nowIndex==1){
                methodFunction.oneStep();
            }else if(nowIndex==2){
                methodFunction.twoStep();
            }else if(nowIndex==3){
                methodFunction.threeStep();
            }
            targetObj.find(".previous").removeClass("none");
            methodFunction.nowIndex(nowIndex);
        }

    });
    targetObj.find(".previous").addClass("none").unbind("click").bind("click",function(){
        nowIndex--;
        if(nowIndex==-1){
            nowIndex =  0;
        }else if(nowIndex==0){
            $(this).addClass("none");
        }
        var submitBtn =$("#wrapButton .s-button-right");
        submitBtn.html("下一步");
        methodFunction.nowIndex(nowIndex);
    });
};
methodFunction.showDialog = function(ele,drag){
    if(drag){
        ele.draggable({ containment: "window" });
    }else{
        ele.fadeIn().delay(2000).fadeOut();
        return false;
    }
    $("#build-gdt-mask").show();
    ele.removeClass("none");

    ele.find(".qz_dialog_btn_close").unbind("click").bind("click",function(){
       ele.addClass("none");
        $("#build-gdt-mask").hide();
    });
    ele.find(".qz_dialog_layer_nor").unbind("click").bind("click",function(){
        ele.addClass("none");
        $("#build-gdt-mask").hide();
    });
    ele.find(".qz_dialog_layer_sub").unbind("click").bind("click",function(){
        ele.addClass("none");
        $("#build-gdt-mask").hide();
    });

};
methodFunction.showBehavior = function(){
    var targetObj = {"deliveryDate":$("#sdate-edateItemsWrap .datechoose .checkline .checkbox-imitate"),"deliveryTime":$("#alltimeItemsWrap .mg-r35"),"deliveryPlan":$("#campaignidItemsWrap").next(),"changeJqgrid":$("#sitesetItemsWrap .mg-r35")};
    targetObj.deliveryDate.unbind("click").click("click",function(){

        $("#dateinfohd").toggleClass("none");
        var dateStartAndEndObj = $(this).find(".inner");
        dateStartAndEndObj.toggleClass("inner-bgposi");
        var daterangeCheckObj = $("#daterangecheck");
        daterangeCheckObj.attr("checked")?daterangeCheckObj.removeAttr("checked"):daterangeCheckObj.attr({"checked":true});
    });
    targetObj.deliveryTime.each(function(){

        var timeSelect = $("#alltimeItemsWrap .choose-time");
        $(this).unbind("click").click(function(){

            if($(this).find("#alltime1").is(':checked')){

                timeSelect.removeClass("none");

            }else{

                timeSelect.addClass("none");
            }
        });
    });
    targetObj.changeJqgrid.each(function(){
        $(this).unbind("click").bind("click",function(){
            var jqGridData = [
                {
                    name: "这是二个广告",
                    type: "1",
                    description: "这是关于广告的描述",
                    demoDescription:"这是关于广告示例的描述",
                    height:'100',
                    width:"100",
                    demoTitle:"这是一个广告实例标题",
                    demoUrl:'https://www.baidu.com/'

                },{
                    name: "这是二个广告",
                    type: "2",
                    description: "这是关于广告的描述",
                    demoDescription:"这是关于广告示例的描述",
                    height:'100',
                    width:"100",
                    demoTitle:"这是一个广告实例标题",
                    demoUrl:'https://www.baidu.com/'

                },{
                    name: "这是二个广告",
                    type: "1",
                    description: "这是关于广告的描述",
                    demoDescription:"这是关于广告示例的描述",
                    height:'100',
                    width:"100",
                    demoTitle:"这是一个广告实例标题",
                    demoUrl:'https://www.baidu.com/'

                },{
                    name: "这是二个广告",
                    type: "3",
                    description: "这是关于广告的描述",
                    demoDescription:"这是关于广告示例的描述",
                    height:'100',
                    width:"100",
                    demoTitle:"这是一个广告实例标题",
                    demoUrl:'https://www.baidu.com/'

                },{
                    name: "这是二个广告",
                    type: "2",
                    description: "这是关于广告的描述",
                    demoDescription:"这是关于广告示例的描述",
                    height:'100',
                    width:"100",
                    demoTitle:"这是一个广告实例标题",
                    demoUrl:'https://www.baidu.com/'

                },{
                    name: "这是二个广告",
                    type: "1",
                    description: "这是关于广告的描述",
                    demoDescription:"这是关于广告示例的描述",
                    height:'100',
                    width:"100",
                    demoTitle:"这是一个广告实例标题",
                    demoUrl:'https://www.baidu.com/'

                }];
            $("#grid-table0").jqGrid('setGridParam', {
                data: jqGridData //发送数
            }).trigger('reloadGrid');
        });
    });
    targetObj.deliveryPlan.unbind("click").bind("click",function(){
        methodFunction.showDialog($("#qz_dialog_instance_qzDialog1"),"drag");
    });
};
methodFunction.init = function(){
    this.nowIndex(0);
    this.changeIndex();
    this.showBehavior();
    this.simulateSelect();
    this.jedateInit();
};
$(document).ready(function(){
    console.log("hello");
    console.log(buildAdStep);
    methodFunction.init();
});
