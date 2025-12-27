
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical: Could not find root element");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error("Failed to render the application:", error);
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #e11d48;">عذراً، حدث خطأ أثناء تشغيل التطبيق</h1>
        <p style="color: #64748b;">يرجى تحديث الصفحة أو المحاولة لاحقاً</p>
      </div>
    `;
  }
}
