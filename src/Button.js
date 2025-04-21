export function Button({ children, fn, styleEl }) {
	return (
		<button className={styleEl} onClick={fn}>
			{children}
		</button>
	)
}
