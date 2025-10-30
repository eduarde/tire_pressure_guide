import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const gtmId = import.meta.env.VITE_GTM_ID;

type DataLayerEvent = Record<string, unknown> & { event?: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

const initializeGoogleTagManager = (id: string) => {
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${id}"]`);
  if (existingScript) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const firstScript = document.getElementsByTagName("script")[0];
  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  firstScript?.parentNode?.insertBefore(gtmScript, firstScript);

  const noScript = document.createElement("noscript");
  noScript.innerHTML = `\n      <iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>\n    `;
  document.body.insertBefore(noScript, document.body.firstChild);
};

if (gtmId) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initializeGoogleTagManager(gtmId));
  } else {
    initializeGoogleTagManager(gtmId);
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
