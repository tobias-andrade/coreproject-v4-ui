import { COLOR_COUNT } from "$constants/image";
import init, { get_color_thief } from "color-thief-wasm-web";

onmessage = async function (event) {
	await init();
	let color_palette: number[][] = get_color_thief(
		new Uint8Array(event.data),
		64 * 64,
		10,
		COLOR_COUNT
	);
	postMessage(color_palette);
};
