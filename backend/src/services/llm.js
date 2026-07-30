import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

export class LlmError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = 'LlmError';
    this.statusCode = statusCode;
  }
}

function completionEndpoint(baseUrl) {
  const url = new URL(baseUrl);
  if (url.pathname.replace(/\/$/, '').endsWith('/chat/completions')) return url.toString();
  url.pathname = `${url.pathname.replace(/\/$/, '')}/chat/completions`;
  return url.toString();
}

function postJson(endpoint, headers, body) {
  return new Promise((resolve, reject) => {
    const request = new URL(endpoint).protocol === 'http:' ? httpRequest : httpsRequest;
    const clientRequest = request(endpoint, { method: 'POST', headers }, response => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { responseBody += chunk; });
      response.on('end', () => resolve({ statusCode: response.statusCode, body: responseBody }));
    });
    clientRequest.setTimeout(60_000, () => {
      const error = new Error('The language model request timed out.');
      error.code = 'ETIMEDOUT';
      clientRequest.destroy(error);
    });
    clientRequest.on('error', reject);
    clientRequest.end(body);
  });
}

export async function optimizeWithLlm({ llmConfig, systemPrompt, userPrompt }) {
  const endpoint = completionEndpoint(llmConfig.baseUrl);
  let response;

  try {
    response = await postJson(endpoint, {
      Authorization: `Bearer ${llmConfig.apiKey}`,
      'Content-Type': 'application/json'
    }, JSON.stringify({
        model: llmConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }));
  } catch (error) {
    if (error.code === 'ETIMEDOUT') throw new LlmError('LLM 请求超时，请稍后重试。', 504);
    const code = error.code;
    if (code === 'ENOTFOUND') throw new LlmError('无法解析 LLM 服务域名，请检查接口地址。');
    if (code === 'ECONNREFUSED') throw new LlmError('LLM 服务拒绝连接，请确认服务地址和网络代理。');
    throw new LlmError('无法连接 LLM 服务，请检查接口地址、网络或代理设置。');
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    if (response.statusCode === 401 || response.statusCode === 403) {
      throw new LlmError('LLM 服务拒绝了 API Key，请检查密钥是否有效。', 502);
    }
    if (response.statusCode === 429) throw new LlmError('LLM 服务请求过于频繁，请稍后重试。', 429);
    throw new LlmError(`LLM 服务返回错误（HTTP ${response.statusCode}）。`);
  }

  let payload;
  try {
    payload = JSON.parse(response.body);
  } catch {
    throw new LlmError('The language model provider returned an invalid response.');
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new LlmError('The language model provider returned no result.');

  try {
    return JSON.parse(content);
  } catch {
    throw new LlmError('The language model provider returned invalid JSON.');
  }
}
