"use client"

import { CookiesProvider } from "react-cookie";
import { ClientLayout, ClientLayoutProps } from "./client-layout";
import Head from 'next/head'
import { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function ClientProviders(props:ClientLayoutProps) {

	return (
		<CookiesProvider>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
			<Head>
        <meta property="og:title" content="My new title" key="title" />
      </Head>
			<ClientLayout {...props} />
		</CookiesProvider>
	);
}
