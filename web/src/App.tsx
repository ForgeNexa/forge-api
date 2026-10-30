import React, { useState } from 'react';
import { Send, Plus, Trash2, Shield, Clock, Layers, Play, CheckCircle } from 'lucide-react';

interface RequestItem {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: { key: string; value: string }[];
  body: string;
}

export function App() {
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: '1',
      name: 'Fetch User Profile',
      method: 'GET',
      url: 'https://api.forgenexa.org/v1/user/profile',
      headers: [{ key: 'Authorization', value: 'Bearer demo-token-123' }],
      body: '',
    },
    {
      id: '2',
      name: 'Create Project',
      method: 'POST',
      url: 'https://api.forgenexa.org/v1/projects',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: '{\n  "name": "Forge IDE Extension",\n  "visibility": "public"\n}',
    },
  ]);

  const [activeReqId, setActiveReqId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('headers');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

  const activeReq = requests.find((r) => r.id === activeReqId) || requests[0];

  const updateActiveReq = (patch: Partial<RequestItem>) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === activeReqId ? { ...r, ...patch } : r))
    );
  };

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResponse({
        statusCode: 200,
        statusText: '200 OK',
        durationMs: 24,
        sizeBytes: 412,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Powered-By': 'Forge API Engine (Go)',
          'Server': 'ForgeNexa-Gateway',
        },
        body: JSON.stringify(
          {
            status: 'success',
            executionEngine: 'Go-Core Executor v0.1.0',
            requestId: activeReq.id,
            timestamp: new Date().toISOString(),
            data: {
              id: 'usr_849204',
              handle: 'manish-npx',
              organization: 'ForgeNexa',
              role: 'Maintainer',
            },
          },
          null,
          2
        ),
      });
    }, 250);
  };

  return (
    <div className="flex h-screen bg-[#0F1115] text-[#C9D1D9] font-sans overflow-hidden">
      {/* Sidebar: Collections & Requests */}
      <div className="w-64 border-r border-[#30363D] bg-[#161B22] flex flex-col">
        <div className="p-3 border-b border-[#30363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#58A6FF]" />
            <span className="font-semibold text-sm text-white">Collections</span>
          </div>
          <button
            onClick={() => {
              const newId = String(Date.now());
              const newReq: RequestItem = {
                id: newId,
                name: 'New Request',
                method: 'GET',
                url: 'https://api.forgenexa.org/v1/ping',
                headers: [],
                body: '',
              };
              setRequests([...requests, newReq]);
              setActiveReqId(newId);
            }}
            className="p-1 rounded hover:bg-[#21262D] text-gray-400 hover:text-white"
            title="Add Request"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => setActiveReqId(req.id)}
              className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs ${
                req.id === activeReqId
                  ? 'bg-[#21262D] text-white border border-[#30363D]'
                  : 'text-gray-400 hover:bg-[#1C2128] hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span
                  className={`font-mono text-[10px] font-bold px-1 rounded ${
                    req.method === 'GET'
                      ? 'text-[#58A6FF] bg-[#58A6FF]/10'
                      : req.method === 'POST'
                      ? 'text-[#3FB950] bg-[#3FB950]/10'
                      : 'text-[#D29922] bg-[#D29922]/10'
                  }`}
                >
                  {req.method}
                </span>
                <span className="truncate">{req.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Request Workbench */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Request Address Bar */}
        <div className="p-4 border-b border-[#30363D] bg-[#161B22] flex items-center gap-3">
          <select
            value={activeReq.method}
            onChange={(e) => updateActiveReq({ method: e.target.value as any })}
            className="bg-[#21262D] border border-[#30363D] text-white text-xs font-semibold rounded px-3 py-2 outline-none"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={activeReq.url}
            onChange={(e) => updateActiveReq({ url: e.target.value })}
            className="flex-1 bg-[#0F1115] border border-[#30363D] rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#58A6FF]"
            placeholder="https://api.example.com/v1/resource"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 bg-[#58A6FF] hover:bg-[#4A92E6] text-black font-semibold text-xs px-4 py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send</span>
          </button>
        </div>

        {/* Workbench Tabs & Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Request Config (Left / Top) */}
          <div className="flex-1 flex flex-col border-r border-[#30363D] overflow-hidden">
            <div className="flex border-b border-[#30363D] bg-[#161B22] text-xs">
              {(['headers', 'body', 'auth'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 capitalize font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-[#58A6FF] text-white bg-[#0F1115]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'headers' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Request Headers</span>
                    <button
                      onClick={() =>
                        updateActiveReq({
                          headers: [...activeReq.headers, { key: '', value: '' }],
                        })
                      }
                      className="text-xs text-[#58A6FF] hover:underline"
                    >
                      + Add Header
                    </button>
                  </div>
                  {activeReq.headers.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={h.key}
                        placeholder="Key"
                        onChange={(e) => {
                          const newHeaders = [...activeReq.headers];
                          newHeaders[i].key = e.target.value;
                          updateActiveReq({ headers: newHeaders });
                        }}
                        className="flex-1 bg-[#161B22] border border-[#30363D] px-2 py-1 text-xs rounded text-white font-mono"
                      />
                      <input
                        type="text"
                        value={h.value}
                        placeholder="Value"
                        onChange={(e) => {
                          const newHeaders = [...activeReq.headers];
                          newHeaders[i].value = e.target.value;
                          updateActiveReq({ headers: newHeaders });
                        }}
                        className="flex-1 bg-[#161B22] border border-[#30363D] px-2 py-1 text-xs rounded text-white font-mono"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'body' && (
                <textarea
                  value={activeReq.body}
                  onChange={(e) => updateActiveReq({ body: e.target.value })}
                  placeholder="Request body (JSON, text, or XML)..."
                  className="w-full h-full bg-[#161B22] border border-[#30363D] rounded p-3 text-xs font-mono text-white outline-none resize-none focus:border-[#58A6FF]"
                />
              )}

              {activeTab === 'auth' && (
                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded text-xs space-y-3">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Shield className="w-4 h-4 text-[#3FB950]" />
                    <span>OS Credential Vault Protection</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Credentials and Bearer tokens are kept in encrypted local storage and
                    never transmitted to cloud trackers or exported in plain text.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Response Viewer (Right / Bottom) */}
          <div className="flex-1 flex flex-col bg-[#0F1115] overflow-hidden">
            <div className="p-3 border-b border-[#30363D] bg-[#161B22] flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Response</span>
              {response && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#3FB950] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {response.statusText}
                  </span>
                  <span className="text-gray-400">{response.durationMs} ms</span>
                  <span className="text-gray-400">{response.sizeBytes} B</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-white">
              {response ? (
                <pre className="text-[#A5D6FF]">{response.body}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Send className="w-8 h-8 mb-2 stroke-1" />
                  <span>Send a request to inspect response payload and headers</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
