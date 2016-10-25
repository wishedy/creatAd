/**
 * Created by ALLIN on 2016/10/11.
 */
var buildAdStep = {};
buildAdStep.config = {
    "sortId":null,
    "creativeNum":null,
    "preViewData":[]
};
buildAdStep.method = {};
var methodFunction = buildAdStep.method;
methodFunction.creatInnerAd = function(showWhich,data){
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
        $(this).hover(
            function(){
            var editObj = $(this);
            editObj.addClass("hover");
            editObj.find("._removeCabinet").unbind("click").bind("click",function(){
                var creativeNum = $("#_content_crtsize2 .updata-sucai [id^=cabinet]").length;
                var deleteOnOff = creativeNum>1?true:false;
                var dialogConfig = {};
                if(deleteOnOff){
                    dialogConfig = {
                        "element":$("#qz_dialog_instance_qzDialog5"),
                        "dragOnOff":true,
                        "okFn":function(){
                            if(editObj.attr("creativeId")){
                                /*当服务器存在该条数据时才删掉*/
                                var ajaxConfig = {
                                    "port":"deliveryCreativeAction!delAdCreativity",
                                    "mode":"ajax",
                                    "postData":methodFunction.postData("deleteCreativeAd",editObj),
                                    "successFn":function(data){
                                        console.log(data);
                                    }
                                };
                                methodFunction.ajax(ajaxConfig);
                                /*同时删掉本地预览数据*/
                                for(var sortDele=0;sortDele<buildAdStep.config.preViewData.length;sortDele++){

                                    if(buildAdStep.config.preViewData[sortDele].sortId==editObj.attr("data-sortId")){
                                        buildAdStep.config.preViewData.splice(sortDele,1);
                                        break;
                                    }
                                }
                            }

                            editObj.remove();
                            var residueCreativeAd = $("#_content_crtsize2 .updata-sucai [id^=cabinet]").length;
                            buildAdStep.config.creativeNum =residueCreativeAd;
                        },
                        "closeFn":function(){
                            return false;
                        }
                    };
                    methodFunction.showDialog(dialogConfig);
                }else{
                    dialogConfig = {
                        "element":$("#q_Msgbox"),
                        "dragOnOff":false
                    };
                    methodFunction.showDialog(dialogConfig);
                }
            });
        },
            function(){
            $(this).removeClass("hover");
        }).find("._tnameEdit").unbind("click").bind("click",function(e){
            $(this).parent().addClass("none");
            $(this).parent().next().removeClass("none");
            e.stopPropagation();
        });
        $("[data-id='"+$(this).attr("id")+"']").off("change").bind("change",function(){
            var postImgObj = $(this);
            var postImgLi = $("#"+$(this).attr("data-id"));
            var dialogConfig0 = {
                "element":$("#qz_dialog_instance_qzDialog11"),
                "dragOnOff":true
            };
            methodFunction.showDialog(dialogConfig0);
            var ajaxConfig = {
                "postData":methodFunction.postData("img",postImgLi),
                "port":"deliveryCreativeAction!uploadThumbnail",
                "mode":"form",
                "formObj":postImgObj,
                "success":function(data){
                    console.log(data);
                    if(data.upload_status){
                        $("#qz_dialog_instance_qzDialog11").addClass("none");
                        $("#build-gdt-mask").hide();
                        var dialogConfig1 = {
                            "element":$("#updata-success"),
                            "dragOnOff":true,
                            "okFn":function(){
                                postImgLi.find(".sucai-wenan").prev().before($("#ad-img-creative-demo .sucai-area").clone()).remove();
                                var sortId = postImgLi.attr("data-sortId");
                                var returnImgSrc = data.img_url.replace("image/img04", "http://img04.allinmd.cn")+"?tempid="+Date.parse(new Date());
                                var creativeData = {
                                    "creativeId":data.id,
                                    "imgSrc":returnImgSrc,
                                    "sortId":data.sortId
                                };
                                /*将数据存到或者更新到预览数据的json内*/
                                for(var pushNum = 0;pushNum<buildAdStep.config.preViewData.length;pushNum++){
                                    var returnPivPath = buildAdStep.config.preViewData[pushNum].img_url
                                    var hasInSrc = returnPivPath.substring(0,returnPivPath.indexOf("?"));
                                    if(hasInSrc==data.img_url){
                                        buildAdStep.config.preViewData[pushNum].img_url = returnImgSrc;
                                        break;
                                    }else{
                                        if(pushNum==buildAdStep.config.preViewData.length-1){
                                            buildAdStep.config.preViewData.push(returnImgSrc);
                                            break;
                                        }
                                    }
                                }
                                if(buildAdStep.config.preViewData.length==0){
                                    buildAdStep.config.preViewData.push(returnImgSrc);
                                }
                                methodFunction.creatAdId(postImgLi,sortId,"1",creativeData);
                            }
                        };
                        methodFunction.showDialog(dialogConfig1);

                    }else{
                        $("#qz_dialog_instance_qzDialog11").addClass("none");
                        $("#build-gdt-mask").hide();
                        var dialogConfig2 = {
                            "element":$("#qz_dialog_instance_qzDialog3"),
                            "dragOnOff":true
                        };
                        methodFunction.showDialog(dialogConfig2);
                    }

                }
            };
            methodFunction.ajax(ajaxConfig);
        });
        $(".sucai-wenan textarea").each(function(){
            $(this).unbind("click").bind("click input  propertychange",function(e){
                var maxLen=parseInt($(this).parent().find(".somets span").html())+1;
                var num = $(this).val().length;
                var checkOnOff = num<maxLen&&num>0;
                if(checkOnOff){
                    $(this).parent().find(".somets strong").html(num).css({"color":"#909090"});
                    $(this).parent().find("._errtips").hide();
                }else{
                    $(this).parent().find(".somets strong").html(num).css({"color":"#e33244"});
                    $(this).parent().find("._errtips").show();
                }
                e.stopPropagation();
            });
        });
        $("._tnameTextarea textarea").each(function(e){
            $(this).bind("input  propertychange",function(){
                var num = $(this).val().length;
                var maxLen=parseInt($(this).parent().find(".somets span").html())+1;
                var checkNameOnOff = num<maxLen&&num>0;
                if(checkNameOnOff){
                    $(this).parent().find(".somets strong").html(num).css({"color":"#909090"});
                    $(this).parent().find("._errtips").hide();
                }else{
                    $(this).parent().find(".somets strong").html(num).css({"color":"#e33244"});
                    $(this).parent().find("._errtips").show();
                }
            });
            $(this).unbind("click").bind("click",function(e){
                e.stopPropagation();
            });
            $(this).unbind("blur").bind("blur",function(){

            });
        });
        $(".sucai-guanzhu .checkbox").each(function(){
            /*这里存在一个bug点击第二个，编辑第一个*/
            $(this).unbind("click").bind("click",function(){
                var onOff = $(this).is(':checked');
                if(onOff){
                    $(this).next().addClass("none");
                    $(this).siblings(".text").removeClass("none").bind("input propertychange",function(){
                        var urlStr = $(this).val();
                        var reg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/;
                        var urlOnOff = reg.test(urlStr);
                        if(urlOnOff){
                            $(this).next().find("._errtips").hide();
                        }else{
                            $(this).next().find("._errtips").show();
                        }
                    });

                }else{
                    $(this).next().removeClass("none");
                    $(this).siblings(".text").addClass("none");
                }

            });

        });

    });
    $(document).unbind("click").bind("click",function(){
        targetObjBox.each(function(){
            var stroeName = $(this).find("._tnameTextarea textarea").val();
            var nameEditOnOff = stroeName.length<41&&stroeName.length>0;
            if(nameEditOnOff){
                $(this).find("._tnameEdit").parent().removeClass("none").next().addClass("none").prev().find("._tnameContent").html(stroeName);
            }else{
                return false;
            }
        });
    });
};
methodFunction.creatAdId = function(element,sortId,type,data){
    switch (type) {
        case "1":
            if (data) {
                element.attr({"creativeId": data.creativeId}).find("._removeCabinet").next().attr({"id": "tname-cabinet_2_" + sortId + "ItemsWrap"}).next().attr({"id": "image_url-cabinet_2_" + sortId + "ItemsWrap"}).find(".sucai-img-container img").attr({"src": data.imgSrc}).parent().parent().next().attr({"value": data.imgSrc}).parent().find(".delivery_create_att_form").attr({"id": "delivery_create_att_form" + sortId + ""}).find(".input-file-sizeimg").attr({"for": "img-cabinet_2_" + sortId}).next().attr({
                    "id": "img-cabinet_2_" + sortId,
                    "data-id": "cabinet_2_" + sortId
                }).next().attr({"id": "image_url-cabinet_2_" + sortId});
            } else {
                element.find("._removeCabinet").next().attr({"id": "tname-cabinet_2_" + sortId + "ItemsWrap"}).next().attr({"id": "image_url-cabinet_2_" + sortId + "ItemsWrap"}).find(".delivery_create_att_form").attr({"id": "delivery_create_att_form" + sortId + ""}).find(".input-file-sizeimg").attr({"for": "img-cabinet_2_" + sortId}).next().attr({
                    "id": "img-cabinet_2_" + sortId,
                    "data-id": "cabinet_2_" + sortId
                }).next().attr({"id": "image_url-cabinet_2_" + sortId});
            }
            element.find(".sucai-area").eq(0).find("._tnameTextarea textarea").attr({"id": "tname-cabinet_2_" + sortId}).next().next().attr({"id": "tname-cabinet_2_" + sortId + "CounterWrap"}).find("strong").attr({"id": "tname-cabinet_2_" + sortId + "CounterWrapCurrentLength"}).next().attr({"id": "tname-cabinet_2_" + sortId + "MaxLength"});

            element.find(".sucai-wenan").attr({"id": "title-cabinet_2_" + sortId + "ItemsWrap"}).find(".prompt textarea").attr({"id": "title-cabinet_2_" + sortId}).next().attr({"id": "title-cabinet_2_" + sortId + "CounterWrap"}).find("strong").attr({"id": "title-cabinet_2_" + sortId + "CounterWrapCurrentLength"}).next().attr({"id": "title-cabinet_2_" + sortId + "MaxLength"});
            break;
        case "2":
            if (data) {
                element.attr({"creativeId": data.creativeId});
            }
            element.find(".sucai-area").eq(0).attr({"id": "tname-cabinet_71_" + sortId + "ItemsWrap"}).find("._tnameTextarea textarea").attr({"id": "tname-cabinet_71_" + sortId + ""}).next().next().attr({"id": ".tname-cabinet_71_0CounterWrap"}).find("strong").attr({"id": "tname-cabinet_71_" + sortId + "CounterWrapCurrentLength"}).next().attr({"id": "tname-cabinet_71_" + sortId + "MaxLength"});
            element.find(".sucai-area").eq(1).attr({"id": "title-cabinet_71_" + sortId + "ItemsWrap"}).find("textarea").attr({"id": "title-cabinet_71_" + sortId}).next().attr({"id": "title-cabinet_71_" + sortId + "CounterWrap"}).find("strong").attr({"id": "title-cabinet_71_" + sortId + "CounterWrapCurrentLength"}).next().attr({"id": "title-cabinet_71_" + sortId + "MaxLength"});
            element.find(".sucai-area").eq(2).attr({"id": "desc-cabinet_71_" + sortId + "ItemsWrap"}).find("textarea").attr({"id": "desc-cabinet_71_" + sortId}).next().attr({"id": "desc-cabinet_71_" + sortId + "CounterWrap"}).find("strong").attr({"id": "desc-cabinet_71_" + sortId + "CounterWrapCurrentLength"}).next().attr({"id": "desc-cabinet_71_" + sortId + "MaxLength"});
            element.find(".sucai-area").eq(3).attr({"id": "customer_define_invoke_url-cabinet_71_" + sortId + "ItemsWrap"}).find(".checkbox").attr({
                "id": "hascustomer_define_invoke_url-cabinet_71_" + sortId,
                "data-relateid": "customer_define_invoke_url-cabinet_71_" + sortId
            }).next().attr({"for": "hascustomer_define_invoke_url-cabinet_71_" + sortId}).next().attr({"id": "customer_define_invoke_url-cabinet_71_" + sortId});
            break;
        default:
            break;
    }
};
methodFunction.creatAdCreative = function(creatWhich){
    var creatAdTargetObj = $("#_content_crtsize2 .sucai-list-add");
    creatAdTargetObj.unbind("click").bind("click",function(){
        var liDemoBox = $("#ad-creative-demo li");
        if(buildAdStep.config.creativeNum<5){
            var creatLi = null;
            switch (creatWhich){
                case "1":
                    $(this).before(liDemoBox.eq(0).clone().attr({
                        "data-sortId":buildAdStep.config.sortId,
                        "id":"cabinet_2_"+buildAdStep.config.sortId
                    }));
                    creatLi = $("#cabinet_2_"+buildAdStep.config.sortId);
                    methodFunction.creatAdId(creatLi,buildAdStep.config.sortId,creatWhich);
                    buildAdStep.config.sortId++;
                    methodFunction.editAdCreative();
                    break;
                case "2":
                    $(this).before(liDemoBox.eq(1).clone().attr({
                        "data-sortId":buildAdStep.config.sortId,
                        "id":"cabinet_71_"+buildAdStep.config.sortId
                    }));
                    creatLi = $("#cabinet_71_"+buildAdStep.config.sortId);
                    methodFunction.creatAdId(creatLi,buildAdStep.config.sortId,creatWhich);
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
methodFunction.postData = function(mode,postObj){
    var postData = {};
    var preDataBox = null;
    postData.queryJson = {};
    switch (mode){
        case "deliveryPlan":
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
                deliveryAdTimeType = 2;
                deliveryAdStartTime = $("#stime").val()+":00";
                deliveryAdEndTime = $("#etime").val()+":00";
            }else{
                deliveryAdTimeType = 1;
                deliveryAdStartTime = "";
                deliveryAdEndTime = "";
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
                  "deliveryPublisher":"1"//这是发布者的id，也就是登录账号
              };
            preDataBox = JSON.stringify(creativePlanData);
            postData.queryJson = preDataBox;
            break;
        case "img":
            var sendImgData = null;
            if(postObj.attr("creativeId")){
                sendImgData = {
                    "id": parseInt(postObj.attr("creativeId")),
                    "sortId": parseInt(postObj.attr("data-sortid")),
                    "deliveryCreativeName": postObj.find("._tnameContent").html()
                };
            }else{
                sendImgData = {
                    "id": 0,
                    "sortId": parseInt(postObj.attr("data-sortid")),
                    "deliveryCreativeName": postObj.find("._tnameContent").html(),
                    'deliveryAdId':""
                };
            }
            preDataBox = JSON.stringify(sendImgData);
            postData.queryJson = preDataBox;
            break;
        case "deleteCreativeAd":
            var deleteData = null;
            if(postObj.attr("creativeId")){
                deleteData = {
                    "deleId": parseInt(postObj.attr("creativeId"))
                };
            }
            preDataBox = JSON.stringify(deleteData);
            postData.queryJson = preDataBox;
            break;
        default:
            break;
    }
    return postData;
};
methodFunction.ajax = function(ajaxConfig){
    var postData = ajaxConfig.postData;//需要提交给后台的参数
    var port = ajaxConfig.port;//后台接口
    var mode = ajaxConfig.mode;//数据交互的方式，form,ajax
    var formObj = ajaxConfig.formObj;//form上传是。所对应的form表单
    var successFn = ajaxConfig.success;//返回数据后的回调函数
    if(mode=="form"){
        formObj.ajaxSubmit({
            url: port,
            dataType: 'text',
            data :postData,
            type: "post",
            clearForm: true,
            success: function (data) {
                if(successFn){
                    successFn(data);
                }
            }
        });
    }else{
        $.ajax({
            type: "post",
            url: port,
            data: postData,
            cache: false,
            success: function(data) {
                if(successFn){
                    successFn(data);
                }
            }
        });
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
                thisRow.after(methodFunction.creatInnerAd(showWhich,data));
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
    var checkTargetObj = $("#_content_crtsize2 .updata-sucai  [id^=cabinet]");
    var  rightOnOff = false;
    for(var checkNum = 0;checkNum<checkTargetObj.length;checkNum++){
        var checkNameObj = checkTargetObj.eq(checkNum).find("._tnameTextarea textarea");
        var checkWenAnObj = checkTargetObj.eq(checkNum).find(".sucai-wenan textarea");
        var checkImgObj = checkTargetObj.eq(checkNum);
        var nameJudge = parseInt(checkNameObj.parent().find(".somets span").html())+1;
        var wenAnJudge =parseInt(checkWenAnObj.parent().find(".somets span").html())+1;
        var nameErrorObj = checkNameObj.parent().find("._errtips");
        var wenAnErrorObj = checkWenAnObj.parent().find("._errtips");
        var nameRightOnOff = checkNameObj.html().length<nameJudge?true:false;
        var wenAnOnOff = checkWenAnObj.html().length<wenAnJudge?true:false;
        var imgOnOff = checkImgObj.attr("creativeId")?true:false;
        if(nameRightOnOff){
            nameErrorObj.hide();
            rightOnOff = true;
        }else{
            nameErrorObj.show();
            rightOnOff = false;
        }
        if(wenAnOnOff){
            rightOnOff = true;
            wenAnErrorObj.hide();
        }else{
            wenAnErrorObj.show();
            rightOnOff = false;
        }
        if(!imgOnOff){
            var dialogConfig = {
                "dragOnOff":false,
                "element":$("#q_Msgbox1")
            };
            rightOnOff = false;
        }else{
            rightOnOff = true;
        }
        if(!rightOnOff){
            break;
        }
    }
    return rightOnOff;
};
methodFunction.checkThreeStep = function(){

};
methodFunction.checkNextOnOff = function(stepNum){
    switch (stepNum){
        case 0:
            return methodFunction.checkOneStep();
        case 1:
            console.log(methodFunction.checkTwoStep());
            return methodFunction.checkTwoStep();
            //return true;
        case 2:
            return true;
        case 3:
            return false;
    }

};
methodFunction.oneStep = function(){
    alert("这是第一个下一步");
    var ajaxConfig = {
        "postData":methodFunction.postData("creativePlan"),
        "port":"deliveryAdAction!save",
        "mode":"ajax",
        "success":function(data){
            console.log(data);
        }
    };
    console.log(methodFunction.postData("deliveryPlan"));
    this.ajax(ajaxConfig);
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
methodFunction.showDialog = function(dialogConfig){
    var drag = dialogConfig.dragOnOff;
    var ele = dialogConfig.element;
    var subFn = dialogConfig.okFn;
    var norFn = dialogConfig.closeFn;
    if(drag){
        ele.draggable({ containment: "window" });
    }else{
        ele.fadeIn().delay(1500).fadeOut();
        return false;
    }
    $("#build-gdt-mask").show();
    ele.removeClass("none");

    ele.find(".qz_dialog_btn_close").unbind("click").bind("click",function(){
        if(norFn){
            norFn();
        }
       ele.addClass("none");
        $("#build-gdt-mask").hide();
    });
    ele.find(".qz_dialog_layer_nor").unbind("click").bind("click",function(){
        if(norFn){
            norFn();
        }
        ele.addClass("none");
        $("#build-gdt-mask").hide();
    });
    ele.find(".qz_dialog_layer_sub").unbind("click").bind("click",function(){
        if(subFn){
            subFn();
        }
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
        var dialogConfig = {
          "element":$("#qz_dialog_instance_qzDialog1"),
            "dragOnOff":true
        };
        methodFunction.showDialog(dialogConfig);
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
