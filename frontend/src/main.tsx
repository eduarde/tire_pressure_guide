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
  const escapedId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : id;
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${escapedId}"]`);
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
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.display = "none";
  iframe.style.visibility = "hidden";
  noScript.appendChild(iframe);
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
