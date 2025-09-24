import "@/styles/index.css";

import type { ReactNode } from "react";

interface AppLayoutProps extends LayoutProps<"/"> {}

export default function AppLayout(props: Readonly<AppLayoutProps>): ReactNode {
	const { children } = props;

	const locale = "en";

	return (
		<html lang={locale}>
			<body>{children}</body>
		</html>
	);
}
