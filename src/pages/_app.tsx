import AppBar from "@/components/appbar/AppBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showAppBar = router.pathname != "/iniciar-sesion"

  return(
    <>
      <SessionProvider session={pageProps.session}>
        {showAppBar && 
          <AppBar />
        }
        <main>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </>
  )
}
