wait()
local execute = script:FindFirstChild("Execute")
local code, lbi = _G.Adonis.Scripts.ExecutePermission(execute and execute.Value)

if code then
	local func = lbi(code, getfenv())
	if func then
		func() 
	end
end