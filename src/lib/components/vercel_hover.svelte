<script lang="ts">
	import { cn } from "$functions/classnames";
	import type { Snippet } from "svelte";

	let hover_glider_element: HTMLElement | null = null,
		glider_container_element: HTMLElement | null = null;

	let {
		glider_container_class = null,
		active_element_class = null,
		direction,
		GLIDER_TRANSITION_DURATION = 200,
		children
	}: {
		glider_container_class: string | null;
		active_element_class: string | null;
		direction: "horizontal" | "vertical";
		GLIDER_TRANSITION_DURATION: number;
		children: Snippet<[(event: Event) => void, () => void]>;
	} = $props();

	let mouse_leave_timeout: NodeJS.Timeout,
		is_hovered_from_prev_el = $state(false);

	const handle_mouse_enter = (event: Event) => {
			const target = event.target as HTMLElement;
			const target_computed_style = getComputedStyle(target);
			if (glider_container_element === null || hover_glider_element === null) return;

			glider_container_element!.style.position = "relative";

			hover_glider_element!.style.height = target_computed_style.height;
			hover_glider_element!.style.width = target_computed_style.width;

			const target_zindex = parseInt(target_computed_style.zIndex);
			glider_container_element!.style.zIndex = String(target_zindex ?? 0);
			hover_glider_element!.style.zIndex = String(target_zindex - 1 ?? -1);

			switch (direction) {
				case "vertical":
					hover_glider_element!.style.transform = `translateY(${target.offsetTop}px)`;
					break;
				case "horizontal":
					hover_glider_element!.style.transform = `translateX(${target.offsetLeft}px)`;
					break;
				default:
					throw Error("Method Not Implemented");
			}

			if (is_hovered_from_prev_el) {
				GLIDER_TRANSITION_DURATION = 200;
				hover_glider_element!.style.transitionDuration = `${GLIDER_TRANSITION_DURATION}ms`;
			} else {
				GLIDER_TRANSITION_DURATION = 100;
				hover_glider_element!.style.transitionDuration = `${GLIDER_TRANSITION_DURATION}ms`;
				setTimeout(() => {
					if (hover_glider_element) {
						hover_glider_element.style.opacity = "100";
					}
				}, GLIDER_TRANSITION_DURATION);
				is_hovered_from_prev_el = true;
			}

			clearTimeout(mouse_leave_timeout);
		},
		handle_mouse_leave = () => {
			mouse_leave_timeout = setTimeout(() => {
				if (hover_glider_element) {
					hover_glider_element.style.opacity = "0";
				}
				is_hovered_from_prev_el = false;
			}, GLIDER_TRANSITION_DURATION);
		};
</script>

<div bind:this={glider_container_element} class={glider_container_class}>
	<div
		bind:this={hover_glider_element}
		class={cn(active_element_class, "absolute opacity-0 duration-200 ease-in-out")}
	></div>
	{@render children(handle_mouse_enter, handle_mouse_leave)}
</div>
