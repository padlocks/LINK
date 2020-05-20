--	// FileName: LinkAPI.lua
--	// Written by: Audrey (pascaling, atom#0001)
--	// Description: An interface for the LINK service. To be used by new commands added via plugins.

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

function request(method, url, key)
	local request = {}
	request.Method = method
	request.Url = url
	request.Headers = {}
	request.Headers["Content-Type"] = "application/x-www-form-urlencoded"
	request.Body = {}
	request.Body.key = key
	
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
		error("Could not connect to trello.com! Make sure HTTP is enabled.")
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
			return decode(request("GET", key, api.getUrl("appeals")))
		end;
		
		getBans = function()
			return decode(request("GET", key, api.getUrl("bans")))
		end;
		
		getComments = function()
			return decode(request("GET", key, api.getUrl("comments")))
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
			return decode(request("GET", key, api.getUrl("evidence")))
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
			return decode(request("GET", key, api.getUrl("kicks")))
		end;
		
		getLogs = function()
			return decode(request("GET", key, api.getUrl("logs")))
		end;

		--[[
			messageId: 'N/A',
            location: 'GAME',
            username: req.body.username,
            userId: req.body.guid,
            staff: req.body.staff,
            staffId: req.body.suid,
            action: req.body.action,
			reason: req.body.reason
		]]

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
			return decode(request("GET", key, api.getUrl("permbans")))
		end;
		
		getReasons = function()
			return decode(request("GET", key, api.getUrl("reasons")))
		end;
		
		getStaff = function()
			return decode(request("GET", key, api.getUrl("staff")))
		end;
		
		getUsers = function()
			return decode(request("GET", key, api.getUrl("users")))
		end;
		
		getWarnings = function()
			return decode(request("GET", key, api.getUrl("warnings")))
		end;

		svGet = function()
			return decode(request("GET", key, api.getUrl("sv")))
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