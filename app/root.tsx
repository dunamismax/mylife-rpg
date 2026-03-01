import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Links, type LinksFunction, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStylesHref }];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function AppRoot() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-canvas text-zinc-900 antialiased">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
