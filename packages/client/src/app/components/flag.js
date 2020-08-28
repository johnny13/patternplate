import React from "react";
import text from "react-addons-text-content";
import { styled , Text} from "@patternplate/components";

export default Flag;

function Flag(props) {
  return <StyledText className={props.className}>{props.children}</StyledText>;
}

const StyledText = styled(Text)`
  display: inline-block;
  padding: 2px 4px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 3px;
  ${props => {
    const color = getFlagColor(text(props.children), props.theme.colors);
    return `
			border-color: ${color};
			color: ${color};
		`;
  }};
`;

function getFlagColor(flag, theme) {
  switch (flag) {
    case "alpha":
      return theme.error;
    case "beta":
      return theme.warning;
    case "rc":
      return theme.info;
    case "stable":
      return theme.success;
    case "deprecated":
      return theme.error;
    default:
      return theme.error;
  }
}
