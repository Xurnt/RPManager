"use client"

import { CookiesProvider } from "react-cookie";
import { ClientLayout, ClientLayoutProps } from "./client-layout";

export default function ClientProviders(props:ClientLayoutProps) {

	return (
		<CookiesProvider>
			<ClientLayout {...props} />
		</CookiesProvider>
	);
}
