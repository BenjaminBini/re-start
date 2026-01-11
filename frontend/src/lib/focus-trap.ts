/**
 * Focus trap utility for modal dialogs and drawers
 *
 * This action traps keyboard focus within a container element, preventing
 * Tab navigation from escaping to background elements. Commonly used for
 * modal dialogs, drawers, and other overlay components.
 *
 * Features:
 * - Auto-focuses first focusable element when activated
 * - Wraps Tab/Shift+Tab navigation within the container
 * - Stores and restores previously focused element
 * - Reactive to parameter changes
 */

export interface FocusTrapOptions {
	/** Whether the focus trap is active */
	active?: boolean
	/** CSS selector for focusable elements (overrides default) */
	focusableSelector?: string
	/** Element to focus initially (if not provided, focuses first focusable element) */
	initialFocus?: HTMLElement | null
	/** Whether to restore focus to previously focused element when deactivated */
	restoreFocus?: boolean
}

const DEFAULT_FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Svelte action that creates a focus trap within a container element
 *
 * @example
 * ```svelte
 * <div use:focusTrap={{ active: isOpen }}>
 *   <!-- Modal content -->
 * </div>
 * ```
 */
export function focusTrap(
	node: HTMLElement,
	options: FocusTrapOptions = {}
): { update: (options: FocusTrapOptions) => void; destroy: () => void } {
	const {
		active = true,
		focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
		initialFocus = null,
		restoreFocus = true,
	} = options

	let previouslyFocused: HTMLElement | null = null
	let currentActive = active
	let currentRestoreFocus = restoreFocus

	/**
	 * Get all focusable elements within the container
	 */
	function getFocusableElements(): HTMLElement[] {
		return Array.from(node.querySelectorAll<HTMLElement>(focusableSelector))
	}

	/**
	 * Handle Tab key to trap focus within container
	 */
	function handleKeydown(event: KeyboardEvent): void {
		if (!currentActive || event.key !== 'Tab') return

		const focusableElements = getFocusableElements()
		const firstElement = focusableElements[0]
		const lastElement = focusableElements[focusableElements.length - 1]

		if (!firstElement) return

		if (event.shiftKey) {
			// Shift+Tab: if on first element, wrap to last
			if (document.activeElement === firstElement) {
				event.preventDefault()
				lastElement?.focus()
			}
		} else {
			// Tab: if on last element, wrap to first
			if (document.activeElement === lastElement) {
				event.preventDefault()
				firstElement.focus()
			}
		}
	}

	/**
	 * Activate the focus trap
	 */
	function activate(): void {
		// Store currently focused element
		if (currentRestoreFocus) {
			previouslyFocused = document.activeElement as HTMLElement | null
		}

		// Focus initial element
		if (initialFocus) {
			initialFocus.focus()
		} else {
			const firstFocusable = getFocusableElements()[0]
			firstFocusable?.focus()
		}

		// Add keyboard listener
		node.addEventListener('keydown', handleKeydown)
	}

	/**
	 * Deactivate the focus trap
	 */
	function deactivate(): void {
		// Remove keyboard listener
		node.removeEventListener('keydown', handleKeydown)

		// Restore focus to previously focused element
		if (currentRestoreFocus && previouslyFocused) {
			previouslyFocused.focus()
			previouslyFocused = null
		}
	}

	// Initialize if active
	if (currentActive) {
		activate()
	}

	return {
		update(newOptions: FocusTrapOptions) {
			const wasActive = currentActive
			currentActive = newOptions.active ?? true
			currentRestoreFocus = newOptions.restoreFocus ?? true

			// Handle activation state changes
			if (!wasActive && currentActive) {
				activate()
			} else if (wasActive && !currentActive) {
				deactivate()
			}
		},

		destroy() {
			if (currentActive) {
				deactivate()
			}
		},
	}
}
