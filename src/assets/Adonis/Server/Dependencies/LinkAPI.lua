--[[ 
	FileName: LinkAPI.lua
	Written by: Audrey (pascaling, atom#0001)
	Description: An interface for the LINK service. To be used by new commands added via plugins.

   todo: create command interface.
]]--

local http = game:service("HttpService")

function checkHttp()
	local y,n = pcall(function()
		local get = http:GetAsync('http://google.com')
	end)
	if y and not n then return true else return false end
end

function decode(str)
	return http:JSONDecode(str)
end

function encode(str)
	return http:JSONEncode(str)
end

function urlEncode(str)
	return http:UrlEncode(str)
end

function request(method, url, body)
	local request = {}
	request.Method = method
	request.Url = url
	request.Headers = {}
	request.Headers["Content-Type"] = "application/x-www-form-urlencoded"
	request.Body = body
	
	return http:RequuestAsync(request)
end

function httpGet(url)
	return http:GetAsync(url,true)
end

function httpPost(url,data,type)
	return http:PostAsync(url,data,type)
end

function trim(str)
	return str:match("^%s*(.-)%s*$")
end


function LINK(server, key)
	if not checkHttp() then
		error("Could not connect to server! Make sure HTTP is enabled.")
	end
	
	local api
	api = {
		
		http = http;
		
		getListObj = getListObj;		
		
		checkHttp = checkHttp;
		
		urlEncode = urlEncode;
		
		encode = encode;
		
		decode = decode;
		
		request = request;
		
		httpGet = httpGet;
		
		httpPost = httpPost;
		
		trim = trim;
		
		epochToHuman = function(epoch)
			return decode(httpGet("http://www.convert-unix-time.com/api?timestamp="..epoch.."&returnType=json&format=iso8601")).utcDate
		end;
		
		getAppeals = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("appeals"), data))
		end;
		
		checkForBan = function(p)
			local data = {}
			data.key = key
			data.userId = p
			return request("GET", api.getUrl("checkban"), data)
		end;

		getBans = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("bans"), data))
		end;
		
		getComments = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("comments"), data))
		end;

		postComment = function (logId, msg, staff, staffId)
			local data = {}
			data.key = key
			data.logId = logId
			data.msg = msg
			data.staff = staff
			data.staffId = staffId
			request("POST", api.getUrl("post/comments"), data)
		end;
		
		getEvidence = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("evidence"), data))
		end;

		postEvidence = function (logId, evidenceURL)
			local data = {}
			data.key = key
			data.logId = logId
			data.location = "GAME"
			data.evidenceURL = evidenceURL
			request("POST", api.getUrl("post/evidence"), data)
		end;
		
		getKicks = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("kicks"), data))
		end;
		
		getLogs = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("logs"), data))
		end;

		postLog = function (username, userId, staff, staffId, action, reason)
			local data = {}
			data.key = key
			data.messageId = "N/A"
			data.location =  "GAME"
			data.username = username
			data.userId = userId
			data.staff = staff
			data.staffId = staffId
			data.action = action
			data.reason = reason
			request("POST", api.getUrl("post/logs"), data)
		end;
		
		getPermBans = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("permbans"), data))
		end;
		
		getReasons = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("reasons"), data))
		end;
		
		getStaff = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("staff"), data))
		end;
		
		getUsers = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("users"), data))
		end;
		
		getWarnings = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("warnings"), data))
		end;

		svGet = function()
			local data = {}
			data.key = key
			return decode(request("GET", api.getUrl("sv"), data))
		end;

		svSet = function (sv)
			local data = {}
			data.key = key
			data.value = sv
			request("POST", api.getUrl("post/sv"), data)
		end;

		--
		
		doAction = function(method,subUrl,data)
			if method:lower()=="post" then
				return decode(httpPost(api.getUrl(subUrl),data,2))
			elseif method:lower()=="get" then
				return decode(httpGet(api.getUrl(subUrl)))
			end
		end;
		
		getUrl = function(str)
			return server.."/"..str
		end;
	}	
	return api
end

return LINK