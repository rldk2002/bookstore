import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
	${reset};
	* {
		box-sizing: border-box;
		font-family: 'Noto Sans CJK KR', Helvetica, '맑은 고딕', 'malgun gothic', 'Apple SD Gothic Neo', 'Apple SD 산돌고딕 Neo', 'Microsoft NeoGothic', 'Droid sans', sans-serif;
	}
	
	a {
		color: inherit;
		text-decoration: none;
		&:hover {
			color: #000;
		}
	}
`;

export default GlobalStyle;