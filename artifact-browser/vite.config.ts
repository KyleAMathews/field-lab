import arial from "@capsizecss/metrics/arial";
import inter from "@capsizecss/metrics/inter";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { capsizeRadixPlugin } from "vite-plugin-capsize-radix";

const config = defineConfig({
	base: "./",
	plugins: [
		capsizeRadixPlugin({
			outputPath: "./public/typography.css",
			defaultFontStack: [inter, arial],
		}),
		tanstackStart({
			spa: {
				enabled: true,
				prerender: {
					outputPath: "/index.html",
				},
			},
		}),
		viteReact(),
	],
	server: {
		port: 0,
	},
	resolve: {
		tsconfigPaths: true,
	},
});

export default config;
