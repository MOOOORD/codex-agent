 import { getApiKey, getModel } from './storage';

 const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

 export async function sendMessage(messages, onStream) {
   const apiKey = await getApiKey();
   if (!apiKey) {
     throw new Error('请先在设置中填写 API Key');
   }

   const model = await getModel();

   const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${apiKey}`,
     },
     body: JSON.stringify({
       model,
       messages,
       stream: !!onStream,
       temperature: 0.7,
       max_tokens: 2048,
     }),
   });

   if (!response.ok) {
     const error = await response.text();
     if (response.status === 401) {
       throw new Error('API Key 无效，请检查设置');
     } else if (response.status === 429) {
       throw new Error('请求太频繁了，稍等一下再试试～');
     } else {
       throw new Error(`请求出错了 (${response.status}): ${error}`);
     }
   }

   // 流式响应
   if (onStream) {
     const reader = response.body.getReader();
     const decoder = new TextDecoder();
     let fullContent = '';

     while (true) {
       const { done, value } = await reader.read();
       if (done) break;

       const chunk = decoder.decode(value, { stream: true });
       const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

       for (const line of lines) {
         const data = line.slice(6).trim();
         if (data === '[DONE]') continue;

         try {
           const parsed = JSON.parse(data);
           const content = parsed.choices?.[0]?.delta?.content || '';
           if (content) {
             fullContent += content;
             onStream(fullContent);
           }
         } catch { /* skip malformed chunks */ }
       }
     }

     return fullContent;
   }

   // 非流式响应
   const data = await response.json();
   return data.choices?.[0]?.message?.content || '';
 }

 // 检查 API Key 是否有效
 export async function validateApiKey(apiKey) {
   try {
     const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/models`, {
       headers: {
         'Authorization': `Bearer ${apiKey}`,
       },
     });
     return response.ok;
   } catch {
     return false;
   }
 }
